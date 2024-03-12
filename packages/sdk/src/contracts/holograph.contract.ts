import {Address} from 'abitype'

import {Addresses} from '../constants/addresses'
import {HolographABI} from '../constants/abi/develop'
import {HolographLogger, Config} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {GetContractFunctionArgs} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

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
export class Holograph extends HolographBaseContract {
  constructor(_config: Config, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: Holograph.name})
    } else {
      logger = HolographLogger.createLogger({className: Holograph.name})
    }

    super(_config, logger, HolographABI, 'Holograph')
  }

  /**
   * @readonly
   * Get the Holograph contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph contract address in the provided network.
   */
  getAddress(chainId?: number | string): Address {
    return Addresses.holograph(this._config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof HolographABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Get the address of the Holograph Bridge module.
   * Used for bridging holographable assets cross-chain.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographBridge contract address in the provided network.
   */
  async getBridge(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getBridge'})
  }

  /**
   * @readonly
   * Get the address of the Holograph Bridge module.
   * Used for bridging holographable assets cross-chain.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographBridge contract address per network.
   */
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getBridge'})
    }

    return results
  }

  // TODO: if the value is the same for all networks, there's no need to check for a specific one
  /**
   * @readonly
   * Get the chain ID that the Protocol was deployed on.
   * Useful for checking if/when a hard fork occurs.
   * @param chainId The chain id of the network to get the result from.
   * @returns The chainId in the provided network.
   */
  async getChainId(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getChainId'})
  }

  // TODO: if the value is the same for all networks, there's no need to check for all.
  /**
   * @readonly
   * Get the chain ID that the Protocol was deployed on.
   * Useful for checking if/when a hard fork occurs.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The chainIds per network.
   */
  async getChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getChainId'})
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  async getFactory(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getFactory'})
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
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getFactory'})
    }

    return results
  }

  /**
   * @readonly
   * Get The Holograph chain id.
   * Holograph uses an internal chain id mapping.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph chainID in the provided network.
   */
  async getHolographChainId(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getHolographChainId'})
  }

  /**
   * @readonly
   * Get The Holograph chain id.
   * Holograph uses an internal chain id mapping.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph chainId per network.
   */
  async getHolographChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getHolographChainId',
      })
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  async getInterfaces(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getInterfaces'})
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
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getInterfaces'})
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getOperator(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getOperator'})
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographOperator contract address per network.
   */
  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getOperator'})
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  async getRegistry(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getRegistry'})
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
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getRegistry'})
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Treasury module.
   * All of the Holograph Protocol assets are stored and managed by this module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographTreasury contract address in the provided network.
   */
  async getTreasury(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getTreasury'})
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
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getTreasury'})
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HToken contract address in the provided network.
   */
  async getUtilityToken(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getUtilityToken'})
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
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getUtilityToken',
      })
    }

    return results
  }
}
