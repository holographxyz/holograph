import {Hex} from 'viem'
import {Address} from 'abitype'

import {HolographRegistryABI} from '../constants/abi/develop'
import {HolographLogger, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {GetContractFunctionArgs, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'
import {HolographContract} from '.'

/**
 * @group Contracts
 * HolographRegistry
 *
 * @remarks
 *
 * Registry is a central on-chain location where all Holograph data is stored. Registry keeps a record of all currently supported standards. New standards can be introduced and enabled as well. Any properly deployed Holographed contracts are also stored as reference. This allows for a definitive way to identify whether a smart contract is secure and properly Holographed. Verifying entities will be able to identify a Holographed contract to ensure the highest level of security and standards.
 *
 */
export class RegistryContract extends HolographBaseContract {
  constructor(parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: RegistryContract.name})
    } else {
      logger = HolographLogger.createLogger({className: RegistryContract.name})
    }

    super(logger, HolographRegistryABI, 'HolographRegistry')
  }

  /**
   * @readonly
   * Get the HolographRegistry contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographRegistry contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new HolographContract()
      const add = (await holograph.getRegistry(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof HolographRegistryABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Checks if the contract it's aligned with the Holograph standard.
   * @param chainId The chain id of the network to get the result from.
   * @param contractAddress The contract address.
   * @returns true if it's holographed, and false otherwise.
   */
  async isHolographedContract(chainId: number, contractAddress: Address): Promise<boolean> {
    return this._getContractFunction({chainId, functionName: 'isHolographedContract', args: [contractAddress]})
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
      results[network.chain] = await this.isHolographedContract(network.chain, contractAddress)
    }

    return results
  }

  //TODO: add a better description! Hash of what?
  /**
   * @readonly
   * Checks if the hash is deployed.
   * @param chainId The chain id of the network to get the result from.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @returns true if it's deployed, and false otherwise.
   */
  async isHolographedHashDeployed(chainId: number, hash: Address): Promise<boolean> {
    return this._getContractFunction({chainId, functionName: 'isHolographedHashDeployed', args: [hash]})
  }

  //TODO: add a better description! Hash of what?
  /**
   * @readonly
   * Checks if the hash is deployed per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns true if it's deployed, and false otherwise per network.
   */
  async isHolographedHashDeployedByNetworks(hash: Address, chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.isHolographedHashDeployed(network.chain, hash)
    }

    return results
  }

  //TODO: add a better description!
  /**
   * @readonly
   * Returns the contract address for a contract type.
   * @param chainId The chain id of the network to get the result from.
   * @param contractType The contract type bytes32.
   * @returns the contract address for the provided contract type.
   */
  async getContractTypeAddress(chainId: number, contractType: Hex): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getContractTypeAddress', args: [contractType]})
  }

  /**
   * @readonly
   * Returns the contract address for a contract type per network.
   * @param contractType The contract type bytes32.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the contract address for the provided contract type per network.
   */
  async getContractTypeAddressByNetworks(contractType: Hex, chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getContractTypeAddress(network.chain, contractType)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Sets the contract address for a contract type.
   * @param chainId The chainId of the network to send the transaction to.
   * @param contractType The contract type bytes32.
   * @param contractAddress The contract address for the provided contract type.
   * @returns A transaction hash
   */
  async setContractTypeAddress(
    chainId: number,
    contractType: Hex,
    contractAddress: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'setContractTypeAddress',
      args: [contractType, contractAddress],
      wallet,
      options,
    })
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
   * Sets the Holograph module contract address.
   * @param chainId The chainId of the network to send the transaction to.
   * @param address The Holograph module contract address.
   * @returns A transaction hash.
   */
  async setHolograph(
    chainId: number,
    address: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setHolograph', args: [address], wallet, options})
  }

  /**
   * @readonly
   * Returns the hToken address for a given chain id.
   * @param chainId The chain id of the network to get the result from.
   * @param hTokenChainId The mapped chain id to get the htoken address
   * @returns The hToken address for a given chain id
   */
  async getHToken(chainId: number, hTokenChainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getHToken', args: [hTokenChainId]})
  }

  /**
   * @readonly
   * Get the HToken address per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @param hTokenChainId The mapped chain id to get the htoken address
   * @returns the hToken contract address per network.
   */
  async getHTokenByNetworks(chainIds: number[], hTokenChainId: number): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getHToken(network.chain, hTokenChainId)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Sets the hToken address for a specific chain id.
   * @param chainId The chainId of the network to send the transaction to.
   * @param hTokenChainId the hToken address chain id.
   * @param hToken The hToken contract address.
   * @returns A transaction hash.
   */
  async setHToken(
    chainId: number,
    hTokenChainId: number,
    hToken: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      chainId,
      functionName: 'setHToken',
      args: [hTokenChainId, hToken],
      wallet,
      options,
    })
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address.
   * This is the official utility token of the Holograph Protocol
   * @param chainId The chain id of the network to get the result from.
   * @returns the Holograph Utility Token contract address.
   */
  async getUtilityToken(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getUtilityToken'})
  }

  /**
   * @readonly
   * Get the Holograph Utility Token address per network.
   * This is the official utility token of the Holograph Protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the Holograph Utility Token contract address per network.
   */
  async getUtilityTokenByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getUtilityToken(network.chain)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Update the Holograph Utility Token address
   * @param chainId The chainId of the network to send the transaction to.
   * @param utilityToken The address of the Holograph Utility Token smart contract to use
   * @returns A transaction hash.
   */
  async setUtilityToken(
    chainId: number,
    utilityToken: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setUtilityToken', args: [utilityToken], wallet, options})
  }

  /**
   * @readonly
   * Get set length list, starting from index, for all holographable contracts
   * @param chainId The chainId of the network to get the result from
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @returns contracts address[] Returns a set length array of holographable contracts deployed in the chainId
   */
  async getHolographableContracts(chainId: number, index: bigint, length: bigint): Promise<Address[]> {
    return this._getContractFunction({chainId, functionName: 'getHolographableContracts', args: [index, length]})
  }

  /**
   * @readonly
   * Get set length list, starting from index, for all holographable contracts
   * @param index The index to start enumeration from
   * @param length The length of returned results
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default is the networks defined in the config
   * @returns contracts address[] Returns a set length array of holographable contracts deployed per chainId
   */
  async getHolographableContractsByNetworks(
    index: bigint,
    length: bigint,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getHolographableContracts(network.chain, index, length)
    }

    return results
  }

  //TODO: define `hash` better. Hash of what?
  /**
   * @readonly
   * Returns the address for a holographed hash.
   * @param chainId The chain id of the network to get the result from.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @returns a contract address for the provided hash.
   */
  async getHolographedHashAddress(chainId: number, hash: Address): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getHolographedHashAddress', args: [hash]})
  }

  /**
   * @readonly
   * Returns the address for a holographed hash per network.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the contract address for the provided hash per network.
   */
  async getHolographedHashAddressContractsByNetworks(
    hash: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getHolographedHashAddress(network.chain, hash)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Allows Holograph Factory to register a deployed contract, referenced with deployment hash
   * @param chainId The chainId of the network to send the transaction to.
   * @param hash The hash obtained by hashing all the necessary configuration parameters and converting them into a salt variable.
   * @param contractAddress the contract address for the provided hash.
   * @returns A transaction hash.
   */
  async setHolographedHashAddress(
    chainId: number,
    hash: Hex,
    contractAddress: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      chainId,
      functionName: 'setHolographedHashAddress',
      args: [hash, contractAddress],
      wallet,
      options,
    })
  }

  /**
   * @readonly
   * Get total number of deployed holographable contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns the number of deployed holographable contracts.
   */
  async getHolographableContractsLength(chainId: number): Promise<bigint> {
    return this._getContractFunction({chainId, functionName: 'getHolographableContractsLength'})
  }

  /**
   * @readonly
   * Get total number of deployed holographable contracts per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the number of deployed holographable contracts per network.
   */
  async getHolographableContractsLengthByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getHolographableContractsLength(network.chain)
    }

    return results
  }

  /**
   * @readonly
   * Allows to reference a deployed smart contract, and use it's code as reference inside of Holographers.
   * @param chainId The chain id of the network to get the result from.
   * @param contractAddress the contract address.
   * @returns the bytes32 contract type.
   */
  async referenceContractTypeAddress(chainId: number, contractAddress: Address): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'referenceContractTypeAddress',
      args: [contractAddress],
    })
  }

  /**
   * @readonly
   * Allows to reference a deployed smart contract, and use it's code as reference inside of Holographers.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @param contractAddress the contract address.
   * @returns the bytes32 contract type per network.
   */
  async referenceContractTypeAddressByNetworks(
    contractAddress: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.referenceContractTypeAddress(network.chain, contractAddress)
    }

    return results
  }

  /**
   * @readonly
   * Returns the reserved contract address for a contract type.
   * @param chainId The chain id of the network to get the result from.
   * @param contractType The bytes32 for the contract type.
   * @returns the reserved contract address.
   */
  async getReservedContractTypeAddress(chainId: number, contractType: Hex): Promise<Address> {
    return this._getContractFunction({
      chainId,
      functionName: 'getReservedContractTypeAddress',
      args: [contractType],
    })
  }

  /**
   * @readonly
   * Returns the reserved contract address for a contract type per network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @param contractType The bytes32 for the contract type.
   * @returns the reserved contract address per network.
   */
  async getReservedContractTypeAddressByNetworks(
    contractType: Hex,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getReservedContractTypeAddress(network.chain, contractType)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Allows admin to update or toggle reserved types.
   * @param chainId The chainId of the network to send the transaction to.
   * @param hashes The bytes32 for the contract typeS.
   * @param reserved A boolean.
   * @returns A transaction hash.
   */
  async setReservedContractTypeAddress(
    chainId: number,
    hash: Hex,
    reserved: boolean,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'setReservedContractTypeAddress',
      args: [hash, reserved],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Allows admin to update or toggle multiple reserved types.
   * @param chainId The chainId of the network to send the transaction to.
   * @param hashes A bytes32 array for the contract typeS.
   * @param reserved A boolean array.
   * @returns A transaction hash.
   */
  async setReservedContractTypeAddresses(
    chainId: number,
    hashes: Hex[],
    reserved: boolean[],
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'setReservedContractTypeAddresses',
      args: [hashes, reserved],
      wallet,
      options,
    })
  }
}
