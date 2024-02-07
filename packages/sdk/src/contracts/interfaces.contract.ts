import {Network} from '@holographxyz/networks'
import {isCallException} from 'ethers'

import {HolographByNetworksResponse, getSelectedNetworks, mapReturnType} from '../utils/contracts'
import {ContractRevertError, EthersError, HolographError} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {HolographInterfacesABI} from '../constants/abi/develop'
import {Holograph} from './index'
import {getContract} from '../utils/abitype'
import {Address} from 'abitype'

export enum ChainIdType {
  UNDEFINED, //  0
  EVM, //        1
  HOLOGRAPH, //  2
  LAYERZERO, //  3
  HYPERLANE, //   4
}

export enum InterfaceType {
  UNDEFINED, // 0
  ERC20, //     1
  ERC721, //    2
  ERC1155, //   3
  ROYALTIES, // 4
  GENERIC, //    5
}

export enum TokenUriType {
  UNDEFINED, //   0
  IPFS, //        1
  HTTPS, //       2
  ARWEAVE, //      3
}

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
export class Interfaces {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: Interfaces.name})
    } else {
      this._logger = HolographLogger.createLogger({className: Interfaces.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the HolographInterfaces contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this.config)
      const add = (await holograph.getInterfaces(chainId)) as Address
      this._addresses[chainId] = add
    }

    return this._addresses[chainId]
  }

  /**** contractURI ****/

  /**
   * Get a base64 encoded contract URI JSON string.
   * Used to dynamically generate contract JSON payload.
   * @param name the name of the smart contract.
   * @param imageURL string pointing to the primary contract image, can be: https, ipfs, or ar (arweave).
   * @param externalLink url to website/page related to smart contract.
   * @param bps basis points used for specifying royalties percentage.
   * @param contractAddress address of the smart contract.
   * @param chainId The chainId of the network to get the result from.
   * @return a base64 encoded json string representing the smart contract.
   */
  private async _contractURI(
    name: string,
    imageURL: string,
    externalLink: string,
    bps: number,
    contractAddress: Address,
    chainId: number,
  ) {
    const logger = this._logger.addContext({functionName: this._getChainId.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographInterfacesABI, signerOrProvider: provider})

    let result: string
    try {
      result = await contract.contractURI(name, imageURL, externalLink, bps, contractAddress)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('Interfaces', contract.getChainId.name, error, this._getChainId.name)
      } else {
        holographError = new EthersError(error, this._getChainId.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Interfaces#_contractURI}
   * */
  async contractUri(
    name: string,
    imageURL: string,
    externalLink: string,
    bps: number,
    contractAddress: Address,
    chainId: number,
  ) {
    return this._contractURI(name, imageURL, externalLink, bps, contractAddress, chainId)
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
  async contractUriByNetworks(
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
      results[network.chain] = await this._contractURI(
        name,
        imageURL,
        externalLink,
        bps,
        contractAddress,
        network.chain,
      )
    }

    return results
  }

  /**** getUriPrepend ****/

  /**
   * TODO: describe it better
   * Get the prepend to use for tokenURI.
   * Provides the prepend to use with TokenUriType URI.
   * @param uriType
   * @param chainId The chainId of the network to get the result from.
   * @returns
   */
  private async _getUriPrepend(uriType: TokenUriType, chainId: number) {
    const logger = this._logger.addContext({functionName: this._getChainId.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographInterfacesABI, signerOrProvider: provider})

    let result: string
    try {
      result = await contract.getUriPrepend(uriType)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('Interfaces', contract.getChainId.name, error, this._getChainId.name)
      } else {
        holographError = new EthersError(error, this._getChainId.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Interfaces#_getUriPrepend}
   * */
  async getUriPrepend(uriType: TokenUriType, chainId: number) {
    return this._getUriPrepend(uriType, chainId)
  }

  /**
   * @readonly
   * TODO: describe it better
   * Get the prepend to use for tokenURI.
   * Provides the prepend to use with TokenUriType URI.
   * @param uriType
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns X per network.
   */
  async getUriPrependByNetworks(uriType: TokenUriType, chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getUriPrepend(uriType, network.chain)
    }

    return results
  }

  /**** getChainId ****/

  /**
   * It's used to convert between the different types of chainIds.
   * @param fromChainType
   * @param fromChainId
   * @param toChainType
   * @param chainId The chainId of the network to get the result from.
   * @returns The Holograph chainId in the provided network.
   */
  private async _getChainId(
    fromChainType: ChainIdType,
    fromChainId: bigint,
    toChainType: ChainIdType,
    chainId: number,
  ) {
    const logger = this._logger.addContext({functionName: this._getChainId.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographInterfacesABI, signerOrProvider: provider})

    let result: bigint
    try {
      result = await contract.getChainId(fromChainType, fromChainId, toChainType)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('Interfaces', contract.getChainId.name, error, this._getChainId.name)
      } else {
        holographError = new EthersError(error, this._getChainId.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Interfaces#_getChainId}
   * */
  async getChainId(fromChainType: ChainIdType, fromChainId: bigint, toChainType: ChainIdType, chainId: number) {
    return this._getChainId(fromChainType, fromChainId, toChainType, chainId)
  }

  /**
   * @readonly
   * It's used to convert between the different types of chainIds.
   * @param fromChainType
   * @param fromChainId
   * @param toChainType
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The chaiIds per network.
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
      results[network.chain] = await this._getChainId(fromChainType, fromChainId, toChainType, network.chain)
    }

    return results
  }

  /**** supportsInterface ****/

  /**
   * Helper to identify if a contract supports a particular interface.
   * @param interfaceType
   * @param interfaceId
   * @param chainId The chainId of the network to get the result from.
   * @returns true or false.
   */
  private async _supportsInterface(interfaceType: InterfaceType, interfaceId: Address, chainId: number) {
    const logger = this._logger.addContext({functionName: this._getChainId.name})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographInterfacesABI, signerOrProvider: provider})

    let result: boolean
    try {
      result = await contract.supportsInterface(interfaceType, interfaceId)
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('Interfaces', contract.getChainId.name, error, this._getChainId.name)
      } else {
        holographError = new EthersError(error, this._getChainId.name)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return mapReturnType(result)
  }

  /**
   * @readonly
   * {@inheritDoc Interfaces#_supportsInterface}
   * */
  async supportsInterface(interfaceType: InterfaceType, interfaceId: Address, chainId: number) {
    return this._supportsInterface(interfaceType, interfaceId, chainId)
  }

  /**
   * @readonly
   * TODO: describe it better
   * @param interfaceType
   * @param interfaceId
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns true or false per network.
   */
  async supportsInterfaceByNetworks(
    interfaceType: InterfaceType,
    interfaceId: Address,
    chainIds?: number[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._supportsInterface(interfaceType, interfaceId, network.chain)
    }

    return results
  }
}
