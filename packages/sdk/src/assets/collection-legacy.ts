import {Address, Hex, encodeAbiParameters, parseAbiParameters, toBytes} from 'viem'

import {CollectionInfo, CreateLegacyCollection, validate} from './collection.validation'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Factory, Registry} from '../contracts'
import {Config, HolographWallet} from '../services'
import {decodeBridgeableContractDeployedEvent} from '../utils/decoders'
import {allEventsEnabled, destructSignature, generateRandomSalt, parseBytes} from '../utils/helpers'
import {evm2hlg} from '../utils/transformers'
import {
  DeploymentConfig,
  ERC721Config,
  GasFee,
  HolographConfig,
  Signature,
  SignDeploy,
  WriteContractOptions,
} from '../utils/types'
import {create2AddressFromDeploymentHash, getERC721DeploymentConfigHash} from '../utils/encoders'
import {IsNotDeployed} from '../utils/decorators'

export class HolographLegacyCollection {
  private _collectionInfo: CollectionInfo
  public primaryChainId: number
  public account?: Address
  public chainIds?: number[]
  public collectionAddress?: Address
  public erc721ConfigHash?: Hex
  public predictedCollectionAddress?: Address
  public signature?: Signature
  public txHash?: string

  private readonly factory: Factory
  private readonly registry: Registry

  constructor(public holographConfig: HolographConfig, {collectionInfo, primaryChainId}: CreateLegacyCollection) {
    this._collectionInfo = validate.collectionInfo.parse(collectionInfo)
    this.primaryChainId = validate.primaryChainId.parse(primaryChainId)

    const config = Config.getInstance(holographConfig)
    this.factory = new Factory(config)
    this.registry = new Registry(config)
    this.chainIds = []
  }

  get name() {
    return this._collectionInfo.name
  }

  get description(): string | undefined {
    return this._collectionInfo.description
  }

  get symbol() {
    return this._collectionInfo.symbol
  }

  get tokenType() {
    return this._collectionInfo.tokenType
  }

  get royaltiesBps() {
    return this._collectionInfo.royaltiesBps
  }

  get salt() {
    return this._collectionInfo.salt
  }

  public getCollectionInfo() {
    return this._collectionInfo
  }

  @IsNotDeployed()
  public setName(name: string) {
    validate.name.parse(name)
    this._collectionInfo.name = name
  }

  @IsNotDeployed()
  public setDescription(description: string) {
    validate.description.parse(description)
    this._collectionInfo.description = description
  }

  @IsNotDeployed()
  public setSymbol(symbol: string) {
    validate.symbol.parse(symbol)
    this._collectionInfo.symbol = symbol
  }

  @IsNotDeployed()
  public setTokenType(tokenType: CollectionInfo['tokenType']) {
    validate.tokenType.parse(tokenType)
    this._collectionInfo.tokenType = tokenType
  }

  @IsNotDeployed()
  public setRoyaltiesBps(royalties: number) {
    validate.royaltiesBps.parse(royalties)
    this._collectionInfo.royaltiesBps = royalties
  }

  @IsNotDeployed()
  public setSalt(salt: Hex) {
    validate.salt.parse(salt)
    this._collectionInfo.salt = salt
  }

  public async createERC721DeploymentConfig(
    account: Address,
    chainId = this.primaryChainId,
  ): Promise<DeploymentConfig> {
    const chainType = evm2hlg(chainId)
    const erc721Hash = parseBytes('HolographERC721')
    const salt = this.salt || generateRandomSalt()
    const initCode = await this._generateInitCode(account, chainId)

    const erc721Config: DeploymentConfig = {
      contractType: erc721Hash,
      chainType,
      byteCode: bytecodes.CxipERC721,
      initCode,
      salt,
    }

    return erc721Config
  }

