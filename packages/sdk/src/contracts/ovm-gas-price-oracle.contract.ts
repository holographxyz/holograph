import {Address, Hex} from 'viem'

import {Addresses} from '../constants/addresses'
import {OVM_GasPriceOracleABI} from '../constants/abi/develop'
import {HolographLogger, Config, HolographWallet} from '../services'
import {HolographByNetworksResponse, getSelectedNetworks} from '../utils/contracts'
import {GetContractFunctionArgs, HolographBaseContract} from './holograph-base.contract'

/**
 * @group Contracts
 * OVMGasPriceOracle
 *
 * @remarks
 *
 * This contract exposes the current L2 gas price, a measure of how congested the network
 * currently is. This measure is used by the Sequencer to determine what fee to charge for
 * transactions. When the system is more congested, the L2 gas price will increase and fees
 * will also increase as a result.
 *
 * All public variables are set while generating the initial L2 state. The
 * constructor doesn't run in practice as the L2 state generation script uses
 * the deployed bytecode instead of running the initcode.
 *
 */
export class OVMGasPriceOracle extends HolographBaseContract {
  constructor(_config: Config, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: OVMGasPriceOracle.name})
    } else {
      logger = HolographLogger.createLogger({className: OVMGasPriceOracle.name})
    }

    super(_config, logger, OVM_GasPriceOracleABI, 'OVM_GasPriceOracle')
  }

  /**
   * @readonly
   * Get the OVM_GasPriceOracle contract address according to environment and chainId module.
   * @param chainId The chain id of the network to get the result from.
   * @returns The OVM_GasPriceOracle contract address in the provided network.
   */
  getAddress(chainId: number): Address {
    return Addresses.ovmGasPriceOracle(this._config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
  }: GetContractFunctionArgs<typeof OVM_GasPriceOracleABI>) {
    const address = this.getAddress(chainId)
    return this._callContractFunction({chainId, address, functionName, wallet, args})
  }

  /**
   * @readonly
   * Computes the L1 portion of the fee based on the size of the RLP encoded tx and the current l1BaseFee.
   * @param chainId The chain id of the network to get the result from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The L1 fee that should be paid for the tx.
   */
  async getL1Fee(chainId: number, data: Hex) {
    return this._getContractFunction({chainId, functionName: 'getL1Fee', args: [data]})
  }

  /**
   * @readonly
   * Computes the L1 portion of the fee based on the size of the RLP encoded tx and the current l1BaseFee.
   * @param chainIds The list of network chainIds to get the results from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The L1 fee that should be paid for the tx  per network.
   */
  async getL1FeeByNetworks(chainIds: number[], data: Hex): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getL1Fee',
        args: [data],
      })
    }

    return results
  }

  /**
   * @readonly
   * Computes the amount of L1 gas used for a transaction
   * The overhead represents the per batch gas overhead of posting both transaction and state roots to L1 given larger batch sizes.
   * 4 gas for 0 byte
   * https://github.com/ethereum/go-ethereum/blob/9ada4a2e2c415e6b0b51c50e901336872e028872/params/protocol_params.go#L33
   * 16 gas for non zero byte
   * https://github.com/ethereum/go-ethereum/blob/9ada4a2e2c415e6b0b51c50e901336872e028872/params/protocol_params.go#L87
   * This will need to be updated if calldata gas prices change
   * Account for the transaction being unsigned
   * Padding is added to account for lack of signature on transaction
   * 1 byte for RLP V prefix
   * 1 byte for V
   * 1 byte for RLP R prefix
   * 32 bytes for R
   * 1 byte for RLP S prefix
   * 32 bytes for S
   * Total: 68 bytes of padding
   * @param chainId The chain id of the network to get the result from.
   * @param data Unsigned RLP encoded tx, 6 elements
   * @returns The amount of L1 gas used for a transaction.
   */
  async getL1GasUsed(chainId: number, data: Hex) {
    return this._getContractFunction({chainId, functionName: 'getL1GasUsed', args: [data]})
  }

  /**
   * @readonly
   * Computes the amount of L1 gas used for a transaction.
   * @param chainIds The list of network chainIds to get the results from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The amount of L1 gas used for a transaction per network.
   */
  async getL1GasUsedByNetworks(chainIds: number[], data: Hex): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction({
        chainId: network.chain,
        functionName: 'getL1GasUsed',
        args: [data],
      })
    }

    return results
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the L2 gas price.
   * @param chainId The chain id of the network to send the transaction.
   * @param gasPrice The new L2 gas price.
   * @returns A transaction.
   */
  async setGasPrice(chainId: number, gasPrice: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setGasPrice', args: [gasPrice], wallet})
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the L1 base fee.
   * @param chainId The chain id of the network to send the transaction.
   * @param baseFee The new L1 base fee.
   * @returns A transaction.
   */
  async setL1BaseFee(chainId: number, baseFee: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setL1BaseFee', args: [baseFee], wallet})
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the overhead.
   * @param chainId The chain id of the network to send the transaction.
   * @param overhead The new overhead.
   * @returns A transaction.
   */
  async setOverhead(chainId: number, overhead: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setOverhead', args: [overhead], wallet})
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the scalar.
   * @param chainId The chain id of the network to send the transaction.
   * @param scalar The new scalar.
   * @returns A transaction.
   */
  async setScalar(chainId: number, scalar: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setScalar', args: [scalar], wallet})
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the decimals.
   * @param chainId The chain id of the network to send the transaction.
   * @param decimals The new decimals.
   * @returns A transaction.
   */
  async setDecimals(chainId: number, decimals: bigint, wallet?: {account: string | HolographWallet}) {
    return this._getContractFunction({chainId, functionName: 'setDecimals', args: [decimals], wallet})
  }
}
