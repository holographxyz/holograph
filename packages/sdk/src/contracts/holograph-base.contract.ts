import {Network} from '@holographxyz/networks'
import {
  Abi,
  Address,
  GetContractReturnType,
  SimulateContractParameters,
  WriteContractParameters,
  getContract,
} from 'viem'

import {Providers, HolographLogger, Config, HolographWallet, HolographWalletManager} from '../services'
import {isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, HolographError, ViemError, isCallException} from '../errors'
import {
  CallContractFunctionArgs,
  EstimateContractGasArgs,
  ReadContractArgs,
  ViemPublicClient,
  SimulateContractArgs,
  WriteContractArgs,
} from '../utils/types'

/**
 * @group Contracts
 * HolographBaseContract
 *
 * @remarks
 *
 * Base contract class for
 *
 */
export class HolographBaseContract {
  protected readonly _config: Config
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  protected readonly _addresses: Record<number, Address> = {}
  protected readonly _providers: Providers
  protected _walletManager?: HolographWalletManager

  constructor(
    protected _logger: HolographLogger,
    protected readonly _abi: Abi,
    private readonly _contractName: string,
  ) {
    this._config = Config.getInstance()
    this.networks = this._config.networks
    this._providers = new Providers()

    if (this._config.accounts !== undefined) {
      this._walletManager = new HolographWalletManager(this._config)
    }
  }

  protected validateWallet = (wallet?: HolographWallet | {account: HolographWallet | string}) => {
    let walletClient: HolographWallet

    if (wallet === undefined && this._walletManager !== undefined) {
      walletClient = this._walletManager.getWallet()
    } else if (wallet !== undefined && this._walletManager !== undefined && typeof wallet.account === 'string') {
      walletClient = this._walletManager.getWallet(wallet.account as string)
    } else if (wallet !== undefined && typeof wallet.account !== 'string') {
      walletClient = wallet.account as HolographWallet
    } else {
      throw new Error(
        'Missing wallet or wallet manager to call write functions. Please provide a valid wallet or configure a wallet manager.',
      )
    }

    return walletClient
  }

  protected async _simulateContract<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    args,
    options,
    transportType = 'custom',
  }: SimulateContractArgs<TAbi>) {
    const logger = this._logger.addContext({functionName})

    let result: any
    try {
      const provider = this._providers.byChainId(chainId, transportType)

      let client = {public: provider}
      const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

      result = await contract.simulate[functionName](args as unknown[], (options as SimulateContractParameters) || {})
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(this._contractName, functionName, error)
      } else {
        holographError = new ViemError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return result
  }

  protected async _estimateContractGas<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractGasArgs<TAbi>) {
    const walletClient = this.validateWallet(wallet)

    let client = {wallet: walletClient.onChain(chainId)}
    const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

    return contract.estimateGas[functionName](args as any, (options as WriteContractParameters) || {})
  }

  protected async _writeContract<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    wallet,
    args,
    options,
  }: WriteContractArgs<TAbi>) {
    const walletClient = this.validateWallet(wallet)

    let client = {wallet: walletClient.onChain(chainId)}
    const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

    return contract.write[functionName](args as unknown[], options || {})
  }

  protected async _readContract<TAbi extends Abi>({chainId, address, functionName, args}: ReadContractArgs<TAbi>) {
    const provider = this._providers.byChainId(chainId)

    let client = {public: provider}
    const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

    return contract.read[functionName](args as unknown[])
  }

  protected async _callContractFunction<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    wallet,
    args,
    options,
  }: CallContractFunctionArgs<TAbi>) {
    const logger = this._logger.addContext({functionName})

    let result: any
    try {
      if (isReadFunction(this._abi, functionName)) {
        result = await this._readContract<typeof this._abi>({
          chainId,
          address,
          functionName,
          args,
        })
      } else {
        result = await this._writeContract<typeof this._abi>({
          chainId,
          address,
          functionName,
          wallet,
          args,
          options,
        })
      }
    } catch (error: any) {
      let holographError: HolographError

      if (isCallException(error)) {
        holographError = new ContractRevertError(this._contractName, functionName, error)
      } else {
        holographError = new ViemError(error, functionName)
      }

      logger.logHolographError(error)

      throw holographError
    }
    return result
    return mapReturnType(result)
  }

  /**
   * @readonly
   * Get the Viem client for a certain network.
   * @param chainId The chain id of the network to get the result from.
   * @returns The Viem client object.
   */
  async getClientByChainId(chainId: number): Promise<ViemPublicClient> {
    return this._providers.byChainId(chainId)
  }

  /**
   * @readonly
   * Get the current gas price for a certain network.
   * @param chainId The chain id of the network to get the result from.
   * @returns The gas price in wei.
   */
  getGasPrice = (chainId: number) => {
    const provider = this._providers.byChainId(chainId)
    return provider.getGasPrice()
  }
}
