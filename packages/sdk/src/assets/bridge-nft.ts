import {Address, Hex, Transaction, encodeAbiParameters, hexToBigInt, parseAbiParameters} from 'viem'

import {BridgeAsset} from './bridge-asset'
import {HolographLogger, HolographWallet} from '../services'
import {BridgeNftInput, HolographConfig} from '../utils/types'

export class BridgeNft extends BridgeAsset {
  private _initCode: Hex | undefined

  constructor(
    configObject: HolographConfig,
    private readonly _bridgeNftInput: BridgeNftInput,
    gasSettings?: {sourceGasPrice: bigint; sourceGasLimit: bigint},
  ) {
    const _logger = HolographLogger.createLogger({className: BridgeNft.name})
    super(configObject, _logger, gasSettings)
  }

  get contractAddress() {
    return this._bridgeNftInput.contractAddress
  }

  get tokenId() {
    return this._bridgeNftInput.tokenId
  }

  // Note: If the 'from' parameter is not provided, it's assumed that the wallet is the owner of the NFT.
  get from() {
    return this._bridgeNftInput.from ?? this._bridgeNftInput.wallet.account.address
  }

  // Note: If the 'to' parameter is not provided, it's assumed that the ownership has not changed.
  get to() {
    return this._bridgeNftInput.to ?? this.from
  }

  get destinationChainId() {
    return this._bridgeNftInput.destinationChainId
  }

  get sourceChainId() {
    return this._bridgeNftInput.sourceChainId
  }

  static async createInitCode(from: Address, to: Address, tokenId: Hex): Promise<Hex> {
    const initCode = encodeAbiParameters(parseAbiParameters('address, address, uint256'), [
      from,
      to,
      hexToBigInt(tokenId, {size: 32}),
    ])

    return initCode
  }

  async getInitCode() {
    const logger = this._logger.addContext({
      functionName: this.bridgeOut.name,
    })

    if (!this._initCode) {
      logger.debug(`Creating initCode for ${this.from}, ${this.to} and ${this.tokenId}...`)

      this._initCode = await BridgeNft.createInitCode(this.from, this.to, this.tokenId)
    }

    return this._initCode
  }

  async bridgeOut(walletOverride?: HolographWallet, destinationChainId?: number): Promise<Transaction> {
    const logger = this._logger.addContext({
      functionName: this.bridgeOut.name,
    })

    let toChainId = this.destinationChainId
    if (destinationChainId) {
      toChainId = destinationChainId
      logger.warn(`WARN: destinationChainId (${this.destinationChainId}) is being override.`)
    }

    let wallet = this._bridgeNftInput.wallet
    if (walletOverride) {
      wallet = walletOverride
    }

    const bridgeOutPayload = await this.getInitCode()

    logger.info(`Making bridgeOut request...`)

    logger.debug(
      {
        sourceChainId: this.sourceChainId,
        destinationChainId: toChainId,
        contractAddress: this.contractAddress,
        bridgeOutPayload,
        account: wallet.account,
      },
      `bridgeOut request input`,
    )

    return this._bridgeOut(this.sourceChainId, toChainId, this.contractAddress, bridgeOutPayload, wallet)
  }
}
