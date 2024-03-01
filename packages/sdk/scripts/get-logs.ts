import {config} from 'dotenv'
import {Log, PublicClient, createPublicClient, http, parseAbi} from 'viem'
import {HOLOGRAPH_EVENTS} from '../src/constants/events'

config()

/**
 * Example usage of the 'getLogs' function in the CLI using Viem.
 *
 * While Viem's 'getLogs' may lack some functionalities compared to ethers' 'getLogs',
 * this limitation should not hinder its current use case.
 */

const RPC_URL = process.env.POLYGON_TESTNET_RPC_URL

type LogsParams = {
  network: string
  fromBlock: number
  toBlock?: number
  tags?: (string | number)[]
  attempts?: number
  canFail?: boolean
  interval?: number
}

const sleep = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms))

async function retry<T>(network: string, func: () => Promise<T>, attempts = 10, interval = 5000): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await func()
      if (result !== null) {
        return result
      }
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed: ${error.message}`)

      if (i === attempts - 1) {
        // If this was the last attempt, throw the error.
        throw error
      }

      // Sleep before the next attempt.
      await sleep(interval)
    }
  }

  throw new Error(`Maximum attempts reached for ${func.name}, function did not succeed after ${attempts} attempts`)
}

async function getLogs(
  client: PublicClient,
  {fromBlock, toBlock, network, tags = [] as (string | number)[], attempts = 10, interval = 10_000}: LogsParams,
) {
  /**
   * This filter implementation differs from ethers in its inability to filter by topics. It only supports filtering by event ABIs and contract addresses. More complex filters involving indexed parameters in events, such as filtering all token transfers *from* a specific address, are not supported.
   *
   * For ethers-based filtering, refer to: https://docs.ethers.io/v5/concepts/events/#events--filters
   *
   * Example: List all token transfers *to* either myAddress or myOtherAddress in the block 43608688:
   * filter = {
   *   fromBlock: 43608688,
   *   toBlock: 43608688,
   *   address: tokenAddress,
   *   topics: [
   *     utils.id("Transfer(address,address,uint256)"),
   *     null,
   *     [
   *       hexZeroPad(myAddress, 32),
   *       hexZeroPad(myOtherAddress, 32),
   *     ]
   *   ]
   * };
   */
  const filter = {
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock ? toBlock : fromBlock),
    events: parseAbi([
      HOLOGRAPH_EVENTS.HolographableContractEvent.signature,
      HOLOGRAPH_EVENTS.FinishedOperatorJob.signature,
    ]),
  }

  const getLogs = async () => {
    try {
      const logs: Log[] | null = await client.getLogs(filter)
      if (logs === null) {
        // If logs is null, we throw an error to indicate failure.
        throw new Error('Logs is null')
      } else {
        return logs as Log[]
      }
    } catch (error: any) {
      if (error.message !== 'cannot query unfinalized data') {
        console.error(`[${network}] Failed retrieving logs for block ${fromBlock} [${tags}]`)
        // In case of any other error, we throw it to be caught by the retry function.
        throw error
      }

      // If we can't query unfinalized data, we return null.
      return null
    }
  }

  try {
    return await retry(network, getLogs, attempts, interval)
  } catch (error) {
    console.error(`[${network}] Error retrieving logs after ${attempts} attempts: ${error} [${tags}]`)
    return null
  }
}

async function main() {
  if (RPC_URL === undefined) {
    console.error(`POLYGON_TESTNET_RPC_URL env is required!`)
    process.exit(1)
  }

  const client = createPublicClient({transport: http(RPC_URL)})

  let logs = await getLogs(client, {
    network: 'Polygon Mumbai',
    fromBlock: 43608688,
    toBlock: 43608688,
    attempts: 2,
  })

  console.log('number of logs: ', logs?.length)
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
