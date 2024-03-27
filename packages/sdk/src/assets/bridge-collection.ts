import {Address, Hex, TransactionReceipt, encodeAbiParameters, parseAbiParameters} from 'viem'

import {BridgeAsset} from './bridge-asset'
import {HolographWallet} from '../services'
import {destructSignature} from '../utils/helpers'
import {DeploymentConfig, HolographConfig} from '../utils/types'
import {getErc721DeploymentConfigHash} from '../utils/encoders'

export class BridgeCollection extends BridgeAsset {
  private _initCode: Hex | undefined

  constructor(
    configObject: HolographConfig,
    public readonly chainId: number,
    public readonly contractAddress: Address,
    public readonly erc721DeploymentConfig: DeploymentConfig,
    public wallet: HolographWallet,
    gasSettings?: {sourceGasPrice: bigint; sourceGasLimit: bigint},
  ) {
    super(configObject, gasSettings)
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
    if (!this._initCode) {
      this._initCode = await BridgeCollection.createInitCode(this.chainId, this.erc721DeploymentConfig, this.wallet)
    }
    return this._initCode
  }

  async bridgeOut(toChainId: number): Promise<TransactionReceipt> {
    const bridgeOutPayload = await this.getInitCode()

    return this._bridgeOut(this.chainId, toChainId, this.wallet, this.contractAddress, bridgeOutPayload)
  }
}
