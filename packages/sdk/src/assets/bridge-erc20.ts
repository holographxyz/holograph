import {Address, Hex, Transaction, encodeAbiParameters, parseAbiParameters} from 'viem'

import {BridgeAsset} from './bridge-asset'
import {HolographLogger, HolographWallet} from '../services'
import {BridgeERC20Input} from '../utils/types'

export class BridgeERC20 extends BridgeAsset {
  private _initCode: Hex | undefined

  constructor(private readonly _bridgeERC20Input: BridgeERC20Input) {
    const _logger = HolographLogger.createLogger({className: BridgeERC20.name})
    super(_bridgeERC20Input.gasSettings, _logger)
  }

  get contractAddress() {
    return this._bridgeERC20Input.contractAddress
  }

  get amount() {
    return this._bridgeERC20Input.amount
  }

  // Note: If the 'from' parameter is not provided, it's assumed that the wallet is the owner of the NFT.
  get from() {
    return this._bridgeERC20Input.from ?? this._bridgeERC20Input.wallet.account.address
  }

  // Note: If the 'to' parameter is not provided, it's assumed that the ownership has not changed.
  get to() {
    return this._bridgeERC20Input.to ?? this.from
  }

  get destinationChainId() {
    return this._bridgeERC20Input.destinationChainId
  }

  get sourceChainId() {
    return this._bridgeERC20Input.sourceChainId
  }

  static async createInitCode(from: Address, to: Address, amount: bigint): Promise<Hex> {
    const initCode = encodeAbiParameters(parseAbiParameters('address, address, uint256'), [from, to, amount])

    return initCode
  }

  public async getInitCode() {
    const logger = this._logger.addContext({
      functionName: this.bridgeOut.name,
    })

    if (!this._initCode) {
      logger.debug(`Creating initCode for ${this.from}, ${this.to} and ${this.amount}...`)

      this._initCode = await BridgeERC20.createInitCode(this.from, this.to, this.amount)
    }

    return this._initCode
  }

  public async bridgeOut(walletOverride?: HolographWallet, destinationChainId?: number): Promise<Transaction> {
    const logger = this._logger.addContext({
      functionName: this.bridgeOut.name,
    })

    let toChainId = this.destinationChainId
    if (destinationChainId) {
      toChainId = destinationChainId
      logger.warn(`WARN: destinationChainId (${this.destinationChainId}) is being override.`)
    }

    let wallet = this._bridgeERC20Input.wallet
    if (walletOverride) {
      wallet = walletOverride
    }

    const bridgeOutPayload = await this.getInitCode()

    logger.info(`Making bridgeOut request...`)

    logger.debug(`bridgeOut request input`, {
      sourceChainId: this.sourceChainId,
      destinationChainId: toChainId,
      contractAddress: this.contractAddress,
      bridgeOutPayload,
      account: wallet.account,
    })

    return this._bridgeOut(this.sourceChainId, toChainId, this.contractAddress, bridgeOutPayload, wallet)
  }
}
