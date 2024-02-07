import {Network} from '@holographxyz/networks'
import {isCallException} from 'ethers'
import {Address} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {ContractRevertError, EthersError, HolographError} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {HolographTreasuryABI} from '../constants/abi/develop'
import {Holograph} from './index'
import {getContract} from '../utils/abitype'

/**
 * @group Contracts
 * HolographTreasury
 *
 * @remarks
 *
 * The Treasury holds and manages the protocol treasury.
 *
 */
export class Treasury {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: Treasury.name})
    } else {
      this._logger = HolographLogger.createLogger({className: Treasury.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the HolographTreasury contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographTreasury contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this.config)
      const add = (await holograph.getTreasury(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  /**** getBridge ****/

  /**
   * Get the HolographBridge contract address according to the chainId.
   * @param chainId The chainId of the network to get the result from.
   * @returns The address of the HolographBridge module
   */
  private async _getBridge(chainId: number) {
    const logger = this._logger.addContext({functionName: this._getBridge.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographTreasuryABI, signerOrProvider: provider})

    let result
    try {
      result = await contract.getBridge()
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(
          'HolographTreasury',
          contract.getHolograph.name,
          error,
          this._getBridge.name,
        )
      } else {
        holographError = new EthersError(error, this._getBridge.name)
      }

      logger.logHolographError(error)

      throw holographError
    }

    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Treasury#_getBridge}
   * */
  getBridge(chainId: number) {
    return this._getBridge(chainId)
  }

  /**
   * @readonly
   * Get the HolographBridge contract address by network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @return the HolographBridge contract address per network.
   */
  async getBridgeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getBridge(network.chain)
    }

    return results
  }

  /**** getHolograph ****/

  /**
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainId The chainId of the network to get the result from.
   * @return the holograph contract address.
   */
  private async _getHolograph(chainId: number) {
    const logger = this._logger.addContext({functionName: this._getHolograph.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographTreasuryABI, signerOrProvider: provider})

    let result
    try {
      result = await contract.getHolograph()
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(
          'HolographTreasury',
          contract.getHolograph.name,
          error,
          this._getHolograph.name,
        )
      } else {
        holographError = new EthersError(error, this._getHolograph.name)
      }

      logger.logHolographError(error)

      throw holographError
    }

    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Treasury_getHolograph}
   * */
  async getHolograph(chainId: number) {
    return this._getHolograph(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @return the holograph contract address per network.
   */
  async getHolographByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolograph(network.chain)
    }

    return results
  }

  /**** getOperator ****/

  /**
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge beams are handled by the Holograph Operator module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  private async _getOperator(chainId: number) {
    const logger = this._logger.addContext({functionName: this._getOperator.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographTreasuryABI, signerOrProvider: provider})

    let result
    try {
      result = await contract.getOperator()
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(
          'HolographTreasury',
          contract.getOperator.name,
          error,
          this._getOperator.name,
        )
      } else {
        holographError = new EthersError(error, this._getOperator.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Treasury#_getOperator}
   * */
  async getOperator(chainId: number) {
    return this._getOperator(chainId)
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
      results[network.chain] = await this._getOperator(network.chain)
    }

    return results
  }

  /**** getRegistry ****/

  /**
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  private async _getRegistry(chainId: number) {
    const logger = this._logger.addContext({functionName: this._getRegistry.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographTreasuryABI, signerOrProvider: provider})

    let result
    try {
      result = await contract.getRegistry()
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(
          'HolographTreasury',
          contract.getRegistry.name,
          error,
          this._getRegistry.name,
        )
      } else {
        holographError = new EthersError(error, this._getRegistry.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Treasury#_getRegistry}
   * */
  async getRegistry(chainId: number) {
    return this._getRegistry(chainId)
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
      results[network.chain] = await this._getRegistry(network.chain)
    }

    return results
  }
}
