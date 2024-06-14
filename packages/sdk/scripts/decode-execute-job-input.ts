// @ts-nocheck
import {config} from 'dotenv'
import {Address, Hex, createPublicClient, decodeAbiParameters, decodeFunctionData, http, parseAbiParameters} from 'viem'

import {HolographOperatorABI} from '../src/constants/abi/develop'

config()

const RPC_URL = process.env.RPC_URL

async function main() {
  if (RPC_URL === undefined) {
    console.error(`RPC_URL env is required!`)
    process.exit(1)
  }

  const client = createPublicClient({transport: http(RPC_URL)})

  const txHash = '0xa6d9ae62f048b27e695ef3bab6cff11aea0ce0bf04f915bc7450cfbff6670a3e'

  const tx = await client.getTransaction({hash: txHash})

  // this tx calls the executeJob function
  //  function executeJob(bytes calldata bridgeInRequestPayload) external payable

  const {args} = decodeFunctionData({
    abi: HolographOperatorABI,
    data: tx.input,
  })

  const bridgeInRequestPayload = args[0] as Hex
  const functionSelector = bridgeInRequestPayload.slice(2, 10)
  const gasPrice = bridgeInRequestPayload.slice(-64)
  const gasLimit = bridgeInRequestPayload.slice(-64)
  const bridgeInPayload = `0x${bridgeInRequestPayload.slice(11, -128)}` as Hex

  const decodedBridgeInRequest = decodeAbiParameters(
    parseAbiParameters([
      'uint256', // nonce
      'uint32', // fromChain
      'address', // holographableContract
      'address', // hToken
      'address', // hTokenRecipient
      'uint256', // hTokenValue (fee)
      'bool', // doNotRevert
      'bytes', // bridgeInPayload
    ]),
    bridgeInPayload,
  )

  console.log(decodedBridgeInRequest)

  const decodedBridgeInPayload = decodeAbiParameters(
    parseAbiParameters([
      'address', // bridgeInPayload.payload.from
      'address', // bridgeInPayload.payload.to
      'uint256', // bridgeInPayload.payload.amount
      'bytes', // bridgeInPayload.payload.data
    ]),
    decodedBridgeInRequest[7],
  )

  // @ts-ignore-start
  const executeJobInput = {
    functionSelector,
    bridgeInRequestArgs: {
      nonce: decodedBridgeInRequest[0],
      fromChain: decodedBridgeInRequest[1],
      holographableContract: decodedBridgeInRequest[2],
      hToken: decodedBridgeInRequest[3],
      hTokenRecipient: decodedBridgeInRequest[4],
      hTokenFeeValue: decodedBridgeInRequest[5],
      doNotRevert: decodedBridgeInRequest[6],
      bridgeInPayload: {
        from: decodedBridgeInPayload[0],
        to: decodedBridgeInPayload[1],
        amount_or_tokenId: decodedBridgeInPayload[2],
        data: decodedBridgeInPayload[3],
      },
    },
    gasLimit,
    gasPrice,
  }

  console.log('Finished decoding executeJob input:')
  console.log(executeJobInput)
}

type BridgeInERC721RequestPayload = {
  chainId: number
  from: Address
  to: Address
  tokenId: string
  data: Hex
}

type BridgeInERC20RequestPayload = {
  chainId: number
  from: Address
  to: Address
  amount: string
  data: Hex
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
