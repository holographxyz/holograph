import {Address, Hex, encodeAbiParameters, hexToBytes, parseAbiParameters} from 'viem'

import {
  CreateHolographOpenEditionERC721Contract,
  ContractInfo,
  HolographERC721InitCodeParams,
  HolographOpenEditionERC721InitCodeV2Params,
  HolographOpenEditionERC721InitCodeV1Params,
  HydrateHolographOpenEditionERC721Contract,
  NFTInfo,
  OpenEditionContractInfo,
  OpenEditionSalesConfig,
  OPEN_EDITION_INIT_CODE_ABI_PARAMETERS,
  validate,
} from './contract.validation'
import {getEnv} from '../config/env.validation'
import {Addresses} from '../constants/addresses'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {FactoryContract, RegistryContract} from '../contracts'
import {HolographWallet} from '../services'
import {decodeBridgeableContractDeployedEvent} from '../utils/decoders'
import {EnforceHydrateCheck, IsNotDeployed} from '../utils/decorators'
import {getERC721OpenEditionDeploymentConfigHash} from '../utils/encoders'
import {
  destructSignature,
  enableOpenEditionEventsV1,
  enableOpenEditionEventsV2,
  generateRandomSalt,
  hexify,
  parseISODateToTimestampSeconds,
  strictECDSA,
} from '../utils/helpers'
import {evm2hlg} from '../utils/transformers'
import {GasFee, GetOpenEditionInitCodeParams, SignDeploy, Signature, WriteContractOptions} from '../utils/types'

export class HolographOpenEditionERC721ContractV1 {
  protected _isHydrated = false
  protected _contractInfo: ContractInfo
  public nftInfo: NFTInfo
  public salesConfig: OpenEditionSalesConfig
  public primaryChainId: number
  public account?: Address
  public chainIds?: number[]
  public contractAddress?: Address
  public erc721ConfigHash?: Hex
  public signature?: Signature
  public txHash?: string

  private factory: FactoryContract
  private registry: RegistryContract

  constructor({contractInfo, nftInfo, primaryChainId, salesConfig}: CreateHolographOpenEditionERC721Contract) {
    this._contractInfo = validate.contractInfo.parse(contractInfo)
    this.salesConfig = validate.salesConfig.parse(salesConfig)
    this.primaryChainId = validate.primaryChainId.parse(primaryChainId)
    this.nftInfo = validate.nftInfo
      .refine(nftInfo => nftInfo.ipfsUrl.includes(nftInfo.ipfsImageCid), {
        message: 'The IPFS URL must reference the same image CID',
      })
      .parse(nftInfo)

    this.factory = new FactoryContract()
    this.registry = new RegistryContract()
    this.chainIds = []
  }

  static hydrate({
    contractInfo,
    nftInfo,
    salesConfig,
    chainId,
    address,
    txHash,
  }: HydrateHolographOpenEditionERC721Contract): HolographOpenEditionERC721ContractV1 {
    const instance = new HolographOpenEditionERC721ContractV1({
      contractInfo,
      nftInfo,
      salesConfig,
      primaryChainId: chainId,
    })

    instance.chainIds = [chainId]
    instance.contractAddress = address
    instance.txHash = txHash
    instance._isHydrated = true

    if (!contractInfo.salt) {
      instance._contractInfo.salt = '0x0' as Hex
    }

    return instance
  }

  get name() {
    return this._contractInfo.name
  }

  get description(): string | undefined {
    return this._contractInfo.description
  }

  get symbol() {
    return this._contractInfo.symbol
  }

  get royaltiesPercentage() {
    return this._contractInfo.royaltiesPercentage
  }

