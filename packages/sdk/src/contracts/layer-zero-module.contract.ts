import {getContract} from 'viem'
import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {LayerZeroModuleABI} from '../constants/abi/develop'
import {Addresses} from '../constants/addresses'

type LayerZeroModuleFunctionNames = ExtractAbiFunctionNames<typeof LayerZeroModuleABI>

export type GasParameters = {
  msgBaseGas: bigint
  msgGasPerByte: bigint
  jobBaseGas: bigint
  jobGasPerByte: bigint
  minGasPrice: bigint
  maxGasLimit: bigint
}

/**
 * @group Contracts
 * LayerZeroModule
 *
 * @remarks
 *
 * Holograph module for enabling LayerZero cross-chain messaging.
 * This contract abstracts all of the LayerZero specific logic into an isolated module.
 *
 */
export class LayerZeroModule {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: LayerZeroModule.name})
    } else {
      this._logger = HolographLogger.createLogger({className: LayerZeroModule.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get  the LayerZeroModule contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The LayerZeroModule contract address in the provided network.
   */
  getAddress(chainId?: number | string): Address {
    return Addresses.layerZeroModule(this.config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction(chainId: number, functionName: LayerZeroModuleFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract({address, abi: LayerZeroModuleABI, client: provider})

    let result
    try {
      if (isReadFunction(LayerZeroModuleABI, functionName)) {
        result = await contract.read[functionName](args)
      } else {
        result = await contract.write[functionName](args)
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('LayerZeroModule', functionName, error)
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
   * Get the default or chain-specific GasParameters.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The gas parameters per network.
   */
  async getGasParametersByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getGasParameters', network.holographId)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Optimism Gas Price Oracle module.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Optimism gas price oracle contract address per network.
   */
  async getOptimismGasPriceOracleByNetworks(chainIds?: number[]) {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getOptimismGasPriceOracle')
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the approved LayerZero Endpoint.
   * All lzReceive function calls allow only requests from this address.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The LayerZero endpoint/address per network.
   */
  async getLZEndpointByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getLZEndpoint')
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Bridge contract address by network.
   * Used for bridging holographable assets cross-chain.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns the Holograph Bridge contract address per network.
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
   * @readonly
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Interfaces contract address per network.
   */
  async getInterfacesByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getInterfaces')
    }

    return results
  }

  /**
   * @readonly
   * Get the Holograph Operator module by network.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Operator contract address per network.
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
   * @readonly
   * @param chainId The chainId of the network to send the transaction.
   * @param toChain The destination chainId to get the message fee.
   * @param gasLimit The gas limit for the transaction.
   * @param gasPrice The gas price for the transaction.
   * @returns The HLG fee, the fee to send a message to the destination chain and the destination gas price.
   */
  async getMessageFee(chainId: number, toChain: number, gasLimit: bigint, gasPrice: bigint) {
    return this._getContractFunction(chainId, 'getMessageFee', toChain, gasLimit, gasPrice)
  }

  /**
   * @readonly
   * @param chainId The chainId of the network to send the transaction.
   * @param toChain The destination chainId to get the message fee.
   * @param gasLimit The gas limit for the transaction.
   * @param gasPrice The gas price for the transaction.
   * @param crossChainPayload The payload to send to the destination chain.
   * @returns The HLG fee.
   */
  async getHlgFee(chainId: number, toChain: number, gasLimit: bigint, gasPrice: bigint, crossChainPayload: Buffer) {
    return this._getContractFunction(chainId, 'getHlgFee', toChain, gasLimit, gasPrice, crossChainPayload)
  }

  /**
   * Updates the prepends strings for an array of TokenUriTypes.
   * @param chainId The chainId of the network to send the transaction.
   * @param gasLimit The gas limit for the transaction.
   * @param gasPrice The gas price for the transaction.
   * @param toChain The destination chainId to get the message fee.
   * @param msgSender The address of who is sending the message.
   * @param msgValue The amount in wei to send the message to the destination chain.
   * @param crossChainPayload The payload to send to the destination chain.
   * @returns A transaction.
   */
  async send(
    chainId: number,
    gasLimit: bigint,
    gasPrice: bigint,
    toChain: number,
    msgSender: Address,
    msgValue: bigint,
    crossChainPayload: Buffer,
  ) {
    return this._getContractFunction(
      chainId,
      'send',
      gasLimit,
      gasPrice,
      toChain,
      msgSender,
      msgValue,
      crossChainPayload,
    )
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Interfaces module address.
   * @param interfaces The address of the Holograph Interfaces smart contract to use.
   * @returns A transaction.
   */
  async setInterfaces(chainId: number, interfaces: Address) {
    return this._getContractFunction(chainId, 'setInterfaces', interfaces)
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Operator module address.
   * @param operator The address of the Holograph Operator smart contract to use.
   * @returns A transaction.
   */
  async setOperator(chainId: number, operator: Address) {
    return this._getContractFunction(chainId, 'setOperator', operator)
  }

  /**
   * @onlyAdmin
   * Updates the approved LayerZero Endpoint address.
   * @param lZEndpoint address of the LayerZero Endpoint to use.
   * @returns A transaction.
   */
  async setLZEndpoint(chainId: number, lZEndpoint: Address) {
    return this._getContractFunction(chainId, 'setLZEndpoint', lZEndpoint)
  }

  /**
   * @onlyAdmin
   * Updates the Optimism Gas Price Oracle module address.
   * @param optimismGasPriceOracle address of the Optimism Gas Price Oracle smart contract to use
   * @returns A transaction.
   */
  async setOptimismGasPriceOracle(chainId: number, optimismGasPriceOracle: Address) {
    return this._getContractFunction(chainId, 'setOptimismGasPriceOracle', optimismGasPriceOracle)
  }

  /**
   * @onlyAdmin
   * Updates the default or chain-specific GasParameters.
   * @param chainId The Holograph ChainId to set gas parameters for, set to 0 for default.
   * @param gasParameters The struct of all the gas parameters to set.
   * @returns A transaction.
   */
  async setGasParameters(chainId: number, holographChainId: number, gasParameters: GasParameters) {
    return this._getContractFunction(chainId, 'setGasParameters', holographChainId, gasParameters)
  }

  /**
   * @onlyAdmin
   * Updates the default or chain-specific GasParameters by network.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @param gasParametersArray The array of gas parameters to set.
   * @returns A transaction.
   */
  async setGasParametersByNetworks(
    chainIds: number[],
    gasParametersArray: GasParameters[],
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)
    let index = 0

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(
        network.chain,
        'setGasParameters',
        network.holographId,
        gasParametersArray[index],
      )
      index++
    }

    return results
  }
}
