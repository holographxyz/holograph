import {ExtractAbiFunctionNames} from 'abitype'
import pino from 'pino'
import {
  Abi,
  AbiParameterToPrimitiveType,
  Address,
  Chain,
  EstimateContractGasParameters,
  Hex,
  PublicClient,
  Transport,
  SimulateContractParameters,
  WriteContractParameters,
} from 'viem'
import {Account} from 'viem/accounts'
import {Environment} from '@holographxyz/environment'
import {Network, NetworkKey} from '@holographxyz/networks'

import {HolographBridgeABI} from '../constants/abi/develop'
import {HolographWallet} from '../services'

type _PrimitiveType = AbiParameterToPrimitiveType<{
  name: 'test'
  type: 'bytes32'
}> // NOTICE: use this to figure out which primitive type to use

export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K>}> = Partial<T> & U[keyof U]

export type PinoMethods = Pick<pino.Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'>

export interface CreateHolographLogger {
  serviceName: string
  className: string
  functionName: string
  traceId: string
}

export type HolographLoggerContext = AtLeastOne<CreateHolographLogger>

export type BridgeInERC721Args = {
  readonly from: Address
  readonly to: Address
  readonly tokenId: bigint
  readonly data: Hex
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/struct/DeploymentConfig.sol
 */
export type DeploymentConfig = {
  readonly contractType: Hex
  readonly chainType: number
  readonly salt: Hex
  readonly byteCode: Hex
  readonly initCode: Hex
}

export type Signature = {
  readonly r: Hex
  s: Hex
  v: Hex | number
}

export type DeploymentConfigSettings = {
  readonly config: DeploymentConfig
  readonly signature: Signature
  readonly signer: Address
}

export type ERC721Config = {
  erc721Hash: Hex
  erc721Config: DeploymentConfig
  erc721ConfigHash: Hex
  erc721ConfigHashBytes: Uint8Array
  erc721FutureAddress: Hex
}

export type SignDeploy = {
  readonly account: Address
  readonly config: DeploymentConfig
  readonly signature: Signature
  readonly chainId?: number
  wallet?: {account: string | HolographWallet}
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
  UNDEFINED = 0,
  IPFS = 1,
  HTTPS = 2,
  ARWEAVE = 3,
}

export enum HolographVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export type GasFee = {
  gasPrice: bigint
  gasLimit: bigint
  gas: bigint
}

export type GasPricing = {
  isEip1559: boolean
  gasPrice: bigint | null // For non EIP-1559 transactions
  nextBlockFee: bigint | null // For EIP-1559 transactions
  nextPriorityFee: bigint | null // For EIP-1559 transactions
  maxFeePerGas: bigint | null // For EIP-1559 transactions
}

export type EstimateBridgeOutResult = {
  gasSource: {chainId: number; gasPrice: bigint; gasLimit: bigint}
  gasDestination: {chainId: number; gasPrice: bigint; gasLimit: bigint}
  value: bigint
  unsignedTx: Hex
}

export type BridgeCollectionInput = {
  sourceChainId: number
  contractAddress: Address
  erc721DeploymentConfig: DeploymentConfig
  wallet: HolographWallet
}

export type BridgeNFTInput = {
  sourceChainId: number
  destinationChainId: number
  contractAddress: Address
  tokenId: Hex
  from?: Address
  to?: Address
  wallet: HolographWallet
}

export type ReadContractArgs<TAbi extends Abi> = {
  chainId: number
  address: Address
  functionName: ExtractAbiFunctionNames<TAbi>
  args?: any[]
}

export type WriteContractArgs<TAbi extends Abi> = ReadContractArgs<TAbi> & {
  wallet?: {account: string | HolographWallet}
  options?: WriteContractOptions
}

export type EstimateContractGasArgs<TAbi extends Abi> = ReadContractArgs<TAbi> & {
  wallet?: {account: string | HolographWallet}
  options?: EstimateContractGasOptions
}

export type SimulateContractArgs<TAbi extends Abi> = ReadContractArgs<TAbi> & {
  options?: SimulateContractOptions
}

export type GetContractFunctionArgs<TAbi extends Abi> = {
  chainId: number
  functionName: ExtractAbiFunctionNames<TAbi>
  wallet?: {account: string | HolographWallet}
  args?: any[]
  options?: WriteContractOptions
}

export type CallContractFunctionArgs<TAbi extends Abi> = GetContractFunctionArgs<TAbi> & {
  address: Address
  options?: WriteContractOptions
}

export type EstimateContractFunctionGasArgs<TAbi extends Abi> = GetContractFunctionArgs<TAbi> & {
  options?: EstimateContractGasOptions
}

export type SimulateContractFunctionArgs<TAbi extends Abi> = Omit<GetContractFunctionArgs<TAbi>, 'wallet'> & {
  options?: SimulateContractOptions
}

export type EstimateContractGasOptions = Partial<
  Omit<EstimateContractGasParameters, 'abi' | 'address' | 'args' | 'functionName'>
>

export type WriteContractOptions = Partial<
  Omit<WriteContractParameters, 'abi' | 'address' | 'args' | 'client' | 'functionName'>
>

export type SimulateContractOptions = Partial<
  Omit<SimulateContractParameters, 'abi' | 'address' | 'args' | 'functionName'>
>

export type GetDropInitCodeParams = {
  account: Address
  registryAddress: Address
  metadataRendererAddress: Address
  metadataRendererInitCode: Hex
  salesConfigArray: Array<string | number | bigint>
}

export type MintConfig = {
  chainId: number
  quantity?: number
  wallet?: {account: string | HolographWallet}
}

export type HolographBridgeFunctionNames = ExtractAbiFunctionNames<typeof HolographBridgeABI>

export type ViemPublicClient = PublicClient<Transport, Chain | undefined>
