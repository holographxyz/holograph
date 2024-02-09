import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'
import {isCallException} from 'ethers'

import {Addresses} from '../constants/addresses'
import {HolographABI} from '../constants/abi/develop'
import {HolographLogger, Config, Providers} from '../services'
import {EthersError, HolographError, ContractRevertError} from '../errors'
import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {getContract} from '../utils/abitype'

type HolographFunctionNames = ExtractAbiFunctionNames<typeof HolographABI, 'view'>

//TODO: add error handling

/**
 * @group Contracts
 * Holograph
 *
 * @remarks
 *
 * Holograph is the primary entry point for all users and developers. A single, universal address across all blockchains will enable developers an easy way to interact with the protocol’s features. Holograph keeps references for all current Registry, Factory, and Bridge implementations. Furthermore, it allows for single interface management of the underlying protocol.
 *
 * Holograph provides a reference to the name and ID of all supported blockchains. Additionally, it:
 *  - enables custom contract logic that is chain-dependent
 *  - frees developers from having to query and monitor the blockchain
 *
 */
export class Holograph {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  private readonly providers: Providers
  private logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this.providers = new Providers(config)

    if (parentLogger) {
      this.logger = parentLogger.addContext({className: Holograph.name})
    } else {
      this.logger = HolographLogger.createLogger({className: Holograph.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get  the Holograph contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph contract address in the provided network.
   */
  getAddress(chainId?: number | string): Address {
    return Addresses.holograph(this.config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction(chainId: number, functionName: HolographFunctionNames, ...args: any[]) {
    const logger = this.logger.addContext({functionName})
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    logger.info({chainId, address}, 'getting holograph contract')
    const contract = getContract({address, abi: HolographABI, signerOrProvider: provider})

    let result
    try {
      result = await contract[functionName](...args)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('Holograph', functionName, error)
      } else {
        holographError = new EthersError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * Get the address of the Holograph Bridge module.
   * Used for beaming holographable assets cross-chain.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographBridge contract address in the provided network.
   */
  async getBridge(chainId: number) {
    return this._getContractFunction(chainId, 'getBridge')
  }

  /**
   * @readonly
   * Get the address of the Holograph Bridge module.
   * Used for beaming holographable assets cross-chain.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographBridge contract address per network.
   */
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getBridge')
    }

    return results
  }

  // TODO: if the value is the same for all networks, there's no need to check for a specific one
  /**
   * Get the chain ID that the Protocol was deployed on.
   * Useful for checking if/when a hard fork occurs.
   * @param chainId The chainId of the network to get the result from.
   * @returns The chainId in the provided network.
   */
  async getChainId(chainId: number) {
    return this._getContractFunction(chainId, 'getChainId')
  }

  // TODO: if the value is the same for all networks, there's no need to check for all.
  /**
   * @readonly
   * Get the chain ID that the Protocol was deployed on.
   * Useful for checking if/when a hard fork occurs.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The chaiIds per network.
   */
  async getChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getChainId')
    }

    return results
  }

  /**
   * Get the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  async getFactory(chainId: number) {
    return this._getContractFunction(chainId, 'getFactory')
  }

  /**
   * @readonly
   * Get the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographFactory contract address per network.
   */
  async getFactoryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getFactory')
    }

    return results
  }

  /**
   * Get the Holograph chain Id.
   * Holograph uses an internal chain id mapping.
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph chainID in the provided network.
   */
  async getHolographChainId(chainId: number) {
    return this._getContractFunction(chainId, 'getHolographChainId')
  }

  /**
   * @readonly
   * Get the Holograph chain Id.
   * Holograph uses an internal chain id mapping.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph chainId per network.
   */
  async getHolographChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolographChainId')
    }

    return results
  }

  /**
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  async getInterfaces(chainId: number) {
    return this._getContractFunction(chainId, 'getInterfaces')
  }

  /**
   * @readonly
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographInterfaces contract address per network.
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
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge beams are handled by the Holograph Operator module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getOperator(chainId: number) {
    return this._getContractFunction(chainId, 'getOperator')
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge beams are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographOperator contract address per network.
   */
  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getOperator')
    }

    return results
  }

  /**
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  async getRegistry(chainId: number) {
    return this._getContractFunction(chainId, 'getRegistry')
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographRegistry contract address per network.
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
   * Get the Holograph Treasury module.
   * All of the Holograph Protocol assets are stored and managed by this module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographTreasury contract address in the provided network.
   */
  async getTreasury(chainId: number) {
    return this._getContractFunction(chainId, 'getTreasury')
  }

  /**
   * @readonly
   * Get the Holograph Treasury module.
   * All of the Holograph Protocol assets are stored and managed by this module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographTreasury contract address per network.
   */
  async getTreasuryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getTreasury')
    }

    return results
  }

  /**
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HToken contract address in the provided network.
   */
  async getUtilityToken(chainId: number) {
    return this._getContractFunction(chainId, 'getUtilityToken')
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HToken contract address per network.
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
