import {Network} from '@holographxyz/networks'
import {Abi, Address, GetContractReturnType, getContract} from 'viem'

import {Providers, HolographLogger, Config, HolographWallet, HolographWalletManager} from '../services'
import {isReadFunction, mapReturnType} from '../utils/contracts'
import {ContractRevertError, HolographError, ViemError, isCallException} from '../errors'
import {CallContractFunctionArgs, ReadContractArgs, WriteContractArgs} from '../utils/types'

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
  /** The list of networks in which the contract was instantiated. */
  public readonly networks: Network[]
  /** The record of addresses per chainId. */
  protected readonly _addresses: Record<number, Address> = {}
  protected readonly _providers: Providers
  protected _walletManager?: HolographWalletManager

  constructor(
    protected readonly _config: Config,
    protected _logger: HolographLogger,
    protected readonly _abi: Abi,
    private readonly _contractName: string,
  ) {
    this.networks = this._config.networks
    this._providers = new Providers(_config)

    if (_config.accounts !== undefined) {
      this._walletManager = new HolographWalletManager(_config)
    }
  }

  protected async _writeContract<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    wallet,
    args,
  }: WriteContractArgs<TAbi>) {
    let walletClient: HolographWallet

    if (wallet === undefined && this._walletManager !== undefined) {
      walletClient = this._walletManager.getWallet()
    } else if (wallet !== undefined && this._walletManager !== undefined && typeof wallet.account === 'string') {
      walletClient = this._walletManager.getWallet(wallet.account as string)
    } else if (wallet !== undefined && typeof wallet.account !== 'string') {
      walletClient = wallet.account as HolographWallet
    } else {
      throw new Error(
        'Missing wallet or wallet manager to call read functions. Please provide a valid wallet or configure a wallet manager.',
      )
    }

    let client = {wallet: walletClient.onChain(chainId)}
    //@ts-ignore TODO: fix this type error
    const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

    return await contract.write[functionName](args as unknown[])
  }

  protected async _readContract<TAbi extends Abi>({chainId, address, functionName, args}: ReadContractArgs<TAbi>) {
    const provider = this._providers.byChainId(chainId)

    let client = {public: provider}
    //@ts-ignore TODO: fix this type error
    const contract: GetContractReturnType<Abi, typeof client> = getContract({address, abi: this._abi, client})

    return await contract.read[functionName](args as unknown[])
  }

  protected async _callContractFunction<TAbi extends Abi>({
    chainId,
    address,
    functionName,
    wallet,
    args,
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
    return mapReturnType(result)
  }
}