  get salt() {
    return this._contractInfo.salt
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

  public getContractInfo(): OpenEditionContractInfo {
    return {...this._contractInfo, ...this.nftInfo, ...this.salesConfig}
  }

  @IsNotDeployed()
  public setName(name: string) {
    validate.name.parse(name)
    this._contractInfo.name = name
  }

  @IsNotDeployed()
  public setDescription(description: string) {
    validate.description.parse(description)
    this._contractInfo.description = description
  }

  @IsNotDeployed()
  public setSymbol(symbol: string) {
    validate.symbol.parse(symbol)
    this._contractInfo.symbol = symbol
  }

  @IsNotDeployed()
  public setRoyaltiesPercentage(royalties: number) {
    validate.royaltiesPercentage.parse(royalties)
    this._contractInfo.royaltiesPercentage = royalties
  }

  @IsNotDeployed()
  public setSalt(salt: Hex) {
    validate.salt.parse(salt)
    this._contractInfo.salt = salt
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
   * @returns - The signature data with the config and signature to deploy the contract contract.
   */
  @EnforceHydrateCheck()
  public async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const contractPayload = await this._getContractPayload(account, chainId)

    const {configHash, configHashBytes, ...config} = contractPayload

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
    contractAddress: Address
    txHash: Hex
  }> {
    const {account, chainId, config, signature, wallet} = signatureData
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingContract(signatureData, chainId)
    const txHash = (await this.factory.deployHolographableContract(chainId!, config, signature, account, wallet, {
      ...options,
      gasPrice,
      gas: gasLimit,
    })) as Hex

    const client = await this.factory.getClientByChainId(chainId!)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const contractAddress = decodeBridgeableContractDeployedEvent(receipt)?.[0]?.values?.[0]

    this.contractAddress = contractAddress
    this.chainIds?.push(chainId!)
    this.txHash = txHash

    return {
      contractAddress,
      txHash,
    }
  }

  protected async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  protected _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRendererV1()
  }

  protected _getOpenEditionContractType() {
    return hexify('HolographDropERC721')
  }

  protected _getEventConfig() {
    return enableOpenEditionEventsV1()
  }

  protected _generateMetadataRendererInitCode(description: string, imageURI: string, animationURI = '') {
    return encodeAbiParameters(parseAbiParameters('string, string, string'), [description, imageURI, animationURI])
  }

  protected _generateHolographOpenEditionERC721InitCode(data: HolographOpenEditionERC721InitCodeV1Params) {
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
      royaltiesPercentage,
      registryAddress,
      salesConfigArray,
    } = data

    const openEditionDataInitCode = encodeAbiParameters(OPEN_EDITION_INIT_CODE_ABI_PARAMETERS.V1, [
      [
        erc721TransferHelper,
        marketFilterAddress,
        initialOwner,
        fundsRecipient,
        numOfEditions,
        royaltiesPercentage,
        enableOpenSeaRoyaltyRegistry,
        salesConfigArray,
        metadataRendererAddress,
        metadataRendererInitCode,
      ],
    ])

