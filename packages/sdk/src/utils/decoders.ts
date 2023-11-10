import {BigNumberish, EventFragment, Interface, AbiCoder} from 'ethers'
import {TransactionReceipt} from '@ethersproject/abstract-provider'

import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'
import {lowerCaseAllStrings} from './transformers'

export type BridgeInErc721Args = {
  readonly from: number
  readonly to: string
  readonly tokenId: BigNumberish
  readonly data: string
}

export type DeploymentConfig = {
  readonly config: {
    readonly contractType: string
    readonly chainType: string
    readonly salt: string
    readonly byteCode: string
    readonly initCode: string
  }

  readonly signature: {
    readonly r: string
    readonly s: string
    readonly v: number
  }

  readonly signer: string
}

export const iface: Interface = new Interface([])

const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder()

export function decodeEvent(
  receipt: TransactionReceipt,
  eventInfo: EventInfo,
  target?: string,
): readonly string[] | undefined {
  if (target !== undefined) {
    target = target.toLowerCase().trim()
  }

  if ('logs' in receipt && receipt.logs !== null && receipt.logs.length > 0) {
    for (let i = 0, l = receipt.logs.length; i < l; i++) {
      const log = receipt.logs[i]
      if (
        log.topics[0] === eventInfo.topic &&
        (target === undefined || (target !== undefined && log.address.toLowerCase() === target))
      ) {
        const event = iface.decodeEventLog(
          EventFragment.from(eventInfo.signature),
          log.data,
          log.topics,
        ) as readonly string[]

        return lowerCaseAllStrings(event).concat(String(log.logIndex))
      }
    }
  }

  return undefined
}

export function decodeErc721TransferEvents(
  receipt: TransactionReceipt,
  target?: string,
): readonly (readonly string[])[] | undefined {
  const eventInfo = HOLOGRAPH_EVENTS.TransferERC721

  if (target !== undefined) {
    target = target.toLowerCase().trim()
  }

  const decodedEvents: (readonly string[])[] = []

  if ('logs' in receipt && receipt.logs !== null && receipt.logs.length > 0) {
    for (let i = 0, l = receipt.logs.length; i < l; i++) {
      const log = receipt.logs[i]
      if (
        log.topics[0] === eventInfo.topic &&
        (target === undefined || (target !== undefined && log.address.toLowerCase() === target))
      ) {
        const event = iface.decodeEventLog(
          EventFragment.from(eventInfo.signature),
          log.data,
          log.topics,
        ) as readonly string[]
        decodedEvents.push(lowerCaseAllStrings(event).concat(String(log.logIndex)))
      }
    }
  }

  if (decodedEvents.length > 0) {
    return decodedEvents
  }
  return undefined
}

export function decodeErc721TransferEvent(receipt: TransactionReceipt, target?: string): readonly string[] | undefined {
  const event = decodeEvent(receipt, HOLOGRAPH_EVENTS.TransferERC721, target)
  return event
}

export function decodeCrossChainMessageSentEvent(receipt: TransactionReceipt, target?: string): string | undefined {
  const event = decodeEvent(receipt, HOLOGRAPH_EVENTS.CrossChainMessageSent, target)
  return event === undefined ? undefined : event[0].toLowerCase()
}

export function decodeLzPacketEvent(
  receipt: TransactionReceipt,
  messagingModuleAddress: string,
  target?: string,
): string | undefined {
  const event = decodeEvent(receipt, HOLOGRAPH_EVENTS.LzPacket, target)

  if (event === undefined) {
    return undefined
  }

  const packetPayload = event[0].toLowerCase()

  const toFind = messagingModuleAddress.slice(2, 42) // await operatorContract.getMessagingModule()).toLowerCase()

  if (packetPayload.indexOf(toFind) > 0) {
    let index: number = packetPayload.indexOf(toFind)
    // address + bytes2 + address
    index += 40 + 4 + 40
    return ('0x' + packetPayload.slice(Math.max(0, index))).toLowerCase()
  }
  return undefined
}

export function decodeAvailableOperatorJobEvent(
  receipt: TransactionReceipt,
  target?: string,
): readonly string[] | undefined {
  const event = decodeEvent(receipt, HOLOGRAPH_EVENTS.AvailableOperatorJob, target)
  return event
}

export function decodeBridgeableContractDeployedEvent(
  receipt: TransactionReceipt,
  target?: string,
): readonly string[] | undefined {
  const event = decodeEvent(receipt, HOLOGRAPH_EVENTS.BridgeableContractDeployed, target)
  return event
}

export function decodeBridgeInErc721Args(input: string): BridgeInErc721Args {
  const decoded = abiCoder.decode(['address from', 'address to', 'uint256 tokenId', 'bytes data'], input)

  return {
    from: decoded.from,
    to: decoded.to,
    tokenId: decoded.tokenId,
    data: decoded.data,
  } as BridgeInErc721Args
}

export function decodeDeploymentConfigInput(input: string): DeploymentConfig {
  return decodeDeploymentConfig('0x' + input.slice(10))
}

export function decodeDeploymentConfig(input: string): DeploymentConfig {
  const decodedConfig = abiCoder.decode(
    [
      'tuple(bytes32 contractType, uint32 chainType, bytes32 salt, bytes byteCode, bytes initCode) config',
      'tuple(bytes32 r, bytes32 s, uint8 v) signature',
      'address signer',
    ],
    input,
  )

  return {
    config: {
      contractType: decodedConfig.config.contractType,
      chainType: decodedConfig.config.chainType,
      salt: decodedConfig.config.salt,
      byteCode: decodedConfig.config.byteCode,
      initCode: decodedConfig.config.initCode,
    },
    signature: {
      r: decodedConfig.signature.r,
      s: decodedConfig.signature.s,
      v: decodedConfig.signature.v,
    },
    signer: decodedConfig.signer,
  }
}
