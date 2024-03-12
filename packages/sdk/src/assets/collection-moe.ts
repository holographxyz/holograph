import {Address, Hex, encodeAbiParameters, keccak256, parseAbiParameters, stringToHex, toBytes} from 'viem'
import {networks} from '@holographxyz/networks'

import {collectionInfoSchema, holographMoeSaleConfigSchema, nftInfoSchema, validate} from './collection.validation'
import {getEnv} from '../config/env.validation'
import {Addresses} from '../constants/addresses'
import {bytecodes} from '../constants/bytecodes'
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
import {
  CollectionInfo,
  CreateHolographMoe,
  HolographConfig,
  HolographDropERC721InitCodeV1Params,
  HolographDropERC721InitCodeV2Params,
  HolographERC721InitCodeParamsSchema,
  HolographMoeSaleConfig,
  HolographVersion,
  NftInfo,
  SignDeploy,
  Signature,
} from '../utils/types'
import {remove0x} from '../utils/transformers'

export class HolographMoeERC721DropV1 {
  collectionInfo: CollectionInfo
  nftInfo: NftInfo
  saleConfig: HolographMoeSaleConfig
  primaryChainId: number
  account?: Address
  chainIds?: number[]
  erc721ConfigHash?: Hex
  predictedCollectionAddress?: Address
  signature?: Signature

  private factory: Factory
  private registry: Registry