    return encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      contractType as Hex,
      registryAddress,
      openEditionDataInitCode,
    ])
  }

  protected _generateHolographERC721InitCode(data: HolographERC721InitCodeParams) {
    const {
      contractName,
      contractSymbol,
      royaltiesPercentage,
      eventConfig,
      skipInit,
      holographOpenEditionERC721InitCode,
    } = data
    return encodeAbiParameters(parseAbiParameters('string, string, uint16, uint256, bool, bytes'), [
      contractName,
      contractSymbol,
      royaltiesPercentage,
      // @ts-ignore
      eventConfig,
      skipInit,
      holographOpenEditionERC721InitCode as Hex,
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
    const openEditionContractType = this._getOpenEditionContractType()

    return {
      openEditionContractType,
      metadataRendererAddress,
      metadataRendererInitCode,
      registryAddress,
      salesConfigArray,
    }
  }

  @EnforceHydrateCheck()
  protected _getOpenEditionInitCode({
    account,
    metadataRendererAddress,
    metadataRendererInitCode,
    registryAddress,
    salesConfigArray,
  }: GetOpenEditionInitCodeParams): Hex {
    const openEditionContractType = this._getOpenEditionContractType()

    return this._generateHolographOpenEditionERC721InitCode({
      contractType: openEditionContractType,
      enableOpenSeaRoyaltyRegistry: false,
      erc721TransferHelper: '0x0000000000000000000000000000000000000000',
      fundsRecipient: account,
      initialOwner: account,
      marketFilterAddress: '0x0000000000000000000000000000000000000000',
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions: 0,
      registryAddress,
      royaltiesPercentage: this.royaltiesPercentage,
      salesConfigArray,
    })
  }

  @EnforceHydrateCheck()
  protected async _getContractPayload(account: Address, chainId = this.primaryChainId) {
    if (!this.salt) this.setSalt(generateRandomSalt())
    const salt = this.salt
    const initialPayload = await this._getInitialPayload(chainId)
    const openEditionInitCode = this._getOpenEditionInitCode({...initialPayload, account})

    const initCode = this._generateHolographERC721InitCode({
      contractName: JSON.stringify(this.name).slice(1, -1),
      contractSymbol: JSON.stringify(this.symbol).slice(1, -1),
      royaltiesPercentage: this.royaltiesPercentage,
      eventConfig: this._getEventConfig(),
      skipInit: false,
      holographOpenEditionERC721InitCode: openEditionInitCode,
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

    const configHash = getERC721OpenEditionDeploymentConfigHash(erc721Config, account)
    this.erc721ConfigHash = configHash

    const configHashBytes = hexToBytes(configHash)

    return {byteCode, chainType, configHash, configHashBytes, contractType, initCode, salt}
  }

  protected async _estimateGasForDeployingContract(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature, wallet} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.openEditionContractDeployment[chainId]

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

export class HolographOpenEditionERC721ContractV2 extends HolographOpenEditionERC721ContractV1 {
  constructor({contractInfo, nftInfo, primaryChainId, salesConfig}: CreateHolographOpenEditionERC721Contract) {
    super({contractInfo, nftInfo, primaryChainId, salesConfig})
  }

  static hydrate({
    contractInfo,
    nftInfo,
    salesConfig,
    chainId,
    address,
    txHash,
  }: HydrateHolographOpenEditionERC721Contract): HolographOpenEditionERC721ContractV2 {
    const instance = new HolographOpenEditionERC721ContractV2({
      contractInfo,
      nftInfo,
      salesConfig,
      primaryChainId: chainId,
    })

    instance.chainIds = [chainId]
    instance.contractAddress = address
    instance.txHash = txHash
    instance._isHydrated = true

    if (!contractInfo.salt) {
      instance._contractInfo.salt = '0x0' as Hex
    }

    return instance
  }

  protected _getMetadataRendererAddress(chainId = this.primaryChainId) {
    return Addresses.editionsMetadataRenderer(getEnv().HOLOGRAPH_ENVIRONMENT, chainId)
  }

  protected _getOpenEditionContractType() {
    return hexify('HolographDropERC721V2')
  }

  protected _getEventConfig() {
    return enableOpenEditionEventsV2()
  }

  protected _generateHolographOpenEditionERC721InitCode(data: HolographOpenEditionERC721InitCodeV2Params) {
    const {
      contractType,
      fundsRecipient,
      initialOwner,
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions,
      royaltiesPercentage,
      registryAddress,
      salesConfigArray,
    } = data

    const openEditionDataInitCode = encodeAbiParameters(OPEN_EDITION_INIT_CODE_ABI_PARAMETERS.V2, [
      [
        initialOwner,
        fundsRecipient,
        numOfEditions,
        royaltiesPercentage,
        salesConfigArray,
        metadataRendererAddress,
        metadataRendererInitCode,
      ],
    ])

    return encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      contractType as Hex,
      registryAddress,
      openEditionDataInitCode,
    ])
  }

  @EnforceHydrateCheck()
  protected _getOpenEditionInitCode({
    account,
    metadataRendererAddress,
    metadataRendererInitCode,
    registryAddress,
    salesConfigArray,
  }: GetOpenEditionInitCodeParams): Hex {
    const openEditionContractType = this._getOpenEditionContractType()

    return this._generateHolographOpenEditionERC721InitCode({
      contractType: openEditionContractType,
      fundsRecipient: account,
      initialOwner: account,
      metadataRendererAddress,
      metadataRendererInitCode,
      numOfEditions: 0,
      registryAddress,
      royaltiesPercentage: this.royaltiesPercentage,
      salesConfigArray,
    })
  }
}
