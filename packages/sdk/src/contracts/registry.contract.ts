import {Network} from '@holographxyz/networks'

import {Addresses} from '../constants/addresses'
import {Config} from '../config/config.service'
import {HolographRegistryABI} from '../constants/abi/develop'
import {HolographByNetworksResponse, getContract, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {Address} from 'abitype'
import {Providers} from '../services'

//TODO: add error handling
//TODO: add logger

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

  constructor(private readonly config: Config, private readonly providers: Providers) {
    // this.logger = getHandlerLogger().child({service: Holograph.name})
    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the HolographRegistry contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  getAddress(chainId?: number | string) {
    return Addresses.registry(this.config.environment, Number(chainId))
  }

  /**** isHolographedContract ****/

  /**
   * Checks if the contract it's aligned with the Holograph standard.
   * @param contractAddress The contract address.
   * @param chainId The chainId of the network to get the result from.
   * @return true if it's holographed, and false otherwise.
   */
  private async _isHolographedContract(contractAddress: Address, chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.isHolographedContract(contractAddress)
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_isHolographedContract}
   * */
  async isHolographedContract(contractAddress: Address, chainId: number) {
    return this._isHolographedContract(contractAddress, chainId)
  }

  /**
   * @readonly
   * Checks if the contract it's aligned with the Holograph standard by network.
   * @param contractAddress The contract address.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return true if it's holographed, and false otherwise per network.
   */
  async isHolographedContractByNetworks(
    contractAddress: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._isHolographedContract(contractAddress, network.chain)
    }

    return results
  }

  /**** isHolographedHashDeployed ****/

  //TODO: add a better description! Hash of what?
  /**
   * Checks if the hash is deployed.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainId The chainId of the network to get the result from.
   * @return true if it's deployed, and false otherwise.
   */
  private async _isHolographedHashDeployed(hash: Address, chainId: number) {
    //TODO: hash is not an Address, it's a bytes32
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.isHolographedHashDeployed(hash)
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_isHolographedHashDeployed}
   * */
  async isHolographedHashDeployed(hash: Address, chainId: number) {
    return this._isHolographedHashDeployed(hash, chainId)
  }

  //TODO: add a better description! Hash of what?
  /**
   * @readonly
   * Checks if the hash is deployed per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return true if it's deployed, and false otherwise per network.
   */
  async isHolographedHashDeployedByNetworks(hash: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._isHolographedHashDeployed(hash, network.chain)
    }

    return results
  }

  /**** getContractTypeAddress ****/

  //TODO: add a better description!
  /**
   * Returns the contract address for a contract type.
   * @param contractType The contract type bytes32.
   * @param chainId The chainId of the network to get the result from.
   * @return the contract address for the provided contract type.
   */
  private async _getContractTypeAddress(contractType: Address, chainId: number) {
    //TODO: contractType is not an Address, it's a bytes32
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getContractTypeAddress(contractType)
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getContractTypeAddress}
   * */
  async getContractTypeAddress(contractType: Address, chainId: number) {
    return this._getContractTypeAddress(contractType, chainId)
  }

  /**
   * @readonly
   * Returns the contract address for a contract type per network.
   * @param contractType The contract type bytes32.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return the contract address for the provided contract type per network.
   */
  async getContractTypeAddressByNetworks(contractType: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractTypeAddress(contractType, network.chain)
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
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getHolograph()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getHolograph}
   * */
  async getHolograph(chainId: number) {
    return this._getHolograph(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Protocol contract.
   * This contract stores a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
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

  /**
   * Returns the hToken address for a given chain id.
   * @param chainId The chainId of the network to get the result from.
   * @return the hToken contract address.
   */
  private async _getHToken(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getHToken(chainId)
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getHToken}
   * */
  async getHToken(chainId: number) {
    return this._getHToken(chainId)
  }

  /**
   * @readonly
   * Get the HToken address per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return the hToken contract address per network.
   */
  async getHTokenByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHToken(network.chain)
    }

    return results
  }

  /**
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol
   * @param chainId The chainId of the network to get the result from.
   * @return the Holograph Utility Token contract address.
   */
  private async _getUtilityToken(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getUtilityToken()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getUtilityToken}
   * */
  async getUtilityToken(chainId: number) {
    return this._getUtilityToken(chainId)
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address per network.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return the Holograph Utility Token contract address per network.
   */
  async getUtilityTokenByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getUtilityToken(network.chain)
    }

    return results
  }

  /**** getHolographableContracts ****/

  /**
   * Get set length list, starting from index, for all holographable contracts
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @param chainId The chainId of the network to get the result from
   * @return contracts address[] Returns a set length array of holographable contracts deployed in the chainId
   */
  private async _getHolographableContracts(index: bigint, length: bigint, chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = (await contract.getHolographableContracts(index, length)) as Address[]
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getHolographableContracts} */
  async getHolographableContracts(index: bigint, length: bigint, chainId: number) {
    return this._getHolographableContracts(index, length, chainId)
  }

  /**
   * @readonly
   * Get set length list, starting from index, for all holographable contracts
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config
   * @return contracts address[] Returns a set length array of holographable contracts deployed per chainId
   */
  async getHolographableContractsByNetworks(index: bigint, length: bigint, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolographableContracts(index, length, network.chain)
    }

    return results
  }

  /**** getHolographedHashAddress ****/

  //TODO: define `hash` better. Hash of what?
  /**
   * Returns the address for a holographed hash.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainId The chainId of the network to get the result from.
   * @returns a contract address for the provided hash.
   */
  private async _getHolographedHashAddress(hash: Address, chainId: number) {
    //TODO: hash is not an address, it's a bytes32
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getHolographedHashAddress(hash)
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getHolographedHashAddress}
   * */
  async getHolographedHashAddress(hash: Address, chainId: number) {
    return this._getHolographedHashAddress(hash, chainId)
  }

  /**
   * @readonly
   * Returns the address for a holographed hash per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return the contract address for the provided hash per network.
   */
  async getHolographedHashAddressContractsByNetworks(hash: Address, chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolographedHashAddress(hash, network.chain)
    }

    return results
  }

  /**
   * Get total number of deployed holographable contracts.
   * @param chainId The chainId of the network to get the result from.
   * @returns the number of deployed holographable contracts.
   */
  private async _getHolographableContractsLength(chainId: number) {
    const provider = this.providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract<typeof HolographRegistryABI>(address, HolographRegistryABI, provider)

    const result = await contract.getHolographableContractsLength()
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Registry#_getHolographableContractsLength}
   * */
  async getHolographableContractsLength(chainId: number) {
    return this._getHolographableContractsLength(chainId)
  }

  /**
   * @readonly
   * Get total number of deployed holographable contracts per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config.
   * @return the number of deployed holographable contracts per network.
   */
  async getHolographableContractsLengthByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getHolographableContractsLength(network.chain)
    }

    return results
  }
}
