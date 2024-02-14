import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'
import {isCallException} from 'ethers'

import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {getContract} from '../utils/abitype'
import {ContractRevertError, EthersError, HolographError} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {LayerZeroModuleABI} from '../constants/abi/develop'
import {Addresses} from '../constants/addresses'

type LayerZeroModuleFunctionNames = ExtractAbiFunctionNames<typeof LayerZeroModuleABI, 'view'>

/**
 * @group Contracts
 * LayerZeroModule
 *
 * @remarks
 *
 * Holograph module for enabling LayerZero cross-chain messaging.
 * This contract abstracts all of the LayerZero specific logic into an isolated module.
 *
 */
export class LayerZeroModule {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: LayerZeroModule.name})
    } else {
      this._logger = HolographLogger.createLogger({className: LayerZeroModule.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get  the LayerZeroModule contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The LayerZeroModule contract address in the provided network.
   */
  getAddress(chainId?: number | string): Address {
    return Addresses.layerZeroModule(this.config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction(chainId: number, functionName: LayerZeroModuleFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract({address, abi: LayerZeroModuleABI, signerOrProvider: provider})

    let result
    try {
      result = await contract[functionName](...args)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('LayerZeroModule', functionName, error)
      } else {
        holographError = new EthersError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * Get the default or chain-specific GasParameters.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The gas parameters per network.
   */
  async getGasParametersByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getGasParameters', network.holographId)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Optimism Gas Price Oracle module.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Optimism gas price oracle contract address per network.
   */
  async getOptimismGasPriceOracleByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getOptimismGasPriceOracle')
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the approved LayerZero Endpoint.
   * All lzReceive function calls allow only requests from this address.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The LayerZero endpoint/address per network.
   */
  async getLZEndpointByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getLZEndpoint')
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Bridge contract address by network.
   * Used for bridging holographable assets cross-chain.
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
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Interfaces contract address per network.
   */
  async getInterfacesByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getInterfaces')
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Operator module by network.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Operator contract address per network.
   */
  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getOperator')
    }

    return results
  }
}