  constructor(
    configObject: HolographConfig,
    {collectionInfo, nftInfo, primaryChainId, saleConfig}: CreateHolographMoe,
  ) {
    this.collectionInfo = collectionInfoSchema.parse(collectionInfo)
    this.nftInfo = nftInfoSchema.parse(nftInfo)
    this.saleConfig = holographMoeSaleConfigSchema.parse(saleConfig)
    const config = Config.getInstance(configObject)
    const factory = new Factory(config)
    const registry = new Registry(config)
    this.factory = factory
    this.registry = registry
    this.primaryChainId = primaryChainId
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

  // TODO: Make all _* methods private after setting up all tests
  async _getRegistryAddress() {
    const registryAddress = await this.registry.getAddress(this.primaryChainId)
    return registryAddress
  }

  _getMetadataRendererAddress(version: HolographVersion) {
    const isV2 = version === HolographVersion.V2
    if (isV2) {
      return Addresses.editionsMetadataRenderer(getEnv().HOLOGRAPH_ENVIRONMENT, this.primaryChainId)
    }
    return Addresses.editionsMetadataRendererV1()
  }

  _generateMetadataRendererInitCode(description: string, imageURI: string, animationURI: string) {
    return encodeAbiParameters(parseAbiParameters('string, string, string'), [description, imageURI, animationURI])
  }

  _generateHolographDropERC721InitCodeV1(data: HolographDropERC721InitCodeV1Params) {
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

    const moeDataInitCode = encodeAbiParameters(
      parseAbiParameters(
        'tuple(address,address,address,address,uint64,uint16,bool,tuple(uint104,uint32,uint64,uint64,uint64,uint64,bytes32),address,bytes)',
      ),
      [
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
      ],
    )

    return encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      contractType as Hex,
      registryAddress,
      moeDataInitCode,
    ])
  }

  _generateHolographDropERC721InitCodeV2(data: HolographDropERC721InitCodeV2Params) {
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

    const moeDataInitCode = encodeAbiParameters(
      parseAbiParameters(
        'tuple(address,address,uint64,uint16,tuple(uint104,uint32,uint64,uint64,uint64,uint64,bytes32),address,bytes)',
      ),
      [
        [
          initialOwner,
          fundsRecipient,
          numOfEditions,
          royaltyBps,
          salesConfigArray,
          metadataRendererAddress,
          metadataRendererInitCode,
        ],
      ],
    )

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

  async _getCollectionPayload(account: Address, version: HolographVersion) {
    const contractType = ('0x' + stringToHex('HolographERC721').slice(2).padStart(64, '0')) as Hex
    const isV2 = version === HolographVersion.V2
    const dropVersion = isV2 ? 'HolographDropERC721V2' : 'HolographDropERC721'
    const dropContractType = '0x' + stringToHex(dropVersion).substring(2).padStart(64, '0')
    const registryAddress = await this._getRegistryAddress()
    const metadataRendererAddress = this._getMetadataRendererAddress(version)
    const numOfEditions = 0

    const saleConfig = {
      publicSalePrice: this.publicSalePrice * Math.pow(10, 6), // in USD
      maxSalePurchasePerAddress: this.maxSalePurchasePerAddress,
      publicSaleStart: parseISODateToTimestampSeconds(this.publicSaleStart),
      publicSaleEnd: parseISODateToTimestampSeconds(this.publicSaleEnd),
      presaleStart: 0, // no presale
      presaleEnd: 0, // no presale
      presaleMerkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000', // No presale
    }
    const salesConfigArray = Object.values(saleConfig)

    const imagePinataLink = this.nftIpfsUrl
    const imageCid = this.nftIpfsImageCid
    const imageFileName = imagePinataLink.split('/').at(-1)
    const metadataRendererInitCode = this._generateMetadataRendererInitCode(
      JSON.stringify(this.description).slice(1, -1),
      `ipfs://${imageCid}/${imageFileName}`,
      '',
    )

    const dropInitCode = isV2
      ? this._generateHolographDropERC721InitCodeV2({
          contractType: dropContractType,
          registryAddress,
          initialOwner: account,
          fundsRecipient: account,
          metadataRendererAddress,
          metadataRendererInitCode,
          numOfEditions,
          royaltyBps: this.royaltiesBps,
          salesConfigArray,
        })
      : this._generateHolographDropERC721InitCodeV1({
          contractType: dropContractType,
          registryAddress,
          erc721TransferHelper: '0x0000000000000000000000000000000000000000',
          marketFilterAddress: '0x0000000000000000000000000000000000000000',
          initialOwner: account,
          fundsRecipient: account,
          numOfEditions,
          royaltyBps: this.royaltiesBps,
          enableOpenSeaRoyaltyRegistry: false,
          salesConfigArray,
          metadataRendererAddress,
          metadataRendererInitCode,
        })

    const initCode = this._generateHolographERC721InitCode({
      collectionName: JSON.stringify(this.name).slice(1, -1),
      collectionSymbol: JSON.stringify(this.symbol).slice(1, -1),
      royaltyBps: this.royaltiesBps,
      eventConfig: isV2 ? enableDropEventsV2() : enableDropEvents(),
      skipInit: false,
      holographDropERC721InitCode: dropInitCode,
    })

    const networkKey = Object.keys(networks).find(network => networks[network].chain === this.primaryChainId)
    const chainType = '0x' + networks[networkKey!].holographId.toString(16).padStart(8, '0')
    const salt = this.salt || generateRandomSalt()
    const byteCode = bytecodes.HolographDropERC721
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

    return {configHash, configHashBytes, contractType, salt, byteCode, chainType, initCode}
  }

  _getCollectionPayloadWithVersion(account: Address) {
    return this._getCollectionPayload(account, HolographVersion.V1)
  }

  async signDeploy(holographWallet: HolographWallet): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayloadWithVersion(account)

    const {configHash, configHashBytes, ...config} = collectionPayload

    const signedMessage = await holographWallet.onChain(this.primaryChainId).signMessage({
      account: holographWallet.account,
      message: configHash,
    })
    const signature = strictECDSA(destructSignature(signedMessage))
    const parsedSignature = {...signature, v: String(Number.parseInt(String(signature.v), 16)) as Hex}
    this.signature = parsedSignature

    return {
      account,
      config,
      signature: parsedSignature,
    }
  }

  async deploy(data: SignDeploy): Promise<unknown> {
    const {account, config, signature} = data
    // const { gasLimit, gasPrice } = await this.estimateGasForDeployingCollection(data)
    const tx = await this.factory.deployHolographableContract(this.primaryChainId, config, signature, account)
    return tx
  }

  // TODO: Do later
  async estimateGasForDeployingCollection(data: SignDeploy) {
    const holographFactory = this.factory
    const chainId = this.primaryChainId
    let gasLimit, gasPrice

    // if (GAS_CONTROLLER.moeCollectionDeploy[chainId]?.gasPrice) {
    //   gasPrice = BigInt(GAS_CONTROLLER.moeCollectionDeploy[chainId].gasPrice)
    // } else {
    //   gasPrice = await this.getChainGasPrice()
    // }

    // if (GAS_CONTROLLER.moeCollectionDeploy[chainId]?.gasLimit) {
    //   gasLimit = BigInt(GAS_CONTROLLER.moeCollectionDeploy[chainId].gasLimit)
    // } else {
    //   gasLimit = await holographFactory.estimateGas.deployHolographableContract(erc721Config, signature, account)
    // }

    // if (GAS_CONTROLLER.moeCollectionDeploy[chainId]?.gasLimitMultiplier) {
    //   gasLimit = (BigInt(gasLimit) * GAS_CONTROLLER.moeCollectionDeploy[chainId].gasLimitMultiplier!) / 100
    // }

    // if (GAS_CONTROLLER.moeCollectionDeploy[chainId]?.gasPriceMultiplier) {
    //   gasPrice = (BigInt(gasPrice) * GAS_CONTROLLER.moeCollectionDeploy[chainId].gasPriceMultiplier!) / 100
    // }

    return {
      gasPrice,
      gasLimit,
      gas: gasPrice.mul(gasLimit),
    }
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

  __getCollectionPayloadWithVersion(account: Address) {
    return this._getCollectionPayload(account, HolographVersion.V2)
  }
}
