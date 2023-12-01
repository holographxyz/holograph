import {Network} from '@holographxyz/networks'

import {Addresses} from '../constants/addresses'
import {Providers} from '../services'
import {Config} from '../services/config.service'
import {HolographABI} from '../constants/abi/develop'
import {HolographByNetworksResponse, getContract, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {HolographLogger} from '../services/logger.service'

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
  private logger: HolographLogger

  constructor(private readonly config: Config, private readonly providers: Providers, parentLogger?: HolographLogger) {
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
  getAddress(chainId?: number | string) {
    return Addresses.holograph(this.config.environment, Number(chainId))
  }

  /**
   * Get the address of the Holograph Bridge module.
   * Used for beaming holographable assets cross-chain.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographBridge contract address in the provided network.
   */
  private async _getBridge(chainId: number) {
    const logger = this.logger.addContext({functionName: this._getBridge.name})
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    logger.info({chainId, address}, 'getting holograph contract')
    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getBridge()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getBridge}
   * */
  async getBridge(chainId: number) {
    return this._getBridge(chainId)
  }

  /**
   * @readonly
   * Get the address of the Holograph Bridge module.
   * Used for beaming holographable assets cross-chain.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographBridge contract address per network.
   */
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getBridge(network.chain)
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
  private async _getChainId(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getChainId()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getChainId}
   * */
  async getChainId(chainId: number) {
    return this._getChainId(chainId)
  }

  // TODO: if the value is the same for all networks, there's no need to check for all.
  /**
   * @readonly
   * Get the chain ID that the Protocol was deployed on.
   * Useful for checking if/when a hard fork occurs.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The chaiIds per network.
   */
  async getChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getChainId(network.chain)
    }

    return results
  }

  /**
   * Get the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  private async _getFactory(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getFactory()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getFactory}
   * */
  async getFactory(chainId: number) {
    return this._getFactory(chainId)
  }

  /**
   * @readonly
   * Get the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographFactory contract address per network.
   */
  async getFactoryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getFactory(network.chain)
    }

    return results
  }

  /**
   * Get the Holograph chain Id.
   * Holograph uses an internal chain id mapping.
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph chainID in the provided network.
   */
  private async _getHolographChainId(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getHolographChainId()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getHolographChainId}
   * */
  async getHolographChainId(chainId: number) {
    return this._getHolographChainId(chainId)
  }

  /**
   * @readonly
   * Get the Holograph chain Id.
   * Holograph uses an internal chain id mapping.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The Holograph chainId per network.
   */
  async getHolographChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolographChainId(network.chain)
    }

    return results
  }

  /**
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  private async _getInterfaces(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getInterfaces()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getInterfaces}
   * */
  async getInterfaces(chainId: number) {
    return this._getInterfaces(chainId)
  }

  /**
   * @readonly
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographInterfaces contract address per network.
   */
  async getInterfacesByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getInterfaces(network.chain)
    }

    return results
  }

  /**
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge beams are handled by the Holograph Operator module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  private async _getOperator(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getOperator()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getOperator}
   * */
  async getOperator(chainId: number) {
    return this._getOperator(chainId)
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge beams are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographOperator contract address per network.
   */
  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getOperator(network.chain)
    }

    return results
  }

  /**
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  private async _getRegistry(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getRegistry()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getRegistry}
   * */
  async getRegistry(chainId: number) {
    return this._getRegistry(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographRegistry contract address per network.
   */
  async getRegistryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getRegistry(network.chain)
    }

    return results
  }

  /**
   * Get the Holograph Treasury module.
   * All of the Holograph Protocol assets are stored and managed by this module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographTreasury contract address in the provided network.
   */
  private async _getTreasury(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getTreasury()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getTreasury}
   * */
  async getTreasury(chainId: number) {
    return this._getTreasury(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Treasury module.
   * All of the Holograph Protocol assets are stored and managed by this module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HolographTreasury contract address per network.
   */
  async getTreasuryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getTreasury(network.chain)
    }

    return results
  }

  /**
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HToken contract address in the provided network.
   */
  private async _getUtilityToken(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    const result = await contract.getUtilityToken()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Holograph#_getUtilityToken}
   * */
  async getUtilityToken(chainId: number) {
    return this._getUtilityToken(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @returns The HToken contract address per network.
   */
  async getUtilityTokenByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getUtilityToken(network.chain)
    }

    return results
  }
}
