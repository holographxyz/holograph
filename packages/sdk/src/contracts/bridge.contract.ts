import {Address, Hex} from 'viem'

import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {HolographLogger, Config, HolographWallet} from '../services'
import {HolographBridgeABI} from '../constants/abi/develop'
import {Holograph} from '.'
import {
  EstimateContractFunctionGasArgs,
  GetContractFunctionArgs,
  HolographBridgeFunctionNames,
  SimulateContractFunctionArgs,
} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'

/**
 * @group Contracts
 * HolographBridge
 *
 * @remarks
 *
 * Bridge any holographable contracts and assets across blockchains.
 * The contract abstracts all the complexities of making bridge requests and uses a universal interface to bridge any type of holographable assets.
 *
 */
export class Bridge extends HolographBaseContract {
  constructor(_config?: Config, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: Bridge.name})
    } else {
      logger = HolographLogger.createLogger({className: Bridge.name})
    }

    super(logger, HolographBridgeABI, 'HolographBridge', _config)
  }

  /**
   * @readonly
   * Gets the HolographBridge contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographBridge contract address in the provided network.
   */
  async getAddress(chainId: number): Promise<Address> {
    if (this._addresses[chainId] === undefined) {
      const holograph = new Holograph(this._config)
      const add = (await holograph.getBridge(chainId)) as Address
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
  }: GetContractFunctionArgs<typeof HolographBridgeABI>) {
    const address = await this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args, options})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractFunctionGasArgs<typeof HolographBridgeABI>) {
    const address = await this.getAddress(chainId)
    return this._estimateContractGas({chainId, address, functionName, wallet, args, options})
  }

  async simulateContractFunction({
    chainId,
    functionName,
    args,
    options,
  }: SimulateContractFunctionArgs<typeof HolographBridgeABI>) {
    const address = await this.getAddress(chainId)
    return this._simulateContract({chainId, address, functionName, args, options})
  }

  /**
   * @readonly
   * Gets the Holograph Protocol contract.
   * Used for storing a reference to all the primary modules and variables of the protocol.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph Protocol contract address in the provided network.
   */
  async getHolograph(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getHolograph'})
  }

  /**
   * @readonly
   * Gets the Holograph Protocol contract.
   * Used for storing a reference to all the primary modules and variables of the protocol.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Protocol contract address per network.
   */
  async getHolographByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getHolograph'})
    }

    return results
  }

  /**
   * @readonly
   * Gets the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographFactory contract address in the provided network.
   */
  async getFactory(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getFactory'})
  }

  /**
   * @readonly
   * Gets the address of the Holograph Factory module.
   * Used for deploying holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographFactory contract address per network.
   */
  async getFactoryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getFactory'})
    }

    return results
  }

  /**
   * @readonly
   * Gets the latest job nonce.
   * You can use the job nonce as a way to calculate total amount of bridge requests that have been made.
   * @param chainId The chain id of the network to get the result from.
   * @returns The job nonce in the provided network.
   */
  async getJobNonce(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getJobNonce'})
  }

  /**
   * @readonly
   * Gets the latest job nonce.
   * You can use the job nonce as a way to calculate total amount of bridge requests that have been made.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The job nonce per network.
   */
  async getJobNonceByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getJobNonce'})
    }

    return results
  }

  /**
   * @readonly
   * Gets the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The HolographOperator contract address in the provided network.
   */
  async getOperator(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getOperator'})
  }

  /**
   * @readonly
   * Gets the address of the Holograph Operator module.
   * All cross-chain Holograph Bridge bridges are handled by the Holograph Operator module.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The HolographOperator contract address per network.
   */
  async getOperatorByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getOperator'})
    }

    return results
  }

  /**
   * @readonly
   * Gets the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Holograph Registry contract address in the provided network.
   */
  async getRegistry(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getRegistry'})
  }

  /**
   * @readonly
   * Gets the Holograph Registry module.
   * This module stores a reference for all deployed holographable smart contracts.
   * @param chainIds The list of network chainIds to get the results from, if nothing is provided the default are the networks defined in the config.
   * @returns The Holograph Registry contract address per network.
   */
  async getRegistryByNetworks(chainIds?: number[]): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({chainId: network.chain, functionName: 'getRegistry'})
    }

    return results
  }

  /**
   * @readonly
   * Gets the fees associated with sending specific payload.
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
  async getMessageFee(chainId: number, toChain: number, gasLimit: bigint, gasPrice: bigint, crossChainPayload: Hex) {
    return this._getContractFunction({
      chainId,
      functionName: 'getMessageFee',
      args: [toChain, gasLimit, gasPrice, crossChainPayload],
    })
  }

  /**
   * Gets the payload created by the bridgeOutRequest function.
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The Holograph chain id where the bridge is being sent to.
   * @param holographableContract The address of the contract for which the bridge request is being made.
   * @param gasLimit The maximum amount of gas to spend for executing the bridge on destination chain.
   * @param gasPrice The maximum amount of gas price (in destination chain native gas token) to pay on destination chain.
   * @param bridgeOutPayload The actual abi encoded bytes of the data that the holographable contract bridgeOut function will receive.
   * @returns samplePayload The bytes made up of the bridgeOutRequest payload.
   */
  async getBridgeOutRequestPayload(
    chainId: number,
    toChain: number,
    holographableContract: Address,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'getBridgeOutRequestPayload',
      args: [toChain, holographableContract, gasLimit, gasPrice, bridgeOutPayload],
    })
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Protocol module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param holograph The address of the Holograph Protocol smart contract to use.
   * @returns A transaction.
   */
  async setHolograph(chainId: number, holograph: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, wallet, functionName: 'setHolograph', args: [holograph]})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Factory module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param factory The address of the Holograph Factory smart contract to use.
   * @returns A transaction.
   */
  async setFactory(chainId: number, factory: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, wallet, functionName: 'setFactory', args: [factory]})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Operator module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param operator The address of the Holograph Operator smart contract to use.
   * @returns A transaction.
   */
  async setOperator(chainId: number, operator: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, wallet, functionName: 'setOperator', args: [operator]})
  }

  /**
   * @onlyAdmin
   * Updates the Holograph Registry module address.
   * @param chainId The chain id of the network to send the transaction.
   * @param registry The address of the Holograph Registry smart contract to use.
   * @returns A transaction.
   */
  async setRegistry(chainId: number, registry: Address, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, wallet, functionName: 'setRegistry', args: [registry]})
  }

  /**
   * Receives a bridge from another chain.
   * This function can only be called by the Holograph Operator module.
   * @param chainId The chain id of the network to send the transaction.
   * @param nonce The job nonce of the bridge request.
   * @param fromChain The Holograph chain id where the brigeOutRequest was created.
   * @param holographableContract The address of the destination contract that the bridgeInRequest is targeted for.
   * @param hToken The address of the hToken contract that wrapped the origin chain native gas token.
   * @param hTokenRecipient The address of recipient for the hToken reward.
   * @param hTokenValue The exact amount of hToken reward in wei.
   * @param doNotRevert The boolean used to specify if the call should revert.
   * @param bridgeInPayload The actual abi encoded bytes of the data that the holographable contract bridgeIn function will receive.
   * @returns A transaction.
   */
  async bridgeInRequest(
    chainId: number,
    nonce: bigint,
    fromChain: number,
    holographableContract: Address,
    hToken: Address,
    hTokenRecipient: Address,
    hTokenValue: bigint,
    doNotRevert: boolean,
    bridgeInPayload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'bridgeInRequest',
      args: [
        nonce,
        fromChain,
        holographableContract,
        hToken,
        hTokenRecipient,
        hTokenValue,
        doNotRevert,
        bridgeInPayload,
      ],
    })
  }

  /**
   * Creates a bridge request for a destination chain.
   * This function works for deploying contracts and bridging supported holographable assets across chains.
   * @param chainId The chain id of the network to send the transaction.
   * @param toChain The Holograph chain id where the bridge is being sent to.
   * @param holographableContract The address of the contract for which the bridge request is being made.
   * @param gasLimit The maximum amount of gas to spend for executing the bridge on destination chain.
   * @param gasPrice The maximum amount of gas price (in destination chain native gas token) to pay on destination chain.
   * @param bridgeOutPayload The actual abi encoded bytes of the data that the holographable contract bridgeOut function will receive.
   * @returns A transaction.
   */
  async bridgeOutRequest(
    chainId: number,
    toChain: number,
    holographableContract: Address,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'bridgeOutRequest',
      args: [toChain, holographableContract, gasLimit, gasPrice, bridgeOutPayload],
    })
  }

  /**
   * This function will always revert.
   * Used by getBridgeOutRequestPayload function. It is purposefully inverted to always revert on a successful call.
   * If this function does not revert and returns a string, it is the actual revert reason.
   * @param chainId The chain id of the network to send the transaction.
   * @param sender The address of actual sender that is planning to make a bridgeOutRequest call.
   * @param toChain The Holograph chain id of destination chain.
   * @param holographableContract The address of the contract for which the bridge request is being made.
   * @param bridgeOutPayload The actual abi encoded bytes of the data that the holographable contract bridgeOut function will receive.
   * @returns revertReason A revert reason string.
   */
  async revertedBridgeOutRequest(
    chainId: number,
    sender: Address,
    toChain: number,
    holographableContract: Address,
    bridgeOutPayload: Hex,
    wallet?: {account: string | HolographWallet},
  ) {
    return this._getContractFunction({
      chainId,
      wallet,
      functionName: 'revertedBridgeOutRequest',
      args: [sender, toChain, holographableContract, bridgeOutPayload],
    })
  }
}
