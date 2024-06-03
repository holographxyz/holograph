import {Address, Hex, encodeAbiParameters, hexToBytes, parseAbiParameters} from 'viem'

import {
  CollectionInfo,
  CreateMoeCollection,
  HolographDropERC721InitCodeV1Params,
  HolographDropERC721InitCodeV2Params,
  HolographERC721InitCodeParams,
  HolographMoeSalesConfig,
  MoeCollectionInfo,
  NFTInfo,
  DROP_INIT_CODE_ABI_PARAMETERS,
  validate,
  HydrateMoeCollection,
} from './collection.validation'
import {getEnv} from '../config/env.validation'
import {Addresses} from '../constants/addresses'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Factory, Registry} from '../contracts'
import {Config, HolographWallet} from '../services'
import {decodeBridgeableContractDeployedEvent} from '../utils/decoders'
import {EnforceHydrateCheck, IsNotDeployed} from '../utils/decorators'
import {getERC721DropDeploymentConfigHash} from '../utils/encoders'
import {
  destructSignature,
  enableDropEvents,
  enableDropEventsV2,
  generateRandomSalt,
  hexify,
  parseISODateToTimestampSeconds,
  strictECDSA,
} from '../utils/helpers'
import {evm2hlg} from '../utils/transformers'
import {
  GasFee,
  GetDropInitCodeParams,
  HolographConfig,
  SignDeploy,
  Signature,
  WriteContractOptions,
} from '../utils/types'

export class HolographMoeERC721DropV1 {
  protected _isHydrated = false
  protected _collectionInfo: CollectionInfo
  public nftInfo: NFTInfo
  public salesConfig: HolographMoeSalesConfig
  public primaryChainId: number
  public account?: Address
  public chainIds?: number[]
  public collectionAddress?: Address
  public erc721ConfigHash?: Hex
  public signature?: Signature
  public txHash?: string

  private factory: Factory
  private registry: Registry

  constructor(
    {collectionInfo, nftInfo, primaryChainId, salesConfig}: CreateMoeCollection,
    public holographConfig?: HolographConfig,
  ) {
    this._collectionInfo = validate.collectionInfo.parse(collectionInfo)
    this.nftInfo = validate.nftInfo.parse(nftInfo)
    this.salesConfig = validate.salesConfig.parse(salesConfig)
    this.primaryChainId = validate.primaryChainId.parse(primaryChainId)

    const config = Config.getInstance(holographConfig)
    this.factory = new Factory(config)
    this.registry = new Registry(config)
    this.chainIds = []
  }

