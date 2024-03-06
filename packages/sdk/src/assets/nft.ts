import {numberToHex} from 'viem'

import {NotMintedNftError} from '../errors/assets/not-minted-nft.error'
import {IsNotMinted} from '../utils/decorators'
import {HolographNFTMetadata, validate} from './nft.validation'

export class NFT {
  isMinted: boolean
  private metadata: HolographNFTMetadata
  private owner?: string
  private chainId?: string | number
  private file?: string
  private tokenId?: string // Decimal tokenId string
  private collectionAddress?: string
  private mintTx?: string

  constructor(metadata: HolographNFTMetadata) {
    this.metadata = metadata
    this.isMinted = false
  }

  getMetadata() {
    return this.metadata
  }

  getName() {
    return this.metadata.name
  }

  getDescription() {
    return this.metadata.description
  }

  getCreator() {
    return this.metadata.creator
  }

  // AKA the NFT traits
  getAttributes() {
    return this.metadata.attributes
  }

  getOwner() {
    return this.owner
  }

  getFile() {
    return this.file
  }

  getTokenId() {
    if (!this.chainId || !this.tokenId) throw new NotMintedNftError(this.getTokenId.name)
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
  setFile(file: string) {
    validate.file.parse(file)
    this.file = file
  }

  // TODO: Add the following methods soon
  mint() {}

  uploadFileToIpfs() {}

  setOwner(owner: string) {
    validate.owner.parse(owner)
  }

  // TODO: Functions below are used for easy testing while in development. Remove before public release.
  setTokenId(tokenId: string) {
    validate.tokenId.parse(tokenId)
    this.tokenId = tokenId
  }

  setChainId(chainId: string | number) {
    validate.chainId.parse(chainId)
    this.chainId = chainId
  }

  toggleIsMinted() {
    this.isMinted = !this.isMinted
  }
}
