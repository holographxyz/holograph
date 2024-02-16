import {getContract} from 'viem'
import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {HolographFactoryABI} from '../constants/abi/develop'
import {Holograph} from '.'
import {BridgeSettings, DeploymentConfig} from '../utils/decoders'

type HolographFactoryFunctionNames = ExtractAbiFunctionNames<typeof HolographFactoryABI>

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
export class Factory {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: Factory.name})
    } else {
      this._logger = HolographLogger.createLogger({className: Factory.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get  the HolographFactory contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this.config)
      const add = (await holograph.getFactory(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction(chainId: number, functionName: HolographFactoryFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographFactoryABI, client: provider})

    let result
    try {
      if (isReadFunction(HolographFactoryABI, functionName)) {
        result = await contract.read[functionName](args)
      } else {
        result = await contract.write[functionName](args)
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('HolographFactory', functionName, error)
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
   * Get the Holograph Protocol contract.
   * Used for storing a reference to all the primary modules and variables of the protocol.
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph Protocol contract address in the provided network.
   */
  async getHolograph(chainId: number) {
    return this._getContractFunction(chainId, 'getHolograph')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolograph')
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph Registry contract address in the provided network.
   */
  async getRegistry(chainId: number) {
    return this._getContractFunction(chainId, 'getRegistry')
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getRegistry')
    }

    return results
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Protocol module address.
   * @param holograph The address of the Holograph Protocol smart contract to use.
   * @returns A transaction.
   */
  async setHolograph(chainId: number, holograph: Address) {
    return this._getContractFunction(chainId, 'setHolograph', holograph)
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Registry module address.
   * @param registry The address of the Holograph Registry smart contract to use.
   * @returns A transaction.
   */
  async setRegistry(chainId: number, registry: Address) {
    return this._getContractFunction(chainId, 'setRegistry', registry)
  }

  /**
   * Deploy a holographable smart contract.
   * Using this function allows to deploy smart contracts that have the same address across all EVM chains.
   * @param config The contract deployment configurations.
   * @param signature The signature which was created by the wallet that created the original payload.
   * @param signer The address of wallet that created the payload.
   * @returns A transaction.
   */
  async deployHolographableContract(
    chainId: number,
    config: DeploymentConfig['config'],
    signature: DeploymentConfig['signature'],
    signer: Address,
  ) {
    return this._getContractFunction(chainId, 'deployHolographableContract', config, signature, signer)
  }

  /**
   * Updates the Holograph Registry module address.
   * @param config The contract deployment configurations.
   * @param signature The signature which was created by the wallet that created the original payload.
   * @param signer The address of wallet that created the payload.
   * @param deployOnCurrentChain Whether to deploy the contract on the current chain.
   * @param bridgeSettings The BridgeSettings[] struct for each chain to deploy the contract on.
   * @returns A transaction.
   */
  async deployHolographableContractMultiChain(
    chainId: number,
    config: DeploymentConfig['config'],
    signature: DeploymentConfig['signature'],
    signer: Address,
    deployOnCurrentChain = true,
    bridgeSettings: BridgeSettings[] = [],
  ) {
    return this._getContractFunction(
      chainId,
      'deployHolographableContractMultiChain',
      config,
      signature,
      signer,
      deployOnCurrentChain,
      bridgeSettings,
    )
  }

  /**
   * Deploy holographable contract via bridge request.
   * This function directly forwards the calldata to the deployHolographableContract function.
   * It is used to allow for Holograph Bridge to make cross-chain deployments.
   * @param fromChain The chainId of the network to get the result from.
   * @param payload The calldata to be used in the deployHolographableContract function.
   * @returns The function selector of the deployHolographableContract function.
   */
  async bridgeIn(chainId: number, fromChain: number, payload: string | Buffer) {
    return this._getContractFunction(chainId, 'bridgeIn', fromChain, payload)
  }

  /**
   * Deploy holographable contract via bridge request.
   * This function directly returns the calldata.
   * It is used to allow for Holograph Bridge to make cross-chain deployments.
   * @param toChain The chainId of the network to get the result from.
   * @param sender The address of person making the request.
   * @param payload The payload of the request.
   * @returns The function selector, and its calldata.
   */
  async bridgeOut(chainId: number, toChain: number, sender: Address, payload: string | Buffer) {
    return this._getContractFunction(chainId, 'bridgeOut', toChain, sender, payload)
  }
}
