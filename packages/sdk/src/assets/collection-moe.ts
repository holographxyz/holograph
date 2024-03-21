import {Address, Hex, encodeAbiParameters, keccak256, parseAbiParameters, stringToHex, toBytes} from 'viem'
import {networks} from '@holographxyz/networks'

import {
  DROP_INIT_CODE_ABI_PARAMETERS,
  collectionInfoSchema,
  holographMoeSaleConfigSchema,
  nftInfoSchema,
  primaryChainIdSchema,
  validate,
} from './collection.validation'
import {getEnv} from '../config/env.validation'
import {Addresses} from '../constants/addresses'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Factory, Registry} from '../contracts'
import {Config, HolographWallet} from '../services'
import {
  destructSignature,
  enableDropEvents,
  enableDropEventsV2,
  generateRandomSalt,
  parseISODateToTimestampSeconds,
  strictECDSA,
} from '../utils/helpers'
import {remove0x} from '../utils/transformers'
import {
  CollectionInfo,
  CreateHolographMoe,
  GasFee,
  GetDropInitCodeParams,
  HolographConfig,
  HolographDropERC721InitCodeV1Params,
  HolographDropERC721InitCodeV2Params,
  HolographERC721InitCodeParamsSchema,
  HolographMoeSaleConfig,
  NftInfo,
  SignDeploy,
  Signature,
} from '../utils/types'

export class HolographMoeERC721DropV1 {
  collectionInfo: CollectionInfo
  nftInfo: NftInfo
  saleConfig: HolographMoeSaleConfig
  primaryChainId: number
  account?: Address
  chainIds?: number[]
  erc721ConfigHash?: Hex
  signature?: Signature
  txHash?: string

  private factory: Factory
  private registry: Registry

  constructor(
    configObject: HolographConfig,
    {collectionInfo, nftInfo, primaryChainId, saleConfig}: CreateHolographMoe,
  ) {
    this.collectionInfo = collectionInfoSchema.parse(collectionInfo)
    this.nftInfo = nftInfoSchema.parse(nftInfo)
    this.saleConfig = holographMoeSaleConfigSchema.parse(saleConfig)
    this.primaryChainId = primaryChainIdSchema.parse(primaryChainId)
    const config = Config.getInstance(configObject)
    const factory = new Factory(config)
    const registry = new Registry(config)
    this.factory = factory
    this.registry = registry
    this.chainIds = []
  }

  get name() {
    return this.collectionInfo.name
  }

  get description(): string | undefined {
    return this.collectionInfo.description
  }

  get symbol() {
    return this.collectionInfo.symbol
  }

  get tokenType() {
    return this.collectionInfo.tokenType
  }

  get royaltiesBps() {
    return this.collectionInfo.royaltiesBps
  }

  get salt() {
    return this.collectionInfo.salt
  }

  get publicSalePrice() {
    return this.saleConfig.publicSalePrice
  }

  get maxSalePurchasePerAddress() {
    return this.saleConfig.maxSalePurchasePerAddress
  }

  get publicSaleStart() {
    return this.saleConfig.publicSaleStart
  }

  get publicSaleEnd() {
    return this.saleConfig.publicSaleEnd
  }

  get presaleStart(): string | undefined {
    return this.saleConfig.presaleStart
  }

  get presaleEnd(): string | undefined {
    return this.saleConfig.presaleEnd
  }

  get presaleMerkleRoot(): string | undefined {
    return this.saleConfig.presaleMerkleRoot
  }

  get nftIpfsUrl() {
    return this.nftInfo.ipfsUrl
  }

  get nftIpfsImageCid() {
    return this.nftInfo.ipfsImageCid
  }

  set name(name: string) {
    validate.name.parse(name)
    this.collectionInfo.name = name
  }

  set description(description: string) {
    validate.description.parse(description)
    this.collectionInfo.description = description
  }

  set symbol(symbol: string) {
    validate.symbol.parse(symbol)
    this.collectionInfo.symbol = symbol
  }

  set tokenType(tokenType: CollectionInfo['tokenType']) {
    validate.tokenType.parse(tokenType)
    this.collectionInfo.tokenType = tokenType
  }

  set royaltiesBps(royalties: number) {
    validate.royaltiesBps.parse(royalties)
    this.collectionInfo.royaltiesBps = royalties
  }

  set salt(salt: Hex) {
    validate.salt.parse(salt)
    this.collectionInfo.salt = salt
  }

  set publicSalePrice(publicSalePrice: number) {
    validate.publicSalePrice.parse(publicSalePrice)
    this.saleConfig.publicSalePrice = publicSalePrice
  }

  set maxSalePurchasePerAddress(maxSalePurchasePerAddress: number) {
    validate.maxSalePurchasePerAddress.parse(maxSalePurchasePerAddress)
    this.saleConfig.maxSalePurchasePerAddress = maxSalePurchasePerAddress
  }

  set publicSaleStart(publicSaleStart: string) {
    validate.publicSaleStart.parse(publicSaleStart)
    this.saleConfig.publicSaleStart = publicSaleStart
  }

  set publicSaleEnd(publicSaleEnd: string) {
    validate.publicSaleEnd.parse(publicSaleEnd)
    this.saleConfig.publicSaleEnd = publicSaleEnd
  }

  set presaleStart(presaleStart: string) {
    validate.presaleStart.parse(presaleStart)
    this.saleConfig.presaleStart = presaleStart
  }

  set presaleEnd(presaleEnd: string) {
    validate.presaleEnd.parse(presaleEnd)
    this.saleConfig.presaleEnd = presaleEnd
  }

  set presaleMerkleRoot(presaleMerkleRoot: string) {
    validate.presaleMerkleRoot.parse(presaleMerkleRoot)
    this.saleConfig.presaleMerkleRoot = presaleMerkleRoot
  }

