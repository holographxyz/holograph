import {Address, Hex} from 'viem'

import {HolographTreasuryABI} from '../constants/abi/develop'
import {HolographLogger, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {GetContractFunctionArgs, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'
import {HolographContract} from '.'

/**
 * @group Contracts
 * HolographTreasury
 *
 * @remarks
 *
 * The Treasury holds and manages the protocol treasury.
 *
 */
export class TreasuryContract extends HolographBaseContract {
  constructor(parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: TreasuryContract.name})
    } else {
      logger = HolographLogger.createLogger({className: TreasuryContract.name})
    }

    super(logger, HolographTreasuryABI, 'HolographTreasury')
  }

  /**
   * @readonly
   * Get the HolographTreasury contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographTreasury contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new HolographContract()
      const add = (await holograph.getTreasury(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof HolographTreasuryABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Get the HolographBridge contract address according to the chainId.
   * @param chainId The chain id of the network to get the result from.
   * @returns The address of the HolographBridge module
   */
  getBridge(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getBridge'})
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
      results[network.chain] = await this.getBridge(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Bridge module address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param bridge address of the Holograph Bridge smart contract to use.
   * @return A transaction hash.
   */
  async setBridge(
    chainId: number,
    bridge: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setBridge', args: [bridge], wallet, options})
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainId The chain id of the network to get the result from.
   * @returns the holograph contract address.
   */
  async getHolograph(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getHolograph'})
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the holograph contract address per network.
   */
  async getHolographByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getHolograph(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Protocol contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param holograph address of the Holograph Protocol smart contract to use.
   * @return A transaction hash.
   */
  async setHolograph(
    chainId: number,
    holograph: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setHolograph', args: [holograph], wallet, options})
  }

  /**
   * @readonly
   * Get the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getOperator(chainId: number): Promise<Address> {
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
      results[network.chain] = await this.getOperator(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Operator contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param operator address of the Holograph Operator smart contract to use.
   * @return A transaction hash.
   */
  async setOperator(
    chainId: number,
    operator: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setOperator', args: [operator], wallet, options})
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  async getRegistry(chainId: number): Promise<Address> {
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
      results[network.chain] = await this.getRegistry(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Registry contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param operator address of the Holograph Registry smart contract to use.
   * @return A transaction hash.
   */
  async setRegistry(
    chainId: number,
    registry: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setRegistry', args: [registry], wallet, options})
  }

  /**
   * @onlyAdmin
   * Withdraws native tokens from the contract.
   * @param chainId The chainId of the network to send the transaction to.
   * @return A transaction hash.
   */
  async withdraw(
    chainId: number,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'withdraw', wallet, options})
  }

  /**
   * @onlyAdmin
   * Withdraws native tokens from the contract to a specified address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param recipient The address to send the withdrawn funds to.
   * @return A transaction hash.
   */
  async withdrawTo(
    chainId: number,
    recipient: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'withdrawTo', args: [recipient], wallet})
  }

  /**
   * @readonly
   * Get the Holograph Mint Fee.
   * This fee is charged to mint holographable assets.
   * @param chainId The chainId of the network to get the result from.
   * @returns The mint fee.
   */
  async getHolographMintFee(chainId: number): Promise<bigint> {
    return this._getContractFunction({chainId, functionName: 'getHolographMintFee'})
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
      results[network.chain] = await this.getHolographMintFee(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Mint Fee.
   * @param fee new fee to charge for minting holographable assets.
   * @param chainId The chainId of the network to send the transaction to.
   * @returns a transaction hash.
   */
  async setHolographMintFee(
    chainId: number,
    fee: bigint,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setHolographMintFee', args: [fee], wallet, options})
  }
}
