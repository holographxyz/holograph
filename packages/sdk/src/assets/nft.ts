import {Address, Hex, numberToHex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {CxipERC721} from '../contracts'
import {NotMintedNftError} from '../errors/assets/not-minted-nft.error'
import {CreateNft, DEFAULT_TOKEN_URI, HolographNFTMetadata, NftIpfsInfo, validate} from './nft.validation'
import {Config} from '../services'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {IsNotMinted} from '../utils/decorators'
import {HolographConfig, MintConfig, TokenUriType} from '../utils/types'

export class NFT {
  isMinted: boolean
  metadata: HolographNFTMetadata
  protected collectionAddress?: Address
  protected ipfsInfo?: NftIpfsInfo
  protected tokenId?: string // Decimal tokenId string
  protected txHash?: string

  private cxipERC721: CxipERC721

  constructor(configObject: HolographConfig, {collectionAddress, ipfsInfo, metadata}: CreateNft) {
    this.collectionAddress = validate.collectionAddress.parse(collectionAddress) as Address
    this.metadata = validate.metadata.parse(metadata)
    this.ipfsInfo = validate.ipfsInfo.parse(ipfsInfo)
    const config = Config.getInstance(configObject)
    const cxipERC721 = new CxipERC721(config, this.collectionAddress)
    this.cxipERC721 = cxipERC721
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

  get ipfsUrl() {
    return this.ipfsInfo?.ipfsUrl
  }

  get ipfsImageCid() {
    return this.ipfsInfo?.ipfsImageCid
  }

  getParsedTokenId() {
    if (!this.tokenId) throw new NotMintedNftError(this.getParsedTokenId.name)
    const tokenIdHex = numberToHex(BigInt(this.tokenId), {size: 32})
    const chainIdHex = tokenIdHex.slice(0, 10)
    const tokenNumberHex = tokenIdHex.slice(10)

    return {
      decimal: this.tokenId,
      hex: tokenIdHex,
      part: {
        chainId: parseInt(chainIdHex, 16).toString(),
        tokenNumber: parseInt(tokenNumberHex, 16).toString(),
      },
    }
  }

  @IsNotMinted()
  setMetadata(metadata: HolographNFTMetadata) {
    validate.metadata.parse(metadata)
    this.metadata = metadata
  }

  @IsNotMinted()
  setName(name: string) {
    validate.name.parse(name)
    this.metadata.name = name
  }

  @IsNotMinted()
  setDescription(description: string) {
    validate.description.parse(description)
    this.metadata.description = description
  }

  @IsNotMinted()
  setCreator(creator: string) {
    validate.creator.parse(creator)
    this.metadata.creator = creator
  }

  @IsNotMinted()
  setAttributes(attributes: HolographNFTMetadata['attributes']) {
    validate.attributes.parse(attributes)
    this.metadata.attributes = attributes
  }

  @IsNotMinted()
  setIpfsUrl(ipfsUrl: string) {
    validate.ipfsUrl.parse(ipfsUrl)
    this.ipfsInfo!.ipfsUrl = ipfsUrl
  }

  @IsNotMinted()
  setIpfsImageCid(ipfsImageCid: string) {
    validate.ipfsImageCid.parse(ipfsImageCid)
    this.ipfsInfo!.ipfsImageCid = ipfsImageCid
  }

  async _estimateGasForMintingNft({chainId, tokenUri}: MintConfig) {
    let gasPrice: bigint, gasLimit: bigint
    const gasController = GAS_CONTROLLER.nftMint[chainId]

    if (gasController.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice)
    } else {
      gasPrice = await this.cxipERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = BigInt(gasController.gasLimit)
    } else {
      gasLimit = await this.cxipERC721.estimateContractFunctionGas({
        args: [0, TokenUriType.IPFS, tokenUri || DEFAULT_TOKEN_URI],
        chainId,
        functionName: 'cxipMint',
      })
    }

    if (gasController.gasLimitMultiplier) {
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    const gas = gasPrice * gasLimit

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  async mint({chainId, tokenUri}: MintConfig) {
    validate.tokenUri.parse(tokenUri)

    const client = await this.cxipERC721.getClientByChainId(chainId)
    const {gasLimit, gasPrice} = await this._estimateGasForMintingNft({
      chainId,
      tokenUri,
    })

    const txHash = (await this.cxipERC721.cxipMint(chainId, 0, TokenUriType.IPFS, tokenUri!, undefined, {
      gas: gasLimit,
      gasPrice,
    })) as Hex

    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})

    this.tokenId = tokenIdBytesString
    this.txHash = txHash
    this.isMinted = true

    return {
      tokenId: tokenIdBytesString,
      txHash,
    }
  }

  async tokenIdExists(tokenId: string, chainId: number): Promise<boolean> {
    const exists = await this.cxipERC721.exists(chainId, tokenId)
    return exists === 'true'
  }

  async getOwner(tokenId = this.tokenId, chainId: number) {
    if (!tokenId) throw new NotMintedNftError()
    const owner = (await this.cxipERC721.ownerOf(chainId, tokenId)) as Address
    return owner
  }

  async isOwner(account: Address, tokenId: string, chainId: number): Promise<boolean> {
    const owner = await this.cxipERC721.ownerOf(chainId, tokenId)
    return String(owner)?.toLowerCase() === String(account)?.toLowerCase()
  }

  // TODO: Functions below are used for easy testing while in development. Remove before public release.
  setTokenId(tokenId: string) {
    validate.tokenId.parse(tokenId)
    this.tokenId = tokenId
  }

  toggleIsMinted() {
    this.isMinted = !this.isMinted
  }
}