  /**
   * @param holographWallet - The HolographWallet instance to sign the deploy.
   * @param chainId - The chainId to sign the deploy. It's optional and defaults to the primaryChainId.
   * @returns - The signature data with the config and signature to deploy the collection contract.
   */
  public async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account, chainId)

    const config = collectionPayload?.config
    const signedMessage = await holographWallet.onChain(chainId).signMessage({
      account: holographWallet.account,
      message: config?.erc721ConfigHash,
    })
    const signature = destructSignature(signedMessage)
    this.signature = signature

    return {
      account,
      chainId,
      config: config?.erc721Config,
      signature,
    }
  }

  /**
   * @param signatureData - The signature data returned from signDeploy function.
   * @returns - A transaction hash.
   */
  public async deploy(
    signatureData: SignDeploy,
    options?: WriteContractOptions,
  ): Promise<{
    collectionAddress: Address
    txHash: Hex
  }> {
    const {account, chainId, config, signature, wallet} = signatureData
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingCollection(signatureData, chainId)
    const txHash = (await this.factory.deployHolographableContract(chainId!, config, signature, account, wallet, {
      ...options,
      gasPrice,
      gas: gasLimit,
    })) as Hex

    const client = await this.factory.getClientByChainId(chainId!)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const collectionAddress = decodeBridgeableContractDeployedEvent(receipt)?.[0]?.values?.[0]

    this.collectionAddress = collectionAddress
    this.chainIds?.push(chainId!)
    this.txHash = txHash

    return {
      collectionAddress,
      txHash,
    }
  }

  // TODO: Do later
  public deployBatch() {}

  private async _getFactoryAddress(chainId = this.primaryChainId) {
    return this.factory.getAddress(chainId)
  }

  private async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  private async _getPredictedCollectionAddress(erc721ConfigHash: Hex, chainId = this.primaryChainId): Promise<Address> {
    const factoryAddress = await this._getFactoryAddress(chainId)

    const erc721FutureAddress = create2AddressFromDeploymentHash(erc721ConfigHash, factoryAddress)
    this.predictedCollectionAddress = erc721FutureAddress

    return erc721FutureAddress
  }

  private async _generateInitCode(account: Address, chainId = this.primaryChainId) {
    const registryAddress = await this._getRegistryAddress(chainId)
    const creatorEncoded = encodeAbiParameters(parseAbiParameters('address'), [account])
    const initCodeEncoded = encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      parseBytes('CxipERC721'),
      registryAddress,
      creatorEncoded,
    ])

    return encodeAbiParameters(parseAbiParameters('string, string, uint16, uint256, bool, bytes'), [
      this.name,
      this.symbol,
      this.royaltiesBps,
      // @ts-ignore
      allEventsEnabled(), // eventConfig
      false, // skipInit
      initCodeEncoded,
    ])
  }

  private async _getCollectionPayload(
    account: Address,
    chainId = this.primaryChainId,
  ): Promise<{salt: Hex; config: ERC721Config}> {
    const erc721Config = await this.createERC721DeploymentConfig(account, chainId)

    const erc721ConfigHash = getERC721DeploymentConfigHash(erc721Config, account)
    this.erc721ConfigHash = erc721ConfigHash

    const erc721ConfigHashBytes = toBytes(erc721ConfigHash)
    const erc721FutureAddress = await this._getPredictedCollectionAddress(erc721ConfigHash, chainId)

    return {
      config: {
        erc721Hash: erc721Config.contractType,
        erc721Config,
        erc721ConfigHash,
        erc721ConfigHashBytes,
        erc721FutureAddress,
      },
      salt: erc721Config.salt,
    }
  }

  private async _estimateGasForDeployingCollection(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.legacyCollectionDeploy[chainId]

    if (gasController?.gasPrice) {
      gasPrice = gasController.gasPrice
    } else {
      gasPrice = await this.factory.getGasPrice(chainId)
    }

    if (gasController?.gasLimit) {
      gasLimit = gasController.gasLimit
    } else {
      gasLimit = await this.factory.estimateContractFunctionGas({
        args: [config, signature, account],
        chainId,
        functionName: 'deployHolographableContract',
      })
    }

    if (gasController?.gasLimitMultiplier) {
      gasLimit = (gasLimit * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPriceMultiplier) {
      gasPrice = (gasPrice * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    const gas = gasPrice * gasLimit

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }
}
