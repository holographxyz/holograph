import {
  http,
  createWalletClient,
  Hex,
  Address,
  HDOptions,
  EIP1193Provider,
  PrivateKeyAccount,
  HDAccount,
  JsonRpcAccount,
  WalletClient,
  publicActions,
  isAddress,
  PublicActions,
  custom,
} from 'viem'
import {privateKeyToAccount, mnemonicToAccount, toAccount} from 'viem/accounts'
import {networks as holographNetworks} from '@holographxyz/networks'

import {
  AccountNameAlreadyExistsError,
  MissingDefaultWalletError,
  MissingNetworkInformationError,
  UnavailableNetworkError,
  WalletNotFoundError,
} from '../errors'
import {getEnvRpcConfig} from '../utils/helpers'
import {holographToViemChain} from '../utils/transformers'
import {HolographAccount, HolographWalletArgs, NetworkRpc} from '../utils/types'
import {Config, HolographLogger} from '.'

/**
 * HolographAccountFactory
 *
 * @remarks
 *
 * Creates HolographAccounts.
 * A HolographAccount is a wrapper for an Externally Owned Account (EOA).
 * An account is a fundamental unit of state within the Ethereum blockchain.
 * It has a unique address, a balance of ether (ETH), and can send transactions.
 */
export class HolographAccountFactory {
  static createAccountUsingPrivateKey(privateKey: Hex): PrivateKeyAccount {
    return privateKeyToAccount(privateKey)
  }

  static createAccountUsingMnemonic(mnemonic: string, options: HDOptions = {}): HDAccount {
    return mnemonicToAccount(mnemonic, options)
  }

  /**
   * Create account using a provider from a browser extension wallet (e.g. Metamask).
   * https://eips.ethereum.org/EIPS/eip-1193
   * @param eip1193Provider A JavaScript Ethereum Provider API that follows the EIP-1193.
   *
   * @example
   * ```ts
   * await createAccountUsingEip1193Provider(window.ethereum)
   * ```
   */
  static async createAccountUsingEip1193Provider(eip1193Provider: unknown): Promise<JsonRpcAccount> {
    const [account] = await (eip1193Provider as EIP1193Provider).request({method: 'eth_requestAccounts'})
    return toAccount(account)
  }

  // create Account: Hierarchical Deterministic (HD) Account
}

/**
 * HolographWallet
 *
 * @remarks
 *
 * Manages a HolographAccount, allowing users to interact with their account into the through the configured networks.
 *
 */
export class HolographWallet {
  private readonly _logger: HolographLogger
  private _account: HolographAccount
  private _multiChainWalletClient: Record<number, WalletClient & PublicActions> = {}
  private _networks?: NetworkRpc
  private _provider?: unknown

  constructor({account, networks, provider}: HolographWalletArgs) {
    const configProvider = Config.getInstance()?.provider
    this._logger = HolographLogger.createLogger({serviceName: HolographWallet.name})
    this._account = account
    this._provider = provider ?? configProvider
    let networksConfig = networks ? networks : getEnvRpcConfig({shouldThrow: false})
    this._networks = networksConfig

    if (!networksConfig && !provider && !configProvider) throw new MissingNetworkInformationError(HolographWallet.name)

    for (const [networkKey, rpc] of Object.entries(networksConfig || {})) {
      const chainId = holographNetworks[networkKey].chain
      this._multiChainWalletClient[chainId] = createWalletClient({
        chain: holographToViemChain(Number(chainId)),
        account: this._account,
        transport: http(rpc),
      }).extend(publicActions)
    }
  }

  get account() {
    return this._account
  }

  getClient(): WalletClient & PublicActions {
    if (!this._provider) throw new Error('Provider is not set')

    const walletClient = createWalletClient({
      account: this._account,
      transport: custom(this._provider as EIP1193Provider),
    }).extend(publicActions)

    return walletClient
  }

