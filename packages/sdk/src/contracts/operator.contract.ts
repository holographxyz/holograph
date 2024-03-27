import {Address, Hex} from 'viem'

import {Holograph} from './index'
import {HolographOperatorABI} from '../constants/abi/develop'
import {HolographLogger, Config, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {EstimateContractFunctionGasArgs, GetContractFunctionArgs, SimulateContractFunctionArgs} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

/**
 * @group Contracts
 * HolographOperator
 *
 * @remarks
 *
 * The Operator holds and manages the protocol operator.
 *
 */
export class Operator extends HolographBaseContract {
  constructor(_config: Config, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: Operator.name})
    } else {
      logger = HolographLogger.createLogger({className: Operator.name})
    }

    super(_config, logger, HolographOperatorABI, 'HolographOperator')
  }

  /**
   * @readonly
   * Get the HolographOperator contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this._config)
      const add = (await holograph.getOperator(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof HolographOperatorABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractFunctionGasArgs<typeof HolographOperatorABI>) {
    const address = await this.getAddress(chainId)
    return this._estimateContractGas({chainId, address, functionName, wallet, args, options})
  }

  async simulateContractFunction({
    chainId,
    functionName,
    args,
    options,
  }: SimulateContractFunctionArgs<typeof HolographOperatorABI>) {
    const address = await this.getAddress(chainId)
    return this._simulateContract({chainId, address, functionName, args, options})
  }

  /**
   * @readonly
   * Get the details for an available operator job.
   * @param chainId The chain id of the network to get the result from.
   * @param jobHash keccak256 hash of the job.
   * @returns an OperatorJob struct with details about a specific job.
   */
  async getJobDetails(chainId: number, jobHash: Address) {
    return this._getContractFunction({chainId, functionName: 'getJobDetails', args: [jobHash]})
  }

  /**
   * @readonly
   * Get number of pods available.
   * @param chainId The chain id of the network to get the result from.
   * @returns number of pods that have been opened via bonding.
   */
  async getTotalPods(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getTotalPods'})
  }

  /**
   * @readonly
   * Get total number of operators in a pod.
   * @param chainId The chain id of the network to get the result from.
   * @param pod the pod to query.
   * @returns total operators in a pod.
   */
  async getPodOperatorsLength(chainId: number, pod: bigint | number) {
    return this._getContractFunction({chainId, functionName: 'getPodOperatorsLength', args: [pod]})
  }

  /**
   * @readonly
   * Get list of operators in a pod.
   * @param chainId The chain id of the network to get the result from.
   * @param pod the pod to query.
   * @returns operators array list of operators in a pod.
   */
  async getPodOperators(chainId: number, pod: bigint | number) {
    return this._getContractFunction({chainId, functionName: 'getPodOperators', args: [pod]})
  }

  /**
   * @readonly
   * Get paginated list of operators in a pod.
   * @param chainId The chain id of the network to get the result from.
   * @param pod the pod to query.
   * @param index the array index to start from.
   * @param length the length of result set to be (will be shorter if reached end of array).
   * @returns operators a paginated array of operators.
   */
  async getPaginatedPodOperators(chainId: number, pod: bigint | number, index: number, length: number) {
    return this._getContractFunction({chainId, functionName: 'getPodOperators', args: [pod, index, length]})
  }

  /**
   * @readonly
   * Check the base and current price for bonding to a particular pod.
   * @param chainId The chain id of the network to get the result from.
   * @param pod the pod to get bonding amounts for.
   * @returns base the base bond amount required for a pod.
   * @returns current the current bond amount required for a pod.
   */
  async getPodBondAmounts(chainId: number, pod: bigint | number) {
    return this._getContractFunction({chainId, functionName: 'getPodBondAmounts', args: [pod]})
  }

  /**
   * @readonly
   * Get an operator's currently bonded amount.
   * @param chainId The chain id of the network to get the result from.
   * @param operator address of operator to check.
   * @returns amount total number of utility token bonded.
   */
  async getBondedAmount(chainId: number, operator: Address) {
    return this._getContractFunction({chainId, functionName: 'getBondedAmount', args: [operator]})
  }

  /**
   * @readonly
   * Get an operator's currently bonded pod.
   * @param chainId The chain id of the network to get the result from.
   * @param operator address of operator to check.
   * @returns pod number that operator is bonded on, returns zero if not bonded or selected for job.
   */
  async getBondedPod(chainId: number, operator: Address) {
    return this._getContractFunction({chainId, functionName: 'getBondedPod', args: [operator]})
  }

  /**
   * @readonly
   * Get an operator's currently bonded pod index.
   * @param chainId The chain id of the network to get the result from.
   * @param operator address of operator to check.
   * @returns index currently bonded pod's operator index, returns zero if not in pod or moved out for active job.
   */
  async getBondedPodIndex(chainId: number, operator: Address) {
    return this._getContractFunction({chainId, functionName: 'getBondedPodIndex', args: [operator]})
  }

  /**
   * @readonly
   * Get the Minimum Gas Price.
   * @param chainId The chain id of the network to get the result from.
   * @returns The minimum value required to execute a job without it being marked as under priced.
   */
  async getMinGasPrice(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getMinGasPrice'})
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract address by network.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the Holograph contract address per network.
   */
  async getHolographByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getHolograph'})
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Bridge contract address by network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the Holograph Bridge contract address per network.
   */
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getBridge'})
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Registry module by network.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Registry contract address per network.
   */
  async getRegistryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getRegistry'})
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Messaging Module by network.
   * All cross-chain message requests will get forwarded to this address.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Messaging Module contract address per network.
   */
  async getMessagingModuleByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getMessagingModule',
      })
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address by network.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Utility Token contract address per network.
   */
  async getUtilityTokenByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getUtilityToken',
      })
    }

    return results
  }

  /**
   * @readonly
   * Get the fees associated with sending specific payload.
   * It will provide exact costs on protocol and message side, combine the two to get total.
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The Holograph chain id of destination chain for payload.
   * @param gasLimit The amount of gas to provide for executing payload on destination chain.
   * @param gasPrice The maximum amount to pay for gas price, can be set to 0 and will be chose automatically.
   * @param crossChainPayload The entire packet being sent cross-chain.
   * @returns stringifiedFeesArray The compound fees [hlfFee, msgFee, dstGasPrice]:
   * hlgFee: The amount (in wei) of native gas token that will cost for finalizing job on destination chain.
   * msgFee: The amount (in wei) of native gas token that will cost for sending message to destination chain.
   * dstGasPrice: The amount (in wei) that destination message maximum gas price will be.
   */
  async getMessageFee(chainId: number, toChain: number, gasLimit: bigint, gasPrice: bigint, crossChainPayload: Hex) {
    return this._getContractFunction({
      chainId,
      functionName: 'getMessageFee',
      args: [toChain, gasLimit, gasPrice, crossChainPayload],
    })
  }

  /**
   * Sends cross chain bridge request message.
   * This function is restricted to only be callable by Holograph Bridge.
   * @param chainId The chain id of the network to send the transaction.
   * @param gasLimit The maximum amount of gas to spend for executing the bridge on destination chain.
   * @param gasPrice The maximum amount of gas price (in destination chain native gas token) to pay on destination chain.
   * @param toChain The  Holograph Chain ID where the bridge is being sent to.
   * @param nonce The incremented number used to ensure job hashes are unique.
   * @param holographableContract The address of the contract for which the bridge request is being made.
   * @param bridgeOutPayload The bytes made up of the bridgeOutRequest payload.
   * @returns A transaction.
   */
  async send(
    chainId: number,
    gasLimit: bigint,
    gasPrice: bigint,
    toChain: number,
    nonce: bigint,
    holographableContract: Address,
    bridgeOutPayload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      functionName: 'send',
      args: [gasLimit, gasPrice, toChain, nonce, holographableContract, bridgeOutPayload],
      wallet,
    })
  }

  /**
   * Recovers a failed job. If a job fails, it can be manually recovered.
   * @param chainId The chain id of the network to send the transaction.
   * @param bridgeInRequestPayload The entire cross chain message payload.
   * @returns A transaction.
   */
  async recoverJob(chainId: number, bridgeInRequestPayload: Hex, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'recoverJob', args: [bridgeInRequestPayload], wallet})
  }

  /**
   * Executes an available operator job.
   * When making this call, if operating criteria is not met, the call will revert.
   * @param chainId The chain id of the network to send the transaction.
   * @param bridgeInRequestPayload The entire cross chain message payload.
   * @returns A transaction.
   */
  async executeJob(chainId: number, bridgeInRequestPayload: Hex, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'executeJob', args: [bridgeInRequestPayload], wallet})
  }

  /**
   * Purposefully made to be external so that Operator can call it during executeJob function.
   * @param chainId The chain id of the network to send the transaction.
   * @param msgSender The address of who is sending the message.
   * @param payload The entire cross chain message payload.
   * @returns A transaction.
   */
  async nonRevertingBridgeCall(
    chainId: number,
    msgSender: Address,
    payload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      functionName: 'nonRevertingBridgeCall',
      args: [msgSender, payload],
      wallet,
    })
  }

  /**
   * Receives a cross-chain message.
   * This function is restricted for use by Holograph Messaging Module only.
   * @param chainId The chain id of the network to send the transaction.
   * @param bridgeInRequestPayload The entire cross chain message payload.
   * @returns A transaction.
   */
  async crossChainMessage(chainId: number, bridgeInRequestPayload: Hex, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({
      chainId,
      functionName: 'crossChainMessage',
      args: [bridgeInRequestPayload],
      wallet,
    })
  }

  /**
   * Calculates the amount of gas needed to execute a bridgeInRequest.
   * Use this function to estimate the amount of gas that will be used by the bridgeInRequest function.
   * Set a specific gas limit when making this call, subtract return value, to get total gas used.
   * @param chainId The chain id of the network to send the transaction.
   * @param bridgeInRequestPayload The abi encoded bytes making up the bridgeInRequest payload.
   * @returns The gas amount remaining after the static call is returned.
   */
  async jobEstimator(chainId: number, bridgeInRequestPayload: Hex) {
    return this._getContractFunction({chainId, functionName: 'jobEstimator', args: [bridgeInRequestPayload]})
  }

  /**
   * Topup a bonded operator with more utility tokens.
   * Useful function if an operator got slashed and wants to add a safety buffer to not get unbonded.
   * This function will not work if operator has currently been selected for a job.
   * @param chainId The chain id of the network to send the transaction.
   * @param operator The address of operator to topup.
   * @param amount The utility token amount to add.
   * @returns A transaction.
   */
  async topupUtilityToken(
    chainId: number,
    operator: Address,
    amount: bigint,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({chainId, functionName: 'topupUtilityToken', args: [operator, amount], wallet})
  }

  /**
   * Bonds utility tokens and become an operator.
   * An operator can only bond to one pod at a time, per network.
   * @param chainId The chain id of the network to send the transaction.
   * @param operator The address of operator to bond (can be an ownable smart contract).
   * @param amount The utility token amount to bond (can be greater than minimum).
   * @param pod The number of pod to bond to (can be for one that does not exist yet).
   * @returns A transaction.
   */
  async bondUtilityToken(
    chainId: number,
    operator: Address,
    amount: bigint,
    pod: bigint,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({chainId, functionName: 'bondUtilityToken', args: [operator, amount, pod], wallet})
  }

  /**
   * Unbonds HLG utility tokens and stop being an operator.
   * A bonded operator selected for a job cannot unbond until they complete the job, or are slashed.
   * @param chainId The chain id of the network to send the transaction.
   * @param operator The address of operator to unbond.
   * @param recipient The address where to send the bonded tokens.
   * @returns A transaction.
   */
  async unbondUtilityToken(
    chainId: number,
    operator: Address,
    recipient: Address,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({chainId, functionName: 'unbondUtilityToken', args: [operator, recipient]})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Bridge module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param bridge The address of the Holograph Bridge smart contract to use.
   * @returns A transaction.
   */
  async setBridge(chainId: number, bridge: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setBridge', args: [bridge], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Protocol contract address.
   * @param chainId The chain id of the network to send the transaction.
   * @param holograph The address of the Holograph Protocol smart contract to use.
   * @returns A transaction.
   */
  async setHolograph(chainId: number, holograph: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setHolograph', args: [holograph], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Interfaces module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param interfaces The address of the Holograph Interfaces smart contract to use.
   * @returns A transaction.
   */
  async setInterfaces(chainId: number, interfaces: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setInterfaces', args: [interfaces], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Messaging Module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param messagingModule The address of the LayerZero Endpoint to use.
   * @returns A transaction.
   */
  async setMessagingModule(chainId: number, messagingModule: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setMessagingModule', args: [messagingModule], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Registry module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param registry The address of the Holograph Registry smart contract to use.
   * @returns A transaction.
   */
  async setRegistry(chainId: number, registry: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setRegistry', args: [registry], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Utility Token address.
   * @param chainId The chain id of the network to send the transaction.
   * @param utilityToken The address of the Holograph Utility Token smart contract to use.
   * @returns A transaction.
   */
  async setUtilityToken(chainId: number, utilityToken: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setUtilityToken', args: [utilityToken], wallet})
  }

  /**
   * @onlyAdmin
   * Updates the Minimum Gas Price.
   * @param chainId The chain id of the network to send the transaction.
   * @param minGasPrice The amount to set for minimum gas price.
   * @returns A transaction.
   */
  async setMinGasPrice(chainId: number, minGasPrice: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setMinGasPrice', args: [minGasPrice], wallet})
  }
}
