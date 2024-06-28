import {Address, Hex, numberToHex, pad, toHex} from 'viem'

import {HolographERC721Contract} from './holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from './holograph-open-edition-erc721-contract'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {CxipERC721Contract} from '../contracts'
import {NotMintedNFTError} from '../errors/assets/not-minted-nft.error'
import {CreateNFT, DEFAULT_TOKEN_URI, HolographNFTMetadata, validate} from './nft.validation'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {IsNotMinted} from '../utils/decorators'
import {MintConfig, TokenUriType, WriteContractOptions} from '../utils/types'
import {getParsedTokenId} from '../utils/transformers'

export class NFT {
  public contract: HolographERC721Contract
  public isMinted: boolean
  public metadata: HolographNFTMetadata
  public txHash?: string

  public ipfsMetadataCid?: string
  private _tokenId?: string // Decimal tokenId string

  private cxipERC721: CxipERC721Contract

  constructor({contract, ipfsMetadataCid, metadata}: CreateNFT) {
    this.metadata = validate.metadata.parse(metadata)
    this.ipfsMetadataCid = validate.ipfsMetadataCid.parse(ipfsMetadataCid)
    this.contract = validate.contract.parse(contract)

    this.cxipERC721 = new CxipERC721Contract(contract.contractAddress!)
    this.isMinted = false
  }

  get name() {
    return this.metadata?.name
  }

  get description() {
    return this.metadata?.description
  }

  get creator() {
    return this.metadata?.creator
  }

  get image() {
    return this.metadata?.image
  }

  // AKA the NFT traits
  get attributes() {
    return this.metadata?.attributes
  }

  get tokenId() {
    if (!this._tokenId) throw new NotMintedNFTError('tokenId')

    return this._tokenId
  }

  public getParsedTokenId() {
    if (!this._tokenId) throw new NotMintedNFTError(this.getParsedTokenId.name)

    return getParsedTokenId(this._tokenId!)
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
  public setImage(image: string) {
    validate.image.parse(image)
    this.metadata.image = image
  }

  @IsNotMinted()
  public setIpfsMetadataCid(ipfsMetadataCid: string) {
    validate.ipfsMetadataCid.parse(ipfsMetadataCid)
    this.ipfsMetadataCid = ipfsMetadataCid
  }

  public async mint({chainId, wallet}: MintConfig, options?: WriteContractOptions) {
    const client = await this.cxipERC721.getClientByChainId(chainId)
    const {gasLimit, gasPrice} = await this.estimateGasForMintingNFT({chainId, wallet})

    const txHash = (await this.cxipERC721.cxipMint(chainId, 0, TokenUriType.IPFS, this.ipfsMetadataCid!, wallet, {
      ...options,
      gas: gasLimit,
      gasPrice,
    })) as Hex

    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.contract.contractAddress!)
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

  public async estimateGasForMintingNFT({chainId, wallet}: MintConfig) {
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
