import {getContract} from 'viem'
import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {HolographTreasuryABI} from '../constants/abi/develop'
import {Holograph} from './index'

type HolographTreasuryFunctionNames = ExtractAbiFunctionNames<typeof HolographTreasuryABI>

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
   * @param chainId The chain id of the network to get the result from.
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

  private async _getContractFunction(chainId: number, functionName: HolographTreasuryFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographTreasuryABI, client: provider})

    let result
    try {
      if (isReadFunction(HolographTreasuryABI, functionName)) {
        result = await contract.read[functionName](args)
      } else {
        result = await contract.write[functionName](args)
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('HolographTreasury', functionName, error)
      } else {
        holographError = new ViemError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * Get the HolographBridge contract address according to the chainId.
   * @param chainId The chain id of the network to get the result from.
   * @returns The address of the HolographBridge module
   */
  getBridge(chainId: number) {
    return this._getContractFunction(chainId, 'getBridge')
  }

  /**
   * @readonly
   * Get the HolographBridge contract address by network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the HolographBridge contract address per network.
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
   * @onlyAdmin
   * Update the Holograph Bridge module address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param bridge address of the Holograph Bridge smart contract to use.
   * @return A transaction.
   */
  async setBridge(chainId: number, bridge: Address) {
    return this._getContractFunction(chainId, 'setBridge', bridge)
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainId The chain id of the network to get the result from.
   * @returns the holograph contract address.
   */
  async getHolograph(chainId: number) {
    return this._getContractFunction(chainId, 'getHolograph')
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the holograph contract address per network.
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
   * @onlyAdmin
   * Update the Holograph Protocol contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param holograph address of the Holograph Protocol smart contract to use.
   * @return A transaction.
   */
  async setHolograph(chainId: number, holograph: Address) {
    return this._getContractFunction(chainId, 'setHolograph', holograph)
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getOperator(chainId: number) {
    return this._getContractFunction(chainId, 'getOperator')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getOperator')
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Operator contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param operator address of the Holograph Operator smart contract to use.
   * @return A transaction.
   */
  async setOperator(chainId: number, operator: Address) {
    return this._getContractFunction(chainId, 'setOperator', operator)
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
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
   * @onlyAdmin
   * Update the Holograph Registry contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param operator address of the Holograph Registry smart contract to use.
   * @return A transaction.
   */
  async setRegistry(chainId: number, registry: Address) {
    return this._getContractFunction(chainId, 'setRegistry', registry)
  }

  /**
   * @onlyAdmin
   * Withdraws native tokens from the contract.
   * @param chainId The chainId of the network to send the transaction to.
   * @return A transaction.
   */
  async withdraw(chainId: number) {
    return this._getContractFunction(chainId, 'withdraw')
  }

  /**
   * @onlyAdmin
   * Withdraws native tokens from the contract to a specified address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param recipient The address to send the withdrawn funds to.
   * @return A transaction.
   */
  async withdrawTo(chainId: number, recipient: Address) {
    return this._getContractFunction(chainId, 'withdrawTo', recipient)
  }

  /**
   * @readonly
   * Get the Holograph Mint Fee.
   * This fee is charged to mint holographable assets.
   * @param chainId The chainId of the network to get the result from.
   * @returns The mint fee.
   */
  async getHolographMintFee(chainId: number) {
    return this._getContractFunction(chainId, 'getHolographMintFee')
  }

  /**
   * @readonly
   * Get the Holograph Mint Fee by network.
   * This fee is charged to mint holographable assets.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The mint fee per network.
   */
  async getHolographMintFeeByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolographMintFee')
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Mint Fee.
   * @param fee new fee to charge for minting holographable assets.
   * @param chainId The chainId of the network to send the transaction to.
   * @returns a transaction.
   */
  async setHolographMintFee(chainId: number, fee: bigint) {
    return this._getContractFunction(chainId, 'setHolographMintFee', fee)
  }
}