  static hydrate({
    collectionInfo,
    nftInfo,
    salesConfig,
    chainId,
    address,
    txHash,
  }: HydrateMoeCollection): HolographMoeERC721DropV1 {
    const instance = new HolographMoeERC721DropV1({
      collectionInfo,
      nftInfo,
      salesConfig,
      primaryChainId: chainId,
    })

    instance.chainIds = [chainId]
    instance.collectionAddress = address
    instance.txHash = txHash
    instance._isHydrated = true

    if (!collectionInfo.salt) {
      instance._collectionInfo.salt = '0x0' as Hex
    }

    return instance
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

  get publicSalePrice() {
    return this.salesConfig.publicSalePrice
  }

  get maxSalePurchasePerAddress() {
    return this.salesConfig.maxSalePurchasePerAddress
  }

  get publicSaleStart() {
    return this.salesConfig.publicSaleStart
  }

  get publicSaleEnd() {
    return this.salesConfig.publicSaleEnd
  }

  get presaleStart(): string | undefined {
    return this.salesConfig.presaleStart
  }

  get presaleEnd(): string | undefined {
    return this.salesConfig.presaleEnd
  }

  get presaleMerkleRoot(): string | undefined {
    return this.salesConfig.presaleMerkleRoot
  }

  get nftIpfsUrl() {
    return this.nftInfo.ipfsUrl
  }

  get nftIpfsImageCid() {
    return this.nftInfo.ipfsImageCid
  }

  get isHydrated() {
    return this._isHydrated
  }

  public getCollectionInfo(): MoeCollectionInfo {
    return {...this._collectionInfo, ...this.nftInfo, ...this.salesConfig}
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

  @IsNotDeployed()
  public setPublicSalePrice(publicSalePrice: number) {
    validate.publicSalePrice.parse(publicSalePrice)
    this.salesConfig.publicSalePrice = publicSalePrice
  }

  @IsNotDeployed()
  public setMaxSalePurchasePerAddress(maxSalePurchasePerAddress: number) {
    validate.maxSalePurchasePerAddress.parse(maxSalePurchasePerAddress)
    this.salesConfig.maxSalePurchasePerAddress = maxSalePurchasePerAddress
  }

  @IsNotDeployed()
  public setPublicSaleStart(publicSaleStart: string) {
    validate.publicSaleStart.parse(publicSaleStart)
    this.salesConfig.publicSaleStart = publicSaleStart
  }

  @IsNotDeployed()
  public setPublicSaleEnd(publicSaleEnd: string) {
    validate.publicSaleEnd.parse(publicSaleEnd)
    this.salesConfig.publicSaleEnd = publicSaleEnd
  }

  @IsNotDeployed()
  public setPresaleStart(presaleStart: string) {
    validate.presaleStart.parse(presaleStart)
    this.salesConfig.presaleStart = presaleStart
  }

  @IsNotDeployed()
  public setPresaleEnd(presaleEnd: string) {
    validate.presaleEnd.parse(presaleEnd)
    this.salesConfig.presaleEnd = presaleEnd
  }

  @IsNotDeployed()
  public setPresaleMerkleRoot(presaleMerkleRoot: string) {
    validate.presaleMerkleRoot.parse(presaleMerkleRoot)
    this.salesConfig.presaleMerkleRoot = presaleMerkleRoot
  }

  @IsNotDeployed()
  public setIpfsUrl(nftIpfsUrl: string) {
    validate.nftIpfsUrl.parse(nftIpfsUrl)
    this.nftInfo.ipfsUrl = nftIpfsUrl
  }

  @IsNotDeployed()
  public setIpfsImageCid(nftIpfsImageCid: string) {
    validate.nftIpfsImageCid.parse(nftIpfsImageCid)
    this.nftInfo.ipfsImageCid = nftIpfsImageCid
  }

  /**
   * @param holographWallet - The HolographWallet instance to sign the deploy.
   * @param chainId - The chainId to sign the deploy. It's optional and defaults to the primaryChainId.
   * @returns - The signature data with the config and signature to deploy the collection contract.
   */
  @EnforceHydrateCheck()
  public async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account, chainId)

    const {configHash, configHashBytes, ...config} = collectionPayload

    const signedMessage = await holographWallet
      .onChain(chainId)
      .signMessage({
        account: holographWallet.account,
        message: configHash,
      })
      .catch(() => {
        throw new Error('Signature rejected.')
      })
    const signature = strictECDSA(destructSignature(signedMessage))
    const parsedSignature = {...signature, v: String(Number.parseInt(String(signature.v), 16)) as Hex}
    this.signature = parsedSignature

    return {
      account,
      chainId,
      config,
      signature: parsedSignature,
      wallet: {account: holographWallet},
    }
  }

  /**
   * @param signatureData - The signature data returned from signDeploy function.
   * @returns - A transaction hash.
   */
  @EnforceHydrateCheck()
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

