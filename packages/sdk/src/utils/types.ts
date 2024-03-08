import {ExtractAbiFunctionNames} from 'abitype'
import pino from 'pino'
import {Abi, AbiParameterToPrimitiveType, Address, Hex} from 'viem'
import {Account} from 'viem/accounts'
import {Environment} from '@holographxyz/environment'
import {Network, NetworkKey} from '@holographxyz/networks'

import {HolographBridgeABI} from '../constants/abi/develop'
import {HolographWallet} from '../services'

type _PrimitiveType = AbiParameterToPrimitiveType<{name: 'test'; type: 'uint32'}> // NOTICE: use this to figure out which primitive type to use

export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K>}> = Partial<T> & U[keyof U]

export type PinoMethods = Pick<pino.Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'>

export interface CreateHolographLogger {
  serviceName: string
  className: string
  functionName: string
  traceId: string
}

export type HolographLoggerContext = AtLeastOne<CreateHolographLogger>

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

export type BridgeSettings = {
  readonly value: bigint
  readonly gasLimit: bigint
  readonly gasPrice: bigint
  readonly toChain: number
}

export type DecodedEvent = {
  logIndex: string
  values: any[]
}

export type AccountsConfig = {
  default: HolographAccount
  [accountName: string]: HolographAccount
}

export type NetworkRpc = {[key in NetworkKey]?: string}

export type HolographConfig = {
  accounts?: AccountsConfig
  networks?: NetworkRpc
  environment?: Environment
  logLevel?: string
}

export type HolographAccountsMap = {
  default: HolographAccount | undefined
  [account: Address]: HolographAccount
}

export type HolographAccount = Account

export type HolographWalletArgs = {
  account: HolographAccount
  networks?: Network[]
  chainsRpc?: NetworkRpc
}

export type EventInfo = {
  readonly topic: string
  readonly signature: string
  readonly name: string
}

export type GasParameters = {
  msgBaseGas: bigint
  msgGasPerByte: bigint
  jobBaseGas: bigint
  jobGasPerByte: bigint
  minGasPrice: bigint
  maxGasLimit: bigint
}

export enum TokenType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export enum ContractName {
  Holograph = 'Holograph',
  HolographRegistry = 'HolographRegistry',
}

export enum BytecodeType {
  CxipERC721 = 'CxipERC721',
  HolographERC721 = 'HolographERC721',
  HolographDropERC721 = 'HolographDropERC721',
  Holographer = 'Holographer',
  EditionsMetadataRenderer = 'EditionsMetadataRenderer',
}

export enum HolographEventName {
  // TransferERC20 = 'TransferERC20',
  TransferERC721 = 'TransferERC721',
  HolographableContractEvent = 'HolographableContractEvent',
  BridgeableContractDeployed = 'BridgeableContractDeployed',
  CrossChainMessageSent = 'CrossChainMessageSent',
  AvailableOperatorJob = 'AvailableOperatorJob',
  FinishedOperatorJob = 'FinishedOperatorJob',
  // FailedOperatorJob = 'FailedOperatorJob',
  // SecondarySaleFees = 'SecondarySaleFees',
  // EditionInitialized = 'EditionInitialized',
  // PacketReceived = 'PacketReceived',
  // RelayerParams = 'RelayerParams',
  // MintFeePayout = 'MintFeePayout',
  // AssignJob = 'AssignJob',
  LzPacket = 'LzPacket',
  // Sale = 'Sale',
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/ChainIdType.sol
 */
export enum ChainIdType {
  UNDEFINED, // 0
  EVM, //       1
  HOLOGRAPH, // 2
  LAYERZERO, // 3
  HYPERLANE, // 4
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/InterfaceType.sol
 */
export enum InterfaceType {
  UNDEFINED, // 0
  ERC20, //     1
  ERC721, //    2
  ERC1155, //   3
  ROYALTIES, // 4
  GENERIC, //   5
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/TokenUriType.sol
 */
export enum TokenUriType {
  UNDEFINED, // 0
  IPFS, //      1
  HTTPS, //     2
  ARWEAVE, //   3
}

export type ReadContractArgs<TAbi extends Abi> = {
  chainId: number
  address: Address
  functionName: ExtractAbiFunctionNames<TAbi>
  args?: any[]
}

export type WriteContractArgs<TAbi extends Abi> = ReadContractArgs<TAbi> & {
  wallet?: {account: string | HolographWallet}
}

export type GetContractFunctionArgs<TAbi extends Abi> = {
  chainId: number
  functionName: ExtractAbiFunctionNames<TAbi>
  wallet?: {account: string | HolographWallet}
  args?: any[]
}

export type CallContractFunctionArgs<TAbi extends Abi> = GetContractFunctionArgs<TAbi> & {
  address: Address
}

export type HolographBridgeFunctionNames = ExtractAbiFunctionNames<typeof HolographBridgeABI>
