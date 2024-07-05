import {Address} from 'abitype'
import {Hex} from 'viem'

import {HolographContract} from '.'
import {HolographFactoryABI} from '../constants/abi/develop'
import {HolographLogger, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {
  BridgeSettings,
  DeploymentConfig,
  EstimateContractFunctionGasArgs,
  GetContractFunctionArgs,
  Signature,
  WriteContractOptions,
} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

/**
 * @group Contracts
 * HolographFactory
 *
 * @remarks
 *
 * Deploy holographable contracts.
 * The contract provides methods that allow for the creation of Holograph Protocol compliant smart contracts, that are capable of minting holographable assets.
 *
 */
export class FactoryContract extends HolographBaseContract {
  constructor(parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: FactoryContract.name})
    } else {
      logger = HolographLogger.createLogger({className: FactoryContract.name})
    }

    super(logger, HolographFactoryABI, 'HolographFactory')
  }

  /**
   * @readonly
   * Get the HolographFactory contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new HolographContract()
      const add = (await holograph.getFactory(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: GetContractFunctionArgs<typeof HolographFactoryABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args, options})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractFunctionGasArgs<typeof HolographFactoryABI>) {
    const address = await this.getAddress(chainId)
    return this._estimateContractGas({chainId, address, functionName, wallet, args, options})
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * Used for storing a reference to all the primary modules and variables of the protocol.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph Protocol contract address in the provided network.
   */
  async getHolograph(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getHolograph'})
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * Used for storing a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Protocol contract address per network.
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
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph Registry contract address in the provided network.
   */
  async getRegistry(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getRegistry'})
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Registry contract address per network.
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
   * Updates the Holograph Protocol module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param holograph The address of the Holograph Protocol smart contract to use.
   * @returns A transaction hash.
   */
  async setHolograph(
    chainId: number,
    holograph: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, wallet, functionName: 'setHolograph', args: [holograph], options})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Registry module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param registry The address of the Holograph Registry smart contract to use.
   * @returns A transaction hash.
   */
  async setRegistry(
    chainId: number,
    registry: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, wallet, functionName: 'setRegistry', args: [registry], options})
  }

  /**
   * Deploy a holographable smart contract.
   * Using this function allows to deploy smart contracts that have the same address across all EVM chains.
   * @param chainId The chain id of the network to send the transaction.
   * @param config The contract deployment configurations.
   * @param signature The signature which was created by the wallet that created the original payload.
   * @param signer The address of wallet that created the payload.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction hash.
   */
  async deployHolographableContract(
    chainId: number,
    config: DeploymentConfig,
    signature: Signature,
    signer: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'deployHolographableContract',
      args: [config, signature, signer],
      options,
    })
  }

  /**
   * Updates the Holograph Registry module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param config The contract deployment configurations.
   * @param signature The signature which was created by the wallet that created the original payload.
   * @param signer The address of wallet that created the payload.
   * @param deployOnCurrentChain Whether to deploy the contract on the current chain.
   * @param bridgeSettings The BridgeSettings[] struct for each chain to deploy the contract on.
   * @returns A transaction hash.
   */
  async deployHolographableContractMultiChain(
    chainId: number,
    config: DeploymentConfig,
    signature: Signature,
    signer: Address,
    deployOnCurrentChain = true,
    bridgeSettings: BridgeSettings[] = [],
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'deployHolographableContractMultiChain',
      args: [config, signature, signer, deployOnCurrentChain, bridgeSettings],
      options,
    })
  }

  /**
   * Deploy holographable contract via bridge request.
   * This function directly forwards the calldata to the deployHolographableContract function.
   * It is used to allow for Holograph Bridge to make cross-chain deployments.
   * @param chainId The chain id of the network to send the transaction.
   * @param fromChain The chain id of the network to get the result from.
   * @param payload The calldata to be used in the deployHolographableContract function.
   * @returns The function selector of the deployHolographableContract function.
   */
  async bridgeIn(
    chainId: number,
    fromChain: number,
    payload: Hex,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, wallet, functionName: 'bridgeIn', args: [fromChain, payload], options})
  }

  /**
   * Deploy holographable contract via bridge request.
   * This function directly returns the calldata.
   * It is used to allow for Holograph Bridge to make cross-chain deployments.
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The destination chain id.
   * @param sender The address of person making the request.
   * @param payload The payload of the request.
   * @returns An array with the bridgeOut function selector and the provided payload
   */
  async bridgeOut(chainId: number, toChain: number, sender: Address, payload: Hex): Promise<[string, string]> {
    return this._getContractFunction({chainId, functionName: 'bridgeOut', args: [toChain, sender, payload]})
  }
}
