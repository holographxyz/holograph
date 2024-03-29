import {Hex, Transaction, encodeAbiParameters, parseAbiParameters} from 'viem'

import {BridgeAsset} from './bridge-asset'
import {HolographLogger, HolographWallet} from '../services'
import {destructSignature} from '../utils/helpers'
import {BridgeCollectionInput, DeploymentConfig, HolographConfig} from '../utils/types'
import {getErc721DeploymentConfigHash} from '../utils/encoders'

export class BridgeCollection extends BridgeAsset {
  private _initCode: Hex | undefined

  constructor(
    configObject: HolographConfig,
    private readonly _bridgeCollectionInput: BridgeCollectionInput,
    gasSettings?: {sourceGasPrice: bigint; sourceGasLimit: bigint},
  ) {
    const _logger = HolographLogger.createLogger({className: BridgeCollection.name})
    super(configObject, _logger, gasSettings)
  }

  get sourceChainId() {
    return this._bridgeCollectionInput.sourceChainId
  }

  get contractAddress() {
    return this._bridgeCollectionInput.contractAddress
  }

  get erc721DeploymentConfig() {
    return this._bridgeCollectionInput.erc721DeploymentConfig
  }

  get account() {
    return this._bridgeCollectionInput.wallet.account
  }

  static async createInitCode(
    chainId: number,
    erc721DeploymentConfig: DeploymentConfig,
    wallet: HolographWallet,
  ): Promise<Hex> {
    const erc721DeploymentConfigHash = getErc721DeploymentConfigHash(erc721DeploymentConfig, wallet.account.address)

    const signature = await wallet.onChain(chainId).signMessage({
      account: wallet.account,
      message: erc721DeploymentConfigHash,
    })

    const initCode = encodeAbiParameters(
      parseAbiParameters([
        'DeploymentConfig config',
        'struct DeploymentConfig { bytes32 contractType; uint32 chainType; bytes32 salt; bytes byteCode; bytes initCode; }',
        'Verification signature',
        'struct Verification { bytes32 r; bytes32 s; uint8 v; }',
        'address signer',
      ]),
      // @ts-ignore NOTE: for some reason the inference for the the return type is wrong
      [erc721DeploymentConfig, destructSignature(signature), wallet.account.address],
    )

    return initCode
  }

  async getInitCode() {
    const logger = this._logger.addContext({functionName: this.getInitCode.name})

    if (!this._initCode) {
      logger.debug(`Creating initCode for ${this.sourceChainId}, ${this.erc721DeploymentConfig} and ${this.account}...`)

      this._initCode = await BridgeCollection.createInitCode(
        this.sourceChainId,
        this.erc721DeploymentConfig,
        this._bridgeCollectionInput.wallet,
      )
    }
    return this._initCode
  }

  async bridgeOut(destinationChainId: number): Promise<Transaction> {
    const logger = this._logger.addContext({functionName: this.bridgeOut.name})

    const bridgeOutPayload = await this.getInitCode()

    logger.info(`Making bridgeOut request...`)

    logger.debug(
      {
        sourceChainId: this.sourceChainId,
        destinationChainId,
        contractAddress: this.contractAddress,
        bridgeOutPayload,
        account: this.account,
      },
      `bridgeOut request input`,
    )

    return this._bridgeOut(
      this.sourceChainId,
      destinationChainId,
      this.contractAddress,
      bridgeOutPayload,
      this._bridgeCollectionInput.wallet,
    )
  }
}
