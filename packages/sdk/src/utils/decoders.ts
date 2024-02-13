import {HOLOGRAPH_EVENTS, HolographEventName} from '../constants/events'
import {lowerCaseAllStrings} from './transformers'
import {
  Hex,
  parseAbi,
  TransactionReceipt,
  parseEventLogs,
  Log,
  Address,
  decodeAbiParameters,
  parseAbiParameters,
  numberToHex,
} from 'viem'

export type BridgeInErc721Args = {
  readonly from: Address
  readonly to: Address
  readonly tokenId: bigint
  readonly data: Hex
}

export type DeploymentConfig = {
  readonly config: {
    readonly contractType: Hex
    readonly chainType: number
    readonly salt: Hex
    readonly byteCode: Hex
    readonly initCode: Hex
  }

  readonly signature: {
    readonly r: Hex
    readonly s: Hex
    readonly v: number
  }

  readonly signer: Address
}

export type DecodedEvent = {
  logIndex: string
  values: any[]
}

export function decodeEvent(
  receipt: TransactionReceipt,
  holographEventName: HolographEventName,
  target?: Address,
): DecodedEvent[] {
  let logs = parseEventLogs({
    abi: parseAbi([HOLOGRAPH_EVENTS[holographEventName].signature]),
    eventName: HOLOGRAPH_EVENTS[holographEventName].name,
    logs: receipt.logs,
  })

  if (target !== undefined) {
    logs = logs.filter((log: Log) => log.address.toLowerCase() === target.toLowerCase().trim())
  }

  let decodedEvents: DecodedEvent[]

  decodedEvents = logs.map((log: Log & {args: Object}) => {
    const values = Object.values(log.args)
    return {
      logIndex: String(log.logIndex!),
      values: lowerCaseAllStrings(values as any[]),
    }
  })

  return decodedEvents
}

export function decodeErc721TransferEvent(receipt: TransactionReceipt, target?: Address): DecodedEvent[] {
  let decodedEvent = decodeEvent(receipt, HolographEventName.TransferERC721, target)

  decodedEvent.forEach((event: DecodedEvent) => (event.values[2] = numberToHex(event.values[2], {size: 32})))

  return decodedEvent
}

export function decodeCrossChainMessageSentEvent(receipt: TransactionReceipt, target?: Address): DecodedEvent[] {
  return decodeEvent(receipt, HolographEventName.CrossChainMessageSent, target)
}

export function decodeAvailableOperatorJobEvent(receipt: TransactionReceipt, target?: Address): DecodedEvent[] {
  return decodeEvent(receipt, HolographEventName.AvailableOperatorJob, target)
}

export function decodeBridgeableContractDeployedEvent(receipt: TransactionReceipt, target?: Address): DecodedEvent[] {
  return decodeEvent(receipt, HolographEventName.BridgeableContractDeployed, target)
}

export function decodeLzPacketEvent(
  receipt: TransactionReceipt,
  messagingModuleAddress: Address,
  target?: Address,
): DecodedEvent[] {
  const events = decodeEvent(receipt, HolographEventName.LzPacket, target)

  const toFind = messagingModuleAddress.slice(2, 42) // await operatorContract.getMessagingModule()).toLowerCase()

  for (const event of events) {
    const packetPayload = event.values[0].toLowerCase()

    if (packetPayload.indexOf(toFind) > 0) {
      let index: number = packetPayload.indexOf(toFind)
      // address + bytes2 + address
      index += 40 + 4 + 40
      event.values[0] = ('0x' + packetPayload.slice(Math.max(0, index))).toLowerCase()
    }
  }
  return events
}

export function decodeBridgeInErc721Args(input: Hex): BridgeInErc721Args {
  const decoded = decodeAbiParameters(
    parseAbiParameters('address from, address to, uint256 tokenId, bytes data'),
    input,
  )

  return {
    from: decoded[0],
    to: decoded[1],
    tokenId: decoded[2],
    data: decoded[3],
  } as BridgeInErc721Args
}

export function decodeDeploymentConfigInput(input: Hex): DeploymentConfig {
  //0xdf6516bd: This is the function hash for "function deployHolographableContract(DeploymentConfig memory config, Verification memory signature, address signer)"
  // 0xa8935c67: This is the function hash for function deployHolographableContractMultiChain( DeploymentConfig memory config, Verification memory signature, address signer, bool deployOnCurrentChain, BridgeSettings[] memory bridgeSettings ) external payable
  if (input.startsWith('0xdf6516bd') || input.startsWith('0xa8935c67')) {
    return decodeDeploymentConfig(`0x${input.slice(10)}`)
  }
  // This is the function hash for function executeJob(bytes calldata bridgeInRequestPayload) external payable
  else if (input.startsWith('0x778fd1d1')) {
    // Special 722 characters from start
    // Removing 0x prepend
    // Function hash (4 bytes)
    // Payload calldata offset (32 bytes)
    // Payload bytes length (32 bytes)
    // Holographable target contract (32 bytes)
    // HtokenAddress (32 bytes)
    // HtokenRecipient(32 bytes)
    // HtokenAmount(32 bytes)
    // Removing boolean (32 bytes)
    // BridgeInPayload calldata offset(32 bytes)
    // BridgeInPayload byte length (32 bytes)

    // Special 184 character from end
    // Trimming gas price (32 bytes)
    // Gas limit (32 bytes)
    // Empty padding (28 bytes)
    return decodeDeploymentConfig(`0x${input.substring(722, input.length - 184)}`)
  } else {
    throw new Error('Unknown deployment config function')
  }
}

export function decodeDeploymentConfig(input: Hex): DeploymentConfig {
  const decodedConfig = decodeAbiParameters(
    parseAbiParameters([
      'DeploymentConfig config',
      'struct DeploymentConfig { bytes32 contractType; uint32 chainType; bytes32 salt; bytes byteCode; bytes initCode; }',
      'Verification signature',
      'struct Verification { bytes32 r; bytes32 s; uint8 v; }',
      'address signer',
    ]),
    input,
  )

  return {
    config: {...decodedConfig[0]}, // @ts-ignore NOTE: for some reason the inference for the the return type is wrong
    signature: {...decodedConfig[1]}, // @ts-ignore
    signer: decodedConfig[2].toLowerCase(),
  }
}
