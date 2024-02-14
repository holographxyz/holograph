import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'
import {isCallException} from 'ethers'

import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {getContract} from '../utils/abitype'
import {ContractRevertError, EthersError, HolographError} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {HolographOperatorABI} from '../constants/abi/develop'
import {Holograph} from './index'

type HolographOperatorFunctionNames = ExtractAbiFunctionNames<typeof HolographOperatorABI, 'view'>

/**
 * @group Contracts
 * HolographOperator
 *
 * @remarks
 *
 * The Operator holds and manages the protocol operator.
 *
 */
export class Operator {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: Operator.name})
    } else {
      this._logger = HolographLogger.createLogger({className: Operator.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the HolographOperator contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this.config)
      const add = (await holograph.getOperator(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction(chainId: number, functionName: HolographOperatorFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographOperatorABI, signerOrProvider: provider})

    let result
    try {
      result = await contract[functionName](...args)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('HolographOperator', functionName, error)
      } else {
        holographError = new EthersError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * Get the details for an available operator job.
   * @param chainId The chainId of the network to get the result from.
   * @param jobHash keccak256 hash of the job.
   * @returns an OperatorJob struct with details about a specific job.
   */
  async getJobDetails(chainId: number, jobHash: Address) {
    return this._getContractFunction(chainId, 'getJobDetails', jobHash)
  }

  /**
   * Get number of pods available.
   * @param chainId The chainId of the network to get the result from.
   * @returns number of pods that have been opened via bonding.
   */
  async getTotalPods(chainId: number) {
    return this._getContractFunction(chainId, 'getTotalPods')
  }

  /**
   * Get total number of operators in a pod.
   * @param chainId The chainId of the network to get the result from.
   * @param pod the pod to query.
   * @returns total operators in a pod.
   */
  async getPodOperatorsLength(chainId: number, pod: bigint | number) {
    return this._getContractFunction(chainId, 'getPodOperatorsLength', pod)
  }

  /**
   * Get list of operators in a pod.
   * @param chainId The chainId of the network to get the result from.
   * @param pod the pod to query.
   * @returns operators array list of operators in a pod.
   */
  async getPodOperators(chainId: number, pod: bigint | number) {
    return this._getContractFunction(chainId, 'getPodOperators', pod)
  }

  /**
   * Get paginated list of operators in a pod.
   * @param pod the pod to query.
   * @param index the array index to start from.
   * @param length the length of result set to be (will be shorter if reached end of array).
   * @returns operators a paginated array of operators.
   */
  async getPaginatedPodOperators(chainId: number, pod: bigint | number, index: number, length: number) {
    return this._getContractFunction(chainId, 'getPodOperators', pod, index, length)
  }

  /**
   * Check the base and current price for bonding to a particular pod.
   * @param pod the pod to get bonding amounts for.
   * @returns base the base bond amount required for a pod.
   * @returns current the current bond amount required for a pod.
   */
  async getPodBondAmounts(chainId: number, pod: bigint | number) {
    return this._getContractFunction(chainId, 'getPodBondAmounts', pod)
  }

  /**
   * Get an operator's currently bonded amount.
   * @param operator address of operator to check.
   * @returns amount total number of utility token bonded.
   */
  async getBondedAmount(chainId: number, operator: Address) {
    return this._getContractFunction(chainId, 'getBondedAmount', operator)
  }

  /**
   * Get an operator's currently bonded pod.
   * @param operator address of operator to check.
   * @returns pod number that operator is bonded on, returns zero if not bonded or selected for job.
   */
  async getBondedPod(chainId: number, operator: Address) {
    return this._getContractFunction(chainId, 'getBondedPod', operator)
  }

  /**
   * Get an operator's currently bonded pod index.
   * @param operator address of operator to check.
   * @returns index currently bonded pod's operator index, returns zero if not in pod or moved out for active job.
   */
  async getBondedPodIndex(chainId: number, operator: Address) {
    return this._getContractFunction(chainId, 'getBondedPodIndex', operator)
  }

  /**
   * Get the Minimum Gas Price.
   * @returns The minimum value required to execute a job without it being marked as under priced.
   */
  async getMinGasPrice(chainId: number) {
    return this._getContractFunction(chainId, 'getMinGasPrice')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolograph')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getBridge')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getRegistry')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getMessagingModule')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getUtilityToken')
    }

    return results
  }
}