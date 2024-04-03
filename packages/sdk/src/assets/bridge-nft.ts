import {Address, Hex, Transaction, encodeAbiParameters, hexToBigInt, parseAbiParameters, zeroAddress} from 'viem'

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

  get from() {
    return this._bridgeNftInput.from
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
    const logger = this._logger.addContext({functionName: this.bridgeOut.name})

    if (!this._initCode) {
      const {from, tokenId} = this._bridgeNftInput
      const to = this._bridgeNftInput.to ?? from

      logger.debug(`Creating initCode for ${from}, ${to} and ${tokenId}...`)

      this._initCode = await BridgeNft.createInitCode(from, to, tokenId)
    }

    return this._initCode
  }

  async bridgeOut(wallet: HolographWallet, destinationChainId?: number): Promise<Transaction> {
    const logger = this._logger.addContext({functionName: this.bridgeOut.name})

    let toChainId = this.destinationChainId
    if (destinationChainId) {
      toChainId = destinationChainId
      logger.warn(`WARN: destinationChainId (${this.destinationChainId}) is being override.`)
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