  protected async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  protected _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRendererV1()
  }

  protected _getDropContractType() {
    return hexify('HolographDropERC721')
  }

  protected _getEventConfig() {
    return enableDropEvents()
  }

  protected _generateMetadataRendererInitCode(description: string, imageURI: string, animationURI = '') {
    return encodeAbiParameters(parseAbiParameters('string, string, string'), [description, imageURI, animationURI])
  }

  protected _generateHolographDropERC721InitCode(data: HolographDropERC721InitCodeV1Params) {
    const {
      contractType,
      enableOpenSeaRoyaltyRegistry,
      erc721TransferHelper,
      fundsRecipient,
      initialOwner,
      marketFilterAddress,
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions,
      royaltyBps,
      registryAddress,
      salesConfigArray,
    } = data

    const moeDataInitCode = encodeAbiParameters(DROP_INIT_CODE_ABI_PARAMETERS.V1, [
      [
        erc721TransferHelper,
        marketFilterAddress,
        initialOwner,
        fundsRecipient,
        numOfEditions,
        royaltyBps,
        enableOpenSeaRoyaltyRegistry,
        salesConfigArray,
        metadataRendererAddress,
        metadataRendererInitCode,
      ],
    ])

    return encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      contractType as Hex,
      registryAddress,
      moeDataInitCode,
    ])
  }

  protected _generateHolographERC721InitCode(data: HolographERC721InitCodeParams) {
    const {collectionName, collectionSymbol, royaltyBps, eventConfig, skipInit, holographDropERC721InitCode} = data
    return encodeAbiParameters(parseAbiParameters('string, string, uint16, uint256, bool, bytes'), [
      collectionName,
      collectionSymbol,
      royaltyBps,
      // @ts-ignore
      eventConfig,
      skipInit,
      holographDropERC721InitCode as Hex,
    ])
  }

  protected async _getInitialPayload(chainId = this.primaryChainId) {
    const registryAddress = await this._getRegistryAddress(chainId)
    const metadataRendererAddress = this._getMetadataRendererAddress(chainId)
    const salesConfig = {
      publicSalePrice: BigInt(this.publicSalePrice * Math.pow(10, 6)),
      maxSalePurchasePerAddress: this.maxSalePurchasePerAddress,
      publicSaleStart: parseISODateToTimestampSeconds(this.publicSaleStart),
      publicSaleEnd: parseISODateToTimestampSeconds(this.publicSaleEnd),
      presaleStart: parseISODateToTimestampSeconds(this.presaleStart),
      presaleEnd: parseISODateToTimestampSeconds(this.presaleEnd),
      presaleMerkleRoot: this.presaleMerkleRoot || '0x0000000000000000000000000000000000000000000000000000000000000000',
    }
    const salesConfigArray = Object.values(salesConfig)

    const imagePinataLink = this.nftIpfsUrl
    const imageCid = this.nftIpfsImageCid
    const imageFileName = imagePinataLink.split('/').at(-1)
    const metadataRendererInitCode = this._generateMetadataRendererInitCode(
      JSON.stringify(this.description).slice(1, -1),
      `ipfs://${imageCid}/${imageFileName}`,
    )
    const dropContractType = this._getDropContractType()

    return {dropContractType, metadataRendererAddress, metadataRendererInitCode, registryAddress, salesConfigArray}
  }

  @EnforceHydrateCheck()
  protected _getDropInitCode({
    account,
    metadataRendererAddress,
    metadataRendererInitCode,
    registryAddress,
    salesConfigArray,
  }: GetDropInitCodeParams): Hex {
    const dropContractType = this._getDropContractType()

    return this._generateHolographDropERC721InitCode({
      contractType: dropContractType,
      enableOpenSeaRoyaltyRegistry: false,
      erc721TransferHelper: '0x0000000000000000000000000000000000000000',
      fundsRecipient: account,
      initialOwner: account,
      marketFilterAddress: '0x0000000000000000000000000000000000000000',
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions: 0,
      registryAddress,
      royaltyBps: this.royaltiesBps,
      salesConfigArray,
    })
  }

  @EnforceHydrateCheck()
  protected async _getCollectionPayload(account: Address, chainId = this.primaryChainId) {
    if (!this.salt) this.setSalt(generateRandomSalt())
    const salt = this.salt
    const initialPayload = await this._getInitialPayload(chainId)
    const dropInitCode = this._getDropInitCode({...initialPayload, account})

    const initCode = this._generateHolographERC721InitCode({
      collectionName: JSON.stringify(this.name).slice(1, -1),
      collectionSymbol: JSON.stringify(this.symbol).slice(1, -1),
      royaltyBps: this.royaltiesBps,
      eventConfig: this._getEventConfig(),
      skipInit: false,
      holographDropERC721InitCode: dropInitCode,
    })

    const byteCode = bytecodes.HolographDropERC721
    const chainType = '0x' + evm2hlg(this.primaryChainId).toString(16).padStart(8, '0')
    const contractType = hexify('HolographERC721')

    const erc721Config = {
      contractType,
      chainType,
      byteCode,
      initCode,
      salt,
    }

    const configHash = getERC721DropDeploymentConfigHash(erc721Config, account)
    this.erc721ConfigHash = configHash

    const configHashBytes = hexToBytes(configHash)

    return {byteCode, chainType, configHash, configHashBytes, contractType, initCode, salt} //TODO: adjust return type to match CollectionLegacy._getCollectionPayload
  }

  protected async _estimateGasForDeployingCollection(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature, wallet} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.moeCollectionDeploy[chainId]

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
        wallet,
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

