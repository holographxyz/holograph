import {config} from 'dotenv'
import {Hex, createPublicClient, decodeFunctionData, http} from 'viem'

import {decodeExecuteJobInput} from '../src/utils/decoders'
import {HolographOperatorABI} from '../src/constants/abi/develop'

config()

/**
 * This script decodes the input of an executeJob call.
 *
 * Usage:
 * `ts-node scripts/decode-execute-job-input.ts <RPC_URL> <TX_HASH>`
 *
 * Example:
 * `ts-node scripts/decode-execute-job-input.ts https://ethereum-rpc.publicnode.com 0xa6d9ae62f048b27e695ef3bab6cff11aea0ce0bf04f915bc7450cfbff6670a3e`
 */

async function main() {
  const scriptArgs = process.argv.slice(2)

  if (scriptArgs.length !== 2) {
    console.error('Error: Wrong number of arguments.')
    console.log('Usage: ts-node scripts/decode-execute-job-input.ts <RPC_URL> <TX_HASH>')
    process.exit(1)
  }
  const [rpcUrl, txHash] = scriptArgs

  const client = createPublicClient({transport: http(rpcUrl)})

  const tx = await client.getTransaction({hash: txHash as Hex})

  // signature: function executeJob(bytes calldata bridgeInRequestPayload) external payable
  const {args} = decodeFunctionData({
    abi: HolographOperatorABI,
    data: tx.input,
  })

  const executeJobInput = decodeExecuteJobInput(args[0] as Hex)

  console.log('Finished decoding executeJob input:')
  console.log(executeJobInput)
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
