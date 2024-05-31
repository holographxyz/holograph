import {Address, Hex, numberToHex, pad, toHex} from 'viem'

import {HolographLegacyCollection} from './collection-legacy'
import {HolographMoeERC721DropV1, HolographMoeERC721DropV2} from './collection-moe'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {CxipERC721} from '../contracts'
import {NotMintedNFTError} from '../errors/assets/not-minted-nft.error'
import {CreateNFT, DEFAULT_TOKEN_URI, HolographNFTMetadata, NFTIpfsInfo, validate} from './nft.validation'
import {Config} from '../services'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {IsNotMinted} from '../utils/decorators'
import {MintConfig, TokenUriType, WriteContractOptions} from '../utils/types'

export class NFT {
  public collection: HolographLegacyCollection | HolographMoeERC721DropV1 | HolographMoeERC721DropV2
  public isMinted: boolean
  public metadata: HolographNFTMetadata
  public txHash?: string

  protected ipfsInfo?: NFTIpfsInfo
  protected _tokenId?: string // Decimal tokenId string

  private cxipERC721: CxipERC721

  constructor({collection, ipfsInfo, metadata}: CreateNFT) {
    this.metadata = validate.metadata.parse(metadata)
    this.ipfsInfo = validate.ipfsInfo.parse(ipfsInfo)
    this.collection = validate.collection.parse(collection)

    const config = Config.getInstance(collection.holographConfig)
    this.cxipERC721 = new CxipERC721(collection.collectionAddress!, config)
    this.isMinted = false
  }

  get name() {
    return this.metadata.name
  }

  get description() {
    return this.metadata.description
  }

  get creator() {
    return this.metadata.creator
  }

  // AKA the NFT traits
  get attributes() {
    return this.metadata.attributes
  }

  get ipfsImageCid() {
    return this.ipfsInfo?.ipfsImageCid!
  }

  get ipfsMetadataCid() {
    return this.ipfsInfo?.ipfsMetadataCid!
  }

  get ipfsUrl() {
    return this.ipfsInfo?.ipfsUrl!
  }

  get tokenId() {
    if (!this._tokenId) throw new NotMintedNFTError('tokenId')

    return this._tokenId
  }

  public getParsedTokenId() {
    if (!this._tokenId) throw new NotMintedNFTError(this.getParsedTokenId.name)

    const tokenIdHex = numberToHex(BigInt(this._tokenId), {size: 32})
    const chainIdHex = tokenIdHex.slice(0, 10)
    const tokenNumberHex = tokenIdHex.slice(10)

    return {
      decimal: this._tokenId,
      hex: tokenIdHex,
      part: {
        chainId: parseInt(chainIdHex, 16).toString(),
        tokenNumber: parseInt(tokenNumberHex, 16).toString(),
      },
    }
  }

  @IsNotMinted()
  public setMetadata(metadata: HolographNFTMetadata) {
    validate.metadata.parse(metadata)
    this.metadata = metadata
  }

  @IsNotMinted()
  public setName(name: string) {
    validate.name.parse(name)
    this.metadata.name = name
  }

  @IsNotMinted()
  public setDescription(description: string) {
    validate.description.parse(description)
    this.metadata.description = description
  }

  @IsNotMinted()
  public setCreator(creator: string) {
    validate.creator.parse(creator)
    this.metadata.creator = creator
  }

  @IsNotMinted()
  public setAttributes(attributes: HolographNFTMetadata['attributes']) {
    validate.attributes.parse(attributes)
    this.metadata.attributes = attributes
  }

  @IsNotMinted()
  public setIpfsImageCid(ipfsImageCid: string) {
    validate.ipfsImageCid.parse(ipfsImageCid)
    this.ipfsInfo!.ipfsImageCid = ipfsImageCid
  }

  @IsNotMinted()
  public setIpfsMetadataCid(ipfsMetadataCid: string) {
    validate.ipfsMetadataCid.parse(ipfsMetadataCid)
    this.ipfsInfo!.ipfsMetadataCid = ipfsMetadataCid
  }

  @IsNotMinted()
  public setIpfsUrl(ipfsUrl: string) {
    validate.ipfsUrl.parse(ipfsUrl)
    this.ipfsInfo!.ipfsUrl = ipfsUrl
  }

  public async mint({chainId, wallet}: MintConfig, options?: WriteContractOptions) {
    const client = await this.cxipERC721.getClientByChainId(chainId)
    const {gasLimit, gasPrice} = await this._estimateGasForMintingNFT({chainId, wallet})

    const txHash = (await this.cxipERC721.cxipMint(chainId, 0, TokenUriType.IPFS, this.ipfsMetadataCid!, wallet, {
      ...options,
      gas: gasLimit,
      gasPrice,
    })) as Hex

    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collection.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})

    this._tokenId = tokenIdBytesString
    this.txHash = txHash
    this.isMinted = true

    return {
      tokenId: tokenIdBytesString,
      txHash,
    }
  }

  public async tokenIdExists(tokenId: string, chainId: number): Promise<boolean> {
    const exists = await this.cxipERC721.exists(chainId, tokenId)
    return exists === 'true'
  }

  public async getOwner(tokenId: string, chainId: number) {
    const tokenId_ = tokenId || this._tokenId!
    if (!tokenId) throw new NotMintedNFTError(this.getOwner.name)
    const owner = (await this.cxipERC721.ownerOf(chainId, tokenId_)) as Address
    return owner
  }

  public async isOwner(account: Address, tokenId: string, chainId: number): Promise<boolean> {
    const owner = await this.cxipERC721.ownerOf(chainId, tokenId)
    return String(owner)?.toLowerCase() === String(account)?.toLowerCase()
  }

  protected async _estimateGasForMintingNFT({chainId, wallet}: MintConfig) {
    let gasPrice: bigint, gasLimit: bigint
    const gasController = GAS_CONTROLLER.nftMint[chainId]

    if (gasController.gasPrice) {
      gasPrice = gasController.gasPrice
    } else {
      gasPrice = await this.cxipERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (gasPrice * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = gasController.gasLimit
    } else {
      gasLimit = await this.cxipERC721.estimateContractFunctionGas({
        args: [0, TokenUriType.IPFS, this.ipfsMetadataCid || DEFAULT_TOKEN_URI],
        chainId,
        functionName: 'cxipMint',
        wallet,
      })
    }

    if (gasController.gasLimitMultiplier) {
      gasLimit = (gasLimit * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    const gas = gasPrice * gasLimit

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  // TODO: Functions below are used for easy testing while in development. Remove before public release.
  setTokenId(tokenId: string) {
    validate.tokenId.parse(tokenId)
    this._tokenId = tokenId
  }

  toggleIsMinted() {
    this.isMinted = !this.isMinted
  }
}
