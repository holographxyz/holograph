import {getContract} from 'viem'
import {Network} from '@holographxyz/networks'
import {Address, ExtractAbiFunctionNames} from 'abitype'

import {HolographByNetworksResponse, getSelectedNetworks, isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, ViemError, HolographError, isCallException} from '../errors'
import {Providers, HolographLogger, Config} from '../services'
import {OVM_GasPriceOracleABI} from '../constants/abi/develop'
import {Addresses} from '../constants/addresses'

type OVMGasPriceOracleFunctionNames = ExtractAbiFunctionNames<typeof OVM_GasPriceOracleABI>

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
export class OVMGasPriceOracle {
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  private readonly _addresses: Record<number, Address> = {}
  private readonly _providers: Providers
  private _logger: HolographLogger

  constructor(private readonly config: Config, parentLogger?: HolographLogger) {
    this._providers = new Providers(config)

    if (parentLogger) {
      this._logger = parentLogger.addContext({className: OVMGasPriceOracle.name})
    } else {
      this._logger = HolographLogger.createLogger({className: OVMGasPriceOracle.name})
    }

    this.networks = this.config.networks
  }

  /**
   * @readonly
   * Get the OVM_GasPriceOracle contract address according to environment and chainId module.
   * @param chainId The chainId of the network to get the result from.
   * @returns The OVM_GasPriceOracle contract address in the provided network.
   */
  getAddress(chainId: number): Address {
    return Addresses.ovmGasPriceOracle(this.config.environment, Number(chainId)) as Address
  }

  private async _getContractFunction(chainId: number, functionName: OVMGasPriceOracleFunctionNames, ...args: any[]) {
    const logger = this._logger.addContext({functionName})
    const provider = this._providers.byChainId(chainId)
    const address = this.getAddress(chainId)

    const contract = getContract({address, abi: OVM_GasPriceOracleABI, client: provider})

    let result
    try {
      if (isReadFunction(OVM_GasPriceOracleABI, functionName)) {
        result = await contract.read[functionName](args)
      } else {
        result = await contract.write[functionName](args)
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError('OVM_GasPriceOracle', functionName, error)
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
   * Computes the L1 portion of the fee based on the size of the RLP encoded tx and the current l1BaseFee.
   * @param chainId The chainId of the network to get the result from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The L1 fee that should be paid for the tx.
   */
  async getL1Fee(chainId: number, data: string | Buffer) {
    return this._getContractFunction(chainId, 'getL1Fee', data)
  }

  /**
   * @readonly
   * Computes the L1 portion of the fee based on the size of the RLP encoded tx and the current l1BaseFee.
   * @param chainIds The list of network chainIds to get the results from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The L1 fee that should be paid for the tx  per network.
   */
  async getL1FeeByNetworks(chainIds: number[], data: string | Buffer): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getL1Fee', data)
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
   * @param chainId The chainId of the network to get the result from.
   * @param data Unsigned RLP encoded tx, 6 elements
   * @returns The amount of L1 gas used for a transaction.
   */
  async getL1GasUsed(chainId: number, data: string | Buffer) {
    return this._getContractFunction(chainId, 'getL1GasUsed', data)
  }

  /**
   * @readonly
   * Computes the amount of L1 gas used for a transaction.
   * @param chainIds The list of network chainIds to get the results from.
   * @param data Unsigned RLP encoded tx, 6 elements.
   * @returns The amount of L1 gas used for a transaction per network.
   */
  async getL1GasUsedByNetworks(chainIds: number[], data: string | Buffer): Promise<HolographByNetworksResponse> {
    const results: HolographByNetworksResponse = {}
    let networks = getSelectedNetworks(this.networks, chainIds)

    for (const network of networks) {
      results[network.chain] = await this._getContractFunction(network.chain, 'getL1GasUsed', data)
    }

    return results
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the L2 gas price.
   * @param gasPrice The new L2 gas price.
   * @returns A transaction.
   */
  async setGasPrice(chainId: number, gasPrice: bigint) {
    return this._getContractFunction(chainId, 'setGasPrice', gasPrice)
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the L1 base fee.
   * @param baseFee The new L1 base fee.
   * @returns A transaction.
   */
  async setL1BaseFee(chainId: number, baseFee: bigint) {
    return this._getContractFunction(chainId, 'setL1BaseFee', baseFee)
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the overhead.
   * @param overhead The new overhead.
   * @returns A transaction.
   */
  async setOverhead(chainId: number, overhead: bigint) {
    return this._getContractFunction(chainId, 'setOverhead', overhead)
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the scalar.
   * @param scalar The new scalar.
   * @returns A transaction.
   */
  async setScalar(chainId: number, scalar: bigint) {
    return this._getContractFunction(chainId, 'setScalar', scalar)
  }

  /**
   * @onlyAdmin
   * Allows the owner to modify the decimals.
   * @param decimals The new decimals.
   * @returns A transaction.
   */
  async setDecimals(chainId: number, decimals: bigint) {
    return this._getContractFunction(chainId, 'setDecimals', decimals)
  }
}
