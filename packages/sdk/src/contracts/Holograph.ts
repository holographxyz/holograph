import {Network} from '@holographxyz/networks'

import {getHandlerLogger} from '../config/logger'
import {Addresses} from '../constants/addresses'
import {Providers} from '../services/providers.service'
import {Config} from '../config/config.service'
import {HolographABI} from '../constants/abi/develop'
import {HolographByNetworksResponse, getContract, getSelectedNetworks} from '../utils/contracts'

//TODO: add error handling and maybe retry logic

export class Holograph {
  // private readonly logger //TODO: improve Logger
  public readonly networks: Network[]

  constructor(private readonly config: Config, private readonly providers: Providers) {
    // this.logger = getHandlerLogger().child({service: Holograph.name})
    this.networks = this.config.networks
  }

  // Internal function used to actually make the RPC call
  // This has logic protecting the provider calls and any lower level errors
  private async _getBridge(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return contract.getBridge()
  }

  // External function that users call
  // This function captures lower level errors and makes then nice errors
  // uses a preconfigured provider
  async getBridge(chainId: number) {
    return this._getBridge(chainId)
  }

  // This function captures lower level errors and makes then nice errors
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getBridge(network.chain)
    }

    return results
  }

  // External function that users call
  // This function lets a caller provide the provider directly
  // getBridgeWithProvider(provider: Provider): Promise<string>

  async getChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      const provider = this.providers.byChainId(network.chain)
      const address = Addresses.holograph(this.config.environment, network.chain)

      const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

      results[network.chain] = await contract.getChainId()
    }

    return results
  }

  private async _getFactory(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return await contract.getFactory()
  }

  async getFactory(chainId: number) {
    return this._getFactory(chainId)
  }

  async getFactoryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getFactory(network.chain)
    }

    return results
  }

  private async _getHolographChainId(chainId: number): Promise<string> {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return (await contract.getHolographChainId()).toString()
  }

  async getHolographChainId(chainId: number): Promise<string> {
    return this._getHolographChainId(chainId)
  }

  async getHolographChainIdByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolographChainId(network.chain)
    }

    return results
  }

  private async _getInterfaces(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return await contract.getInterfaces()
  }

  async getInterfaces(chainId: number) {
    return this._getInterfaces(chainId)
  }

  async getInterfacesByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getInterfaces(network.chain)
    }

    return results
  }

  private async _getOperator(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return contract.getOperator()
  }

  async getOperator(chainId: number) {
    return this._getOperator(chainId)
  }

  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getOperator(network.chain)
    }

    return results
  }

  private async _getRegistry(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return contract.getRegistry()
  }

  async getRegistry(chainId: number) {
    return this._getRegistry(chainId)
  }

  async getRegistryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getRegistry(network.chain)
    }

    return results
  }

  private async _getUtilityToken(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = Addresses.holograph(this.config.environment, chainId)

    const contract = getContract<typeof HolographABI>(address, HolographABI, provider)

    return contract.getUtilityToken()
  }

  async getUtilityToken(chainId: number) {
    return this._getUtilityToken(chainId)
  }

  async getUtilityTokenByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getUtilityToken(network.chain)
    }

    return results
  }
}