export class HolographMoeERC721DropV2 extends HolographMoeERC721DropV1 {
  constructor(
    {collectionInfo, nftInfo, primaryChainId, salesConfig}: CreateMoeCollection,
    configObject?: HolographConfig,
  ) {
    super({collectionInfo, nftInfo, primaryChainId, salesConfig}, configObject)
  }

  static hydrate({
    collectionInfo,
    nftInfo,
    salesConfig,
    chainId,
    address,
    txHash,
  }: HydrateMoeCollection): HolographMoeERC721DropV2 {
    const instance = new HolographMoeERC721DropV2({
      collectionInfo,
      nftInfo,
      salesConfig,
      primaryChainId: chainId,
    })

    instance.chainIds = [chainId]
    instance.collectionAddress = address
    instance.txHash = txHash
    instance._isHydrated = true

    if (!collectionInfo.salt) {
      instance._collectionInfo.salt = '0x0' as Hex
    }

    return instance
  }

  protected _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRenderer(getEnv().HOLOGRAPH_ENVIRONMENT, chainId)
  }

  protected _getDropContractType() {
    return hexify('HolographDropERC721V2')
  }

  protected _getEventConfig() {
    return enableDropEventsV2()
  }

  protected _generateHolographDropERC721InitCode(data: HolographDropERC721InitCodeV2Params) {
    const {
      contractType,
      fundsRecipient,
      initialOwner,
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions,
      royaltyBps,
      registryAddress,
      salesConfigArray,
    } = data

    const moeDataInitCode = encodeAbiParameters(DROP_INIT_CODE_ABI_PARAMETERS.V2, [
      [
        initialOwner,
        fundsRecipient,
        numOfEditions,
        royaltyBps,
        salesConfigArray,
        metadataRendererAddress,
        metadataRendererInitCode,
      ],
    ])

    return encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      contractType as Hex,
      registryAddress,
      moeDataInitCode,
    ])
  }

  @EnforceHydrateCheck()
  protected _getDropInitCode({
    account,
    metadataRendererAddress,
    metadataRendererInitCode,
    registryAddress,
    salesConfigArray,
  }: GetDropInitCodeParams): Hex {
    const dropContractType = this._getDropContractType()

    return this._generateHolographDropERC721InitCode({
      contractType: dropContractType,
      fundsRecipient: account,
      initialOwner: account,
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions: 0,
      registryAddress,
      royaltyBps: this.royaltiesBps,
      salesConfigArray,
    })
  }
}
