import {Network} from '@holographxyz/networks'
import {getContract} from 'viem'
import {Address} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {HolographLogger, Providers, Config} from '../services'
import {HolographRegistryABI} from '../constants/abi/develop'
import {Holograph} from './index'

type HolographRegistryFunctionNames = ExtractAbiFunctionNames<typeof HolographRegistryABI, 'view'>

//TODO: add error handling

/**
 * @group Contracts
 * HolographRegistry
 *
 * @remarks
 *
 * Registry is a central on-chain location where all Holograph data is stored. Registry keeps a record of all currently supported standards. New standards can be introduced and enabled as well. Any properly deployed Holographed contracts are also stored as reference. This allows for a definitive way to identify whether a smart contract is secure and properly Holographed. Verifying entities will be able to identify a Holographed contract to ensure the highest level of security and standards.
 *
 */
export class Registry {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: Registry.name})
    } else {
      this._logger = HolographLogger.createLogger({className: Registry.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the HolographRegistry contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this.config)
      const add = (await holograph.getRegistry(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction(chainId: number, functionName: HolographRegistryFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographRegistryABI, client: provider})

    let result
    try {
      result = await contract.read[functionName](args)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('HolographRegistry', functionName, error)
      } else {
        holographError = new ViemError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * Checks if the contract it's aligned with the Holograph standard.
   * @param chainId The chainId of the network to get the result from.
   * @param contractAddress The contract address.
   * @returns true if it's holographed, and false otherwise.
   */
  async isHolographedContract(chainId: number, contractAddress: Address) {
    return this._getContractFunction(chainId, 'isHolographedContract', contractAddress)
  }

  /**
   * @readonly
   * Checks if the contract it's aligned with the Holograph standard by network.
   * @param contractAddress The contract address.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns true if it's holographed, and false otherwise per network.
   */
  async isHolographedContractByNetworks(
    contractAddress: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'isHolographedContract', contractAddress)
    }

    return results
  }

  //TODO: add a better description! Hash of what?
  /**
   * Checks if the hash is deployed.
   * @param chainId The chainId of the network to get the result from.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @returns true if it's deployed, and false otherwise.
   */
  async isHolographedHashDeployed(chainId: number, hash: Address) {
    return this._getContractFunction(chainId, 'isHolographedHashDeployed', hash)
  }

  //TODO: add a better description! Hash of what?
  /**
   * @readonly
   * Checks if the hash is deployed per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns true if it's deployed, and false otherwise per network.
   */
  async isHolographedHashDeployedByNetworks(hash: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'isHolographedHashDeployed', hash)
    }

    return results
  }

  //TODO: add a better description!
  /**
   * Returns the contract address for a contract type.
   * @param chainId The chainId of the network to get the result from.
   * @param contractType The contract type bytes32.
   * @returns the contract address for the provided contract type.
   */
  async getContractTypeAddress(chainId: number, contractType: Address) {
    return this._getContractFunction(chainId, 'getContractTypeAddress', contractType)
  }

  /**
   * @readonly
   * Returns the contract address for a contract type per network.
   * @param contractType The contract type bytes32.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the contract address for the provided contract type per network.
   */
  async getContractTypeAddressByNetworks(contractType: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getContractTypeAddress', contractType)
    }

    return results
  }

  /**
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainId The chainId of the network to get the result from.
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
   * Returns the hToken address for a given chain id.
   * @param chainId The chainId of the network to get the result from.
   * @returns the hToken contract address.
   */
  async getHToken(chainId: number) {
    return this._getContractFunction(chainId, 'getHToken', chainId)
  }

  /**
   * @readonly
   * Get the HToken address per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the hToken contract address per network.
   */
  async getHTokenByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getHToken', network.chain)
    }

    return results
  }

  /**
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol
   * @param chainId The chainId of the network to get the result from.
   * @returns the Holograph Utility Token contract address.
   */
  async getUtilityToken(chainId: number) {
    return this._getContractFunction(chainId, 'getUtilityToken')
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address per network.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the Holograph Utility Token contract address per network.
   */
  async getUtilityTokenByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getUtilityToken')
    }

    return results
  }

  /**
   * Get set length list, starting from index, for all holographable contracts
   * @param chainId The chainId of the network to get the result from
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @returns contracts address[] Returns a set length array of holographable contracts deployed in the chainId
   */
  async getHolographableContracts(chainId: number, index: bigint, length: bigint) {
    return this._getContractFunction(chainId, 'getHolographableContracts', index, length)
  }

  /**
   * @readonly
   * Get set length list, starting from index, for all holographable contracts
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config
   * @returns contracts address[] Returns a set length array of holographable contracts deployed per chainId
   */
  async getHolographableContractsByNetworks(index: bigint, length: bigint, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(
        network.chain,
        'getHolographableContracts',
        index,
        length,
      )
    }

    return results
  }

  //TODO: define `hash` better. Hash of what?
  /**
   * Returns the address for a holographed hash.
   * @param chainId The chainId of the network to get the result from.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @returns a contract address for the provided hash.
   */
  async getHolographedHashAddress(chainId: number, hash: Address) {
    return this._getContractFunction(chainId, 'getHolographedHashAddress', hash)
  }

  /**
   * @readonly
   * Returns the address for a holographed hash per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the contract address for the provided hash per network.
   */
  async getHolographedHashAddressContractsByNetworks(hash: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolographedHashAddress', hash)
    }

    return results
  }

  /**
   * Get total number of deployed holographable contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns the number of deployed holographable contracts.
   */
  async getHolographableContractsLength(chainId: number) {
    return this._getContractFunction(chainId, 'getHolographableContractsLength')
  }

  /**
   * @readonly
   * Get total number of deployed holographable contracts per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the number of deployed holographable contracts per network.
   */
  async getHolographableContractsLengthByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getHolographableContractsLength')
    }

    return results
  }
}
