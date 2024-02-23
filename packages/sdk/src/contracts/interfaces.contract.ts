import {Hex, getContract} from 'viem'
import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {HolographInterfacesABI} from '../constants/abi/develop'
import {Providers, HolographLogger, Config} from '../services'
import {Holograph} from './index'

type HolographInterfacesFunctionNames = ExtractAbiFunctionNames<typeof HolographInterfacesABI>

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/ChainIdType.sol
 */
export enum ChainIdType {
  UNDEFINED, // 0
  EVM, //       1
  HOLOGRAPH, // 2
  LAYERZERO, // 3
  HYPERLANE, // 4
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/InterfaceType.sol
 */
export enum InterfaceType {
  UNDEFINED, // 0
  ERC20, //     1
  ERC721, //    2
  ERC1155, //   3
  ROYALTIES, // 4
  GENERIC, //   5
}

/**
 * Enum designed to mirror the equivalent Solidity enum.
 * Reference: https://github.com/holographxyz/holograph-protocol/blob/develop/contracts/enum/TokenUriType.sol
 */
export enum TokenUriType {
  UNDEFINED, // 0
  IPFS, //      1
  HTTPS, //     2
  ARWEAVE, //   3
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
   * @param chainId The chain id of the network to get the result from.
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

  private async _getContractFunction(chainId: number, functionName: HolographInterfacesFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = await this.getAddress(chainId)

    const contract = getContract({address, abi: HolographInterfacesABI, client: provider})

    let result
    try {
      if (isReadFunction(HolographInterfacesABI, functionName)) {
        result = await contract.read[functionName](args)
      } else {
        result = await contract.write[functionName](args)
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('HolographInterfaces', functionName, error)
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
  ) {
    return this._getContractFunction(chainId, 'contractURI', name, imageURL, externalLink, bps, contractAddress)
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
      results[network.chain] = await this._getContractFunction(
        network.chain,
        'contractURI',
        name,
        imageURL,
        externalLink,
        bps,
        contractAddress,
      )
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
  async getUriPrepend(chainId: number, uriType: TokenUriType) {
    return this._getContractFunction(chainId, 'getUriPrepend', uriType)
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
      results[network.chain] = await this._getContractFunction(network.chain, 'getUriPrepend', uriType)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Updates the prepend string for a TokenUriType.
   * @param chainId The chain id of the network to send the transaction.
   * @param uriType The TokenUriType to set for.
   * @param prepend The prepend string.
   * @returns A transaction.
   */
  async updateUriPrepend(chainId: number, uriType: TokenUriType, prepend: string) {
    return this._getContractFunction(chainId, 'updateUriPrepend', uriType, prepend)
  }

  /**
   * @onlyAdmin
   * Updates the prepends strings for an array of TokenUriTypes.
   * @param chainId The chain id of the network to send the transaction.
   * @param uriType Array of TokenUriType to set for.
   * @param prepend Array of prepends.
   * @returns A transaction.
   */
  async updateUriPrepends(chainId: number, uriTypes: TokenUriType[], prepends: string[]) {
    return this._getContractFunction(chainId, 'updateUriPrepends', uriTypes, prepends)
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
  async getChainId(chainId: number, fromChainType: ChainIdType, fromChainId: bigint, toChainType: ChainIdType) {
    return this._getContractFunction(chainId, 'getChainId', fromChainType, fromChainId, toChainType)
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
      results[network.chain] = await this._getContractFunction(
        network.chain,
        'getChainId',
        fromChainType,
        fromChainId,
        toChainType,
      )
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
   * @returns A transaction.
   */
  async updateChainIdMap(
    chainId: number,
    fromChainType: ChainIdType,
    fromChainId: bigint,
    toChainType: ChainIdType,
    toChainId: bigint,
  ) {
    return this._getContractFunction(chainId, 'updateChainIdMap', fromChainType, fromChainId, toChainType, toChainId)
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param fromChainTypes The chain type of the source networks.
   * @param fromChainIds The actual chain ID values of the source networks.
   * @param toChainTypes The chain type of the destine networks.
   * @param toChainIds The actual chain ID values of the destine networks.
   * @returns A transaction.
   */
  async updateChainIdMaps(
    chainId: number,
    fromChainTypes: ChainIdType[],
    fromChainIds: bigint[],
    toChainTypes: ChainIdType[],
    toChainIds: bigint[],
  ) {
    return this._getContractFunction(
      chainId,
      'updateChainIdMaps',
      fromChainTypes,
      fromChainIds,
      toChainTypes,
      toChainIds,
    )
  }

  /**
   * @readonly
   * Helper to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to get the result from.
   * @param interfaceType The InterfaceType.
   * @param interfaceId The interface identifier, as specified in ERC-165.
   * @returns `true` if the contract implements `interfaceID` and `interfaceID` is not 0xffffffff, `false` otherwise.
   */
  async supportsInterface(chainId: number, interfaceType: InterfaceType, interfaceId: Hex) {
    return this._getContractFunction(chainId, 'supportsInterface', interfaceType, interfaceId)
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
      results[network.chain] = await this._getContractFunction(
        network.chain,
        'supportsInterface',
        interfaceType,
        interfaceId,
      )
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
   * @returns A transaction.
   */
  async updateInterface(chainId: number, interfaceType: InterfaceType, interfaceId: Hex, supported: boolean) {
    return this._getContractFunction(chainId, 'updateInterface', interfaceType, interfaceId, supported)
  }

  /**
   * @onlyAdmin
   * Updates the helper structure to identify if a contract supports a particular interface.
   * @param chainId The chain id of the network to send the transaction.
   * @param interfaceType The InterfaceType.
   * @param interfaceIds An array of interface identifiers, as specified in ERC-165.
   * @param supported `true` if it's supported, `false` otherwise.
   * @returns A transaction.
   */
  async updateInterfaces(chainId: number, interfaceType: InterfaceType, interfaceIds: Hex[], supported: boolean) {
    return this._getContractFunction(chainId, 'updateInterfaces', interfaceType, interfaceIds, supported)
  }
}
