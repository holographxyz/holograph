import {Address, Hex, Transaction, encodeAbiParameters, hexToBigInt, parseAbiParameters} from 'viem'

import {BridgeAsset} from './bridge-asset'
import {HolographLogger, HolographWallet} from '../services'
import {BridgeNFTInput, GasSettings, HolographConfig} from '../utils/types'

export class BridgeNFT extends BridgeAsset {
  private _initCode: Hex | undefined

  constructor(
    private readonly _bridgeNFTInput: BridgeNFTInput,
    public holographConfig?: HolographConfig,
    gasSettings?: GasSettings,
  ) {
    const _logger = HolographLogger.createLogger({className: BridgeNFT.name})
    super(holographConfig, gasSettings, _logger)
  }

  get contractAddress() {
    return this._bridgeNFTInput.contractAddress
  }

  get tokenId() {
    return this._bridgeNFTInput.tokenId
  }

  // Note: If the 'from' parameter is not provided, it's assumed that the wallet is the owner of the NFT.
  get from() {
    return this._bridgeNFTInput.from ?? this._bridgeNFTInput.wallet.account.address
  }

  // Note: If the 'to' parameter is not provided, it's assumed that the ownership has not changed.
  get to() {
    return this._bridgeNFTInput.to ?? this.from
  }

  get destinationChainId() {
    return this._bridgeNFTInput.destinationChainId
  }

  get sourceChainId() {
    return this._bridgeNFTInput.sourceChainId
  }

  static async createInitCode(from: Address, to: Address, tokenId: Hex): Promise<Hex> {
    const initCode = encodeAbiParameters(parseAbiParameters('address, address, uint256'), [
      from,
      to,
      hexToBigInt(tokenId, {size: 32}),
    ])

    return initCode
  }

  public async getInitCode() {
    const logger = this._logger.addContext({
      functionName: this.bridgeOut.name,
    })

    if (!this._initCode) {
      logger.debug(`Creating initCode for ${this.from}, ${this.to} and ${this.tokenId}...`)

      this._initCode = await BridgeNFT.createInitCode(this.from, this.to, this.tokenId)
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

    let wallet = this._bridgeNFTInput.wallet
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
