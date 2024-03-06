import {numberToHex} from 'viem'

import {removeLeftZeroes} from '../utils/helpers'

export const UPDATE_MINTED_NFT_ERROR_MESSAGE = 'HOLOGRAPH: cannot update an NFT that is minted'
export const NOT_MINTED_NFT_ERROR_MESSAGE = 'HOLOGRAPH: NFT has not been minted'

type HolographNFTMetadata = {
  name: string
  description: string
  creator: string
  attributes?: {
    [key: string]: string
  }
}

export class NFT {
  private metadata: HolographNFTMetadata
  private isMinted: boolean
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
    if (!this.chainId || !this.tokenId) throw new Error(NOT_MINTED_NFT_ERROR_MESSAGE)
    const tokenIdHex = numberToHex(BigInt(this.tokenId), {size: 32})
    const chainIdHex = tokenIdHex.slice(0, 10)
    const tokenNumberHex = tokenIdHex.slice(10)

    return {
      decimal: this.tokenId,
      hex: tokenIdHex,
      part: {
        chainId: parseInt(chainIdHex, 16).toString(),
        decimal: parseInt(tokenNumberHex, 16).toString(),
        hex: removeLeftZeroes(tokenNumberHex),
      },
    }
  }

  setMetadata(metadata: HolographNFTMetadata) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.metadata = metadata
  }

  setName(name: string) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.metadata.name = name
  }

  setDescription(description: string) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.metadata.description = description
  }

  setCreator(creator: string) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.metadata.creator = creator
  }

  setAttributes(attributes: {[key: string]: string}) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.metadata.attributes = attributes
  }

  setFile(file: string) {
    if (this.isMinted) throw new Error(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    this.file = file
  }

  // TODO: Add the following methods soon
  mint() {}

  uploadFileToIpfs() {}

  setOwner() {}

  // TODO: Remove the following methods soon
  setTokenId(tokenId: string) {
    this.tokenId = tokenId
  }

  setChainId(chainId: string | number) {
    this.chainId = chainId
  }

  toggleIsMinted() {
    this.isMinted = !this.isMinted
  }
}