  set nftIpfsUrl(nftIpfsUrl: string) {
    validate.nftIpfsUrl.parse(nftIpfsUrl)
    this.nftInfo.ipfsUrl = nftIpfsUrl
  }

  set nftIpfsImageCid(nftIpfsImageCid: string) {
    validate.nftIpfsImageCid.parse(nftIpfsImageCid)
    this.nftInfo.ipfsImageCid = nftIpfsImageCid
  }

  getCollectionInfo() {
    return {...this.collectionInfo, ...this.nftInfo, ...this.saleConfig}
  }

  async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRendererV1()
  }

  _getDropContractType() {
    return '0x' + stringToHex('HolographDropERC721').substring(2).padStart(64, '0')
  }

  _getEventConfig() {
    return enableDropEvents()
  }

  _generateMetadataRendererInitCode(description: string, imageURI: string, animationURI = '') {
    return encodeAbiParameters(parseAbiParameters('string, string, string'), [description, imageURI, animationURI])
  }

  _generateHolographDropERC721InitCode(data: HolographDropERC721InitCodeV1Params) {
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

  _generateHolographERC721InitCode(data: HolographERC721InitCodeParamsSchema) {
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

  async _getInitialPayload(chainId = this.primaryChainId) {
    const registryAddress = await this._getRegistryAddress(chainId)
    const metadataRendererAddress = this._getMetadataRendererAddress(chainId)
    const saleConfig = {
      publicSalePrice: this.publicSalePrice * Math.pow(10, 6), // In USD
      maxSalePurchasePerAddress: this.maxSalePurchasePerAddress,
      publicSaleStart: parseISODateToTimestampSeconds(this.publicSaleStart),
      publicSaleEnd: parseISODateToTimestampSeconds(this.publicSaleEnd),
      presaleStart: 0, // No presale
      presaleEnd: 0, // No presale
      presaleMerkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000', // No presale
    }

    const salesConfigArray = Object.values(saleConfig)
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

  _getDropInitCode({
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

  async _getCollectionPayload(account: Address, chainId = this.primaryChainId) {
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

    const networkKey = Object.keys(networks).find(network => networks[network].chain === chainId)
    const byteCode = bytecodes.HolographDropERC721
    const chainType = '0x' + networks[networkKey!].holographId.toString(16).padStart(8, '0')
    const contractType = ('0x' + stringToHex('HolographERC721').slice(2).padStart(64, '0')) as Hex
    const salt = this.salt || generateRandomSalt()
    const configHash = keccak256(
      ('0x' +
        remove0x(contractType) +
        remove0x(chainType) +
        remove0x(salt) +
        remove0x(keccak256(byteCode)) +
        remove0x(keccak256(initCode)) +
        remove0x(account)) as Hex,
    )
    const configHashBytes = toBytes(configHash)

    return {byteCode, chainType, configHash, configHashBytes, contractType, initCode, salt}
  }

  async _estimateGasForDeployingCollection(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.moeCollectionDeploy[chainId]

    if (gasController?.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice!)
    } else {
      gasPrice = await this.factory.getGasPrice(chainId)
    }

    if (gasController?.gasLimit) {
      gasLimit = BigInt(gasController.gasLimit)
    } else {
      gasLimit = await this.factory.estimateContractFunctionGas({
        args: [config, signature, account],
        chainId,
        functionName: 'deployHolographableContract',
      })
    }

    if (gasController?.gasLimitMultiplier) {
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    const gas = BigInt(gasPrice) * BigInt(gasLimit)

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  /**
   * @param holographWallet - The HolographWallet instance to sign the deploy.
   * @param chainId - The chainId to sign the deploy. It's optional and defaults to the primaryChainId.
   * @returns - The signature data with the config and signature to deploy the collection contract.
   */
  async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account, chainId)

    const {configHash, configHashBytes, ...config} = collectionPayload

    const signedMessage = await holographWallet.onChain(chainId).signMessage({
      account: holographWallet.account,
      message: configHash,
    })
    const signature = strictECDSA(destructSignature(signedMessage))
    const parsedSignature = {...signature, v: String(Number.parseInt(String(signature.v), 16)) as Hex}
    this.signature = parsedSignature

    return {
      account,
      chainId,
      config,
      signature: parsedSignature,
    }
  }

  /**
   * @param signatureData - The signature data returned from signDeploy function.
   * @returns - A transaction hash.
   */
  async deploy(signatureData: SignDeploy): Promise<unknown> {
    const {account, chainId, config, signature} = signatureData
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingCollection(signatureData, chainId)
    const txHash = await this.factory.deployHolographableContract(chainId!, config, signature, account, undefined, {
      gasPrice,
      gas: gasLimit,
    })

    this.chainIds?.push(chainId!)
    this.txHash = String(txHash)
    return txHash
  }

  // TODO: Do later
  deployBatch() {}
}

export class HolographMoeERC721DropV2 extends HolographMoeERC721DropV1 {
  constructor(
    configObject: HolographConfig,
    {collectionInfo, nftInfo, primaryChainId, saleConfig}: CreateHolographMoe,
  ) {
    super(configObject, {collectionInfo, nftInfo, primaryChainId, saleConfig})
  }

  _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRenderer(getEnv().HOLOGRAPH_ENVIRONMENT, chainId)
  }

  _getDropContractType() {
    return '0x' + stringToHex('HolographDropERC721V2').substring(2).padStart(64, '0')
  }

  _getEventConfig() {
    return enableDropEventsV2()
  }

  _generateHolographDropERC721InitCode(data: HolographDropERC721InitCodeV2Params) {
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

  _getDropInitCode({
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
