import {Address, Hex} from 'viem'

import {Addresses} from '../constants/addresses'
import {LayerZeroModuleABI} from '../constants/abi/develop'
import {HolographLogger, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {GetContractFunctionArgs, GasParameters, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

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
export class LayerZeroModuleContract extends HolographBaseContract {
  private defaultChaiIds: number[]

  constructor(parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: LayerZeroModuleContract.name})
    } else {
      logger = HolographLogger.createLogger({className: LayerZeroModuleContract.name})
    }

    super(logger, LayerZeroModuleABI, 'LayerZeroModule')

    this.defaultChaiIds = this.networks.map(network => network.chain)
  }

  /**
   * @readonly
   * Get the LayerZeroModule contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The LayerZeroModule contract address in the provided network.
   */
  getAddress(chainId?: number | string): Address {
    return Addresses.layerZeroModule(this._config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof LayerZeroModuleABI>) {
    const address = this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Get the default or chain-specific GasParameters.
   * @param chainId The chain id of the network to get the result from.
   * @param holographChainId the Holograph ChainId to get gas parameters for, set to 0 for default.
   * @returns The gas parameters object.
   */
  async getGasParameters(chainId: number, holographChainId: number): Promise<GasParameters> {
    return this._getContractFunction({
      chainId,
      functionName: 'getGasParameters',
      args: [holographChainId],
    })
  }

  /**
   * @readonly
   * Get the default or chain-specific GasParameters.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @param holographChainId the Holograph ChainId to get gas parameters for, set to 0 for default
   * @returns The gas parameters per network.
   */
  async getGasParametersByNetworks(
    chainIds = this.defaultChaiIds,
    holographChainId: number,
  ): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this.getGasParameters(network.chain, holographChainId)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Optimism Gas Price Oracle module.
   * Allows to properly calculate the L1 security fee for Optimism bridge transactions.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Optimism gas price oracle contract address.
   */
  async getOptimismGasPriceOracle(chainId: number): Promise<Address> {
    return this._getContractFunction({
      chainId,
      functionName: 'getOptimismGasPriceOracle',
    })
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
      results[network.chain] = await this.getOptimismGasPriceOracle(network.chain)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the approved LayerZero Endpoint.
   * All lzReceive function calls allow only requests from this address.
   * @param chainId The chain id of the network to get the result from.
   * @returns The LayerZero endpoint/address.
   */
  async getLZEndpoint(chainId: number): Promise<Address> {
    return this._getContractFunction({
      chainId,
      functionName: 'getLZEndpoint',
    })
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
      results[network.chain] = await this.getLZEndpoint(network.chain)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Bridge module.
   * Used for bridging holographable assets cross-chain.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographBridge contract address in the provided network.
   */
  async getBridge(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getBridge'})
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
      results[network.chain] = await this.getBridge(network.chain)
    }

    return results
  }

  /**
   * @readonly
   * Get the address of the Holograph Interfaces module.
   * Holograph uses this contract to store data that needs to be accessed by a large portion of the modules.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographInterfaces contract address in the provided network.
   */
  async getInterfaces(chainId: number): Promise<Address> {
    return this._getContractFunction({chainId, functionName: 'getInterfaces'})
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
      results[network.chain] = await this.getInterfaces(network.chain)
    }

    return results
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
   * Get the Holograph Operator module by network.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Operator contract address per network.
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
   * @readonly
   * Get the fees associated with sending specific payload.
   * It will provide exact costs on protocol and message side, combine the two to get total.
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The Holograph chain id of destination chain for payload.
   * @param gasLimit The amount of gas to provide for executing payload on destination chain.
   * @param gasPrice The maximum amount to pay for gas price, can be set to 0 and will be chose automatically.
   * @param crossChainPayload The entire packet being sent cross-chain.
   * @returns stringifiedFeesArray The compound fees [hlfFee, msgFee, dstGasPrice]:
   * hlgFee: The amount (in wei) of native gas token that will cost for finalizing job on destination chain.
   * msgFee: The amount (in wei) of native gas token that will cost for sending message to destination chain.
   * dstGasPrice: The amount (in wei) that destination message maximum gas price will be.
   */
  async getMessageFee(
    chainId: number,
    toChain: number,
    gasLimit: bigint,
    gasPrice: bigint,
    crossChainPayload: Hex,
  ): Promise<[bigint, bigint, bigint]> {
    return this._getContractFunction({
      chainId,
      functionName: 'getMessageFee',
      args: [toChain, gasLimit, gasPrice, crossChainPayload],
    })
  }

  /**
   * @readonly
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The Holograph chain id of destination chain for payload.
   * @param gasLimit The amount of gas to provide for executing payload on destination chain.
   * @param gasPrice The maximum amount to pay for gas price, can be set to 0 and will be chose automatically.
   * @param crossChainPayload The entire packet being sent cross-chain.
   * @returns The HLG fee.
   */
  async getHlgFee(
    chainId: number,
    toChain: number,
    gasLimit: bigint,
    gasPrice: bigint,
    crossChainPayload: Hex,
  ): Promise<bigint> {
    return this._getContractFunction({
      chainId,
      functionName: 'getHlgFee',
      args: [toChain, gasLimit, gasPrice, crossChainPayload],
    })
  }

  /**
   * Updates the prepends strings for an array of TokenUriTypes.
   * @param chainId The chain id of the network to send the transaction.
   * @param gasLimit The amount of gas to provide for executing payload on destination chain.
   * @param gasPrice The maximum amount to pay for gas price, can be set to 0 and will be chose automatically.
   * @param toChain The Holograph chain id of destination chain for payload.
   * @param msgSender The address of who is sending the message.
   * @param msgValue The amount in wei to send the message to the destination chain.
   * @param crossChainPayload The entire packet being sent cross-chain.
   * @returns A transaction hash.
   */
  async send(
    chainId: number,
    gasLimit: bigint,
    gasPrice: bigint,
    toChain: number,
    msgSender: Address,
    msgValue: bigint,
    crossChainPayload: Hex,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'send',
      args: [gasLimit, gasPrice, toChain, msgSender, msgValue, crossChainPayload],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Interfaces module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param interfaces The address of the Holograph Interfaces smart contract to use.
   * @returns A transaction hash.
   */
  async setInterfaces(
    chainId: number,
    interfaces: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setInterfaces', args: [interfaces], wallet, options})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Operator module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param operator The address of the Holograph Operator smart contract to use.
   * @returns A transaction hash.
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
   * @onlyAdmin
   * Updates the approved LayerZero Endpoint address.
   * @param chainId The chain id of the network to send the transaction.
   * @param lZEndpoint address of the LayerZero Endpoint to use.
   * @returns A transaction hash.
   */
  async setLZEndpoint(
    chainId: number,
    lZEndpoint: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({chainId, functionName: 'setLZEndpoint', args: [lZEndpoint], wallet, options})
  }

  /**
   * @onlyAdmin
   * Updates the Optimism Gas Price Oracle module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param optimismGasPriceOracle address of the Optimism Gas Price Oracle smart contract to use
   * @returns A transaction hash.
   */
  async setOptimismGasPriceOracle(
    chainId: number,
    optimismGasPriceOracle: Address,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'setOptimismGasPriceOracle',
      args: [optimismGasPriceOracle],
      wallet,
      options,
    })
  }

  /**
   * @onlyAdmin
   * Updates the default or chain-specific GasParameters.
   * @param chainId The chain id of the network to send the transaction.
   * @param holographChainId The Holograph chain id to set gas parameters for, set to 0 for default.
   * @param gasParameters The struct of all the gas parameters to set.
   * @returns A transaction hash.
   */
  async setGasParameters(
    chainId: number,
    holographChainId: number,
    gasParameters: GasParameters,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      chainId,
      functionName: 'setGasParameters',
      args: [holographChainId, gasParameters],
      wallet,
      options,
    })
  }
}