  onChain(chainId: number): WalletClient & PublicActions {
    const logger = this._logger.addContext({functionName: this.onChain.name})
    logger.info(`wallet client accessing chainId = ${chainId}`)

    if (this._provider) {
      const walletClient = createWalletClient({
        chain: holographToViemChain(chainId),
        account: this._account,
        transport: custom(this._provider as EIP1193Provider),
      }).extend(publicActions)

      if (walletClient === undefined) {
        throw new UnavailableNetworkError(chainId, this.onChain.name)
      }

      return walletClient
    }

    const walletClient = this._multiChainWalletClient[chainId]

    if (walletClient === undefined) {
      throw new UnavailableNetworkError(chainId, this.onChain.name)
    }

    return walletClient
  }

  async isBalanceSufficientForTx(
    chainId: number,
    gasPrice: bigint,
    gasLimit: bigint,
    value = BigInt(0),
  ): Promise<boolean> {
    const walletBalance = await this.onChain(chainId).getBalance({address: this._account.address})

    const totalGas = gasPrice * gasLimit
    const totalBalanceNeeded = totalGas + value

    return walletBalance > totalBalanceNeeded
  }
}

/**
 * HolographWalletManager
 *
 * @remarks
 *
 * Manages a set of HolographWallets.
 *
 */
export class HolographWalletManager {
  private readonly _logger: HolographLogger
  private readonly _networks: NetworkRpc
  private _wallets: {[accountName: string]: HolographWallet} = {}
  private _addressToAccountName: {[address: Address]: string} = {}

  constructor(private readonly protocolConfig: Config) {
    this._logger = HolographLogger.createLogger({serviceName: HolographWalletManager.name})

    if (this.protocolConfig.accounts?.default === undefined) {
      throw new MissingDefaultWalletError(HolographWalletManager.name)
    }

    this._networks = this.protocolConfig.networksRpc

    for (const [accountName, account] of Object.entries(this.protocolConfig.accounts)) {
      this._wallets[accountName] = new HolographWallet({
        account,
        networks: this._networks,
        provider: this.protocolConfig.provider,
      })
      this._addressToAccountName[account.address] = accountName
    }
  }

  get allWallets(): {[accountName: string]: HolographWallet} {
    return this._wallets
  }

  getWallet(account: (string & keyof typeof this._wallets) | Address = 'default') {
    let accountName: string | undefined = account

    if (isAddress(account)) {
      accountName = this._addressToAccountName[account]
    }

    if (Object.keys(this._wallets).includes(accountName)) {
      return this._wallets[accountName]
    }

    throw new WalletNotFoundError(account, this.getWallet.name)
  }

  getAccountNameToAddressMap(): {[accountName: string]: Address} {
    const map = {}

    for (const [accountName, wallet] of Object.entries(this._wallets)) {
      map[accountName] = wallet.account
    }

    return map
  }

  addAccount(accountName: string, account: HolographAccount): HolographWallet {
    const logger = this._logger.addContext({functionName: this.addAccount.name})

    let name = accountName
    if (this._wallets === undefined) {
      logger.warn(`Setting the "default" account to ${account}`)
      name = 'default'
    }

    const notAllowed = Object.keys(this._wallets)

    if (notAllowed.includes(accountName)) {
      throw new AccountNameAlreadyExistsError(accountName, this.addAccount.name)
    }

    this._wallets[name] = new HolographWallet({account, networks: this._networks})
    return this._wallets[name]
  }

  updateAccount(account: HolographAccount, accountName: 'default'): HolographWallet {
    const logger = this._logger.addContext({functionName: this.updateAccount.name})

    const accountsNames = Object.keys(this._wallets)
    if (!accountsNames.includes(accountName)) {
      throw new WalletNotFoundError(accountName, this.updateAccount.name)
    }

    logger.warn(`WARN: "${accountName}" account is being overridden`)

    // Update wallet clients
    this._wallets[accountName] = new HolographWallet({account, networks: this._networks})
    return this._wallets[accountName]
  }
}
