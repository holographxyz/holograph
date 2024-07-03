import {Hex, Address} from 'viem'

import {HolographContract} from './index'
import {HolographLogger, HolographWallet} from '../services'
import {HolographInterfacesABI} from '../constants/abi/develop'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {ChainIdType, GetContractFunctionArgs, InterfaceType, TokenUriType, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

/**
 * @group Contracts
 * HolographInterfaces
 *
 * @remarks
 *
 * Provides access to universal Holograph Protocol variables.
 * The contract stores a reference of all supported: chains, interfaces, functions, etc.
 *
 */
export class InterfacesContract extends HolographBaseContract {
  constructor(parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: InterfacesContract.name})
    } else {
      logger = HolographLogger.createLogger({className: InterfacesContract.name})
    }

    super(logger, HolographInterfacesABI, 'HolographInterfaces')
  }

  /**
   * @readonly
   * Get the HolographInterfaces contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new HolographContract()
      const add = (await holograph.getInterfaces(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof HolographInterfacesABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Get a base64 encoded contract URI JSON string.
   * Used to dynamically generate contract JSON payload.
   * @param chainId The chain id of the network to get the result from.
   * @param name the name of the smart contract.
   * @param imageURL string pointing to the primary contract image, can be: https, ipfs, or ar (arweave).
   * @param externalLink url to website/page related to smart contract.
   * @param bps basis points used for specifying royalties percentage.
   * @param contractAddress address of the smart contract.
   * @returns a base64 encoded json string representing the smart contract.
   */
  async contractURI(
    chainId: number,
    name: string,
    imageURL: string,
    externalLink: string,
    bps: number,
    contractAddress: Address,
  ): Promise<string> {
    return this._getContractFunction({
      chainId,
      functionName: 'contractURI',
      args: [name, imageURL, externalLink, bps, contractAddress],
    })
  }

  /**
   * @readonly
   * Get a base64 encoded contract URI JSON string.
   * Used to dynamically generate contract JSON payload.
   * @param name the name of the smart contract.
   * @param imageURL string pointing to the primary contract image, can be: https, ipfs, or ar (arweave).
   * @param externalLink url to website/page related to smart contract.
   * @param bps basis points used for specifying royalties percentage.
   * @param contractAddress address of the smart contract.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns a base64 encoded json string representing the smart contract per network.
   */
  async contractURIByNetworks(
    name: string,
    imageURL: string,
    externalLink: string,
    bps: number,
    contractAddress: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.contractURI(network.chain, name, imageURL, externalLink, bps, contractAddress)
    }

    return results
  }

  /**
   * @readonly
   * Get the prepend string to use for tokenURI.
   * Provides the prepend to use with TokenUriType URI.
   * @param chainId The chain id of the network to get the result from.
   * @param uriType The TokenUriType to get the prepend from.
   * @returns The prepend string
   *
   * @example
   * ```ts
   * ...
   * const prepend = await interfaceContract.getUriPrepend(80001, TokenUriType.IPFS)
   * console.log('The prepend string for IPFS token URIs is ', prepend)
   * // expected value: The prepend string for IPFS token URIs is ipfs://
   * ```
   */
  async getUriPrepend(chainId: number, uriType: TokenUriType): Promise<string> {
    return this._getContractFunction({chainId, functionName: 'getUriPrepend', args: [uriType]})
  }

  /**
   * @readonly
   * Get the prepend string to use for tokenURI.
   * Provides the prepend to use with TokenUriType URI.
   * @param uriType
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns X per network.
   */
  async getUriPrependByNetworks(uriType: TokenUriType, chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getUriPrepend(network.chain, uriType)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Updates the prepend string for a TokenUriType.
   * @param chainId The chain id of the network to send the transaction.
   * @param uriType The TokenUriType to set for.
   * @param prepend The prepend string.
   * @param wallet A
   * @returns A transaction hash.
   */
  async updateUriPrepend(
    chainId: number,
    uriType: TokenUriType,
    prepend: string,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateUriPrepend',
      args: [uriType, prepend],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Updates the prepends strings for an array of TokenUriTypes.
   * @param chainId The chain id of the network to send the transaction.
   * @param uriType Array of TokenUriType to set for.
   * @param prepend Array of prepends.
   * @returns A transaction hash.
   */
  async updateUriPrepends(
    chainId: number,
    uriTypes: TokenUriType[],
    prepends: string[],
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateUriPrepends',
      args: [uriTypes, prepends],
      wallet,
      options,
    })
  }

  /**
   * @readonly
   * It's used to convert between the different types of chainIds.
   * @param chainId The chain id of the network to get the result from.
   * @param fromChainType The chain type of the source network.
   * @param fromChainId The actual chain ID value of the source network.
   * @param toChainType The chain type of the desired network.
   * @returns The Holograph chainId in the provided network.
   */
  async getChainId(
    chainId: number,
    fromChainType: ChainIdType,
    fromChainId: bigint,
    toChainType: ChainIdType,
  ): Promise<bigint> {
    return this._getContractFunction({
      chainId,
      functionName: 'getChainId',
      args: [fromChainType, fromChainId, toChainType],
    })
  }

  /**
   * @readonly
   * It's used to convert between the different types of chainIds.
   * @param fromChainType The chain type of the source network.
   * @param fromChainId The actual chain ID value of the source network.
   * @param toChainType The chain type of the desired network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The chainIds per network.
   */
  async getChainIdByNetworks(
    fromChainType: ChainIdType,
    fromChainId: bigint,
    toChainType: ChainIdType,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getChainId(network.chain, fromChainType, fromChainId, toChainType)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param fromChainType The chain type of the source network.
   * @param fromChainId The actual chain ID value of the source network.
   * @param toChainType The chain type of the destine network.
   * @param toChainId The actual chain ID value of the destine network.
   * @returns A transaction hash.
   */
  async updateChainIdMap(
    chainId: number,
    fromChainType: ChainIdType,
    fromChainId: bigint,
    toChainType: ChainIdType,
    toChainId: bigint,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateChainIdMap',
      args: [fromChainType, fromChainId, toChainType, toChainId],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param fromChainTypes The chain type of the source networks.
   * @param fromChainIds The actual chain ID values of the source networks.
   * @param toChainTypes The chain type of the destine networks.
   * @param toChainIds The actual chain ID values of the destine networks.
   * @returns A transaction hash.
   */
  async updateChainIdMaps(
    chainId: number,
    fromChainTypes: ChainIdType[],
    fromChainIds: bigint[],
    toChainTypes: ChainIdType[],
    toChainIds: bigint[],
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateChainIdMaps',
      args: [fromChainTypes, fromChainIds, toChainTypes, toChainIds],
      wallet,
      options,
    })
  }

  /**
   * @readonly
   * Helper to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to get the result from.
   * @param interfaceType The InterfaceType.
   * @param interfaceId The interface identifier, as specified in ERC-165.
   * @returns `true` if the contract implements `interfaceID` and `interfaceID` is not 0xffffffff, `false` otherwise.
   */
  async supportsInterface(chainId: number, interfaceType: InterfaceType, interfaceId: Hex): Promise<boolean> {
    return this._getContractFunction({chainId, functionName: 'supportsInterface', args: [interfaceType, interfaceId]})
  }

  /**
   * @readonly
   * Helper to identify if a contract supports a particular interface by networks.
   * @param interfaceType The InterfaceType.
   * @param interfaceId The interface identifier, as specified in ERC-165.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns `true` if the contract implements `interfaceID` and `interfaceID` is not 0xffffffff, `false` otherwise per network.
   */
  async supportsInterfaceByNetworks(
    interfaceType: InterfaceType,
    interfaceId: Hex,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.supportsInterface(network.chain, interfaceType, interfaceId)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param interfaceType The InterfaceType.
   * @param interfaceId The interface identifier, as specified in ERC-165.
   * @param supported `true` if it's supported, `false` otherwise.
   * @returns A transaction hash.
   */
  async updateInterface(
    chainId: number,
    interfaceType: InterfaceType,
    interfaceId: Hex,
    supported: boolean,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateInterface',
      args: [interfaceType, interfaceId, supported],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param interfaceType The InterfaceType.
   * @param interfaceIds An array of interface identifiers, as specified in ERC-165.
   * @param supported `true` if it's supported, `false` otherwise.
   * @returns A transaction hash.
   */
  async updateInterfaces(
    chainId: number,
    interfaceType: InterfaceType,
    interfaceIds: Hex[],
    supported: boolean,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'updateInterfaces',
      args: [interfaceType, interfaceIds, supported],
      wallet,
      options,
    })
  }
}
