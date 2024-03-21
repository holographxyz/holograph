import {Address} from 'abitype'
import {Hex, numberToHex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {NotMintedNftError} from '../errors/assets/not-minted-nft.error'
import {CreateNft, DEFAULT_TOKEN_URI, HolographNFTMetadata, validate} from './nft.validation'
import {Config} from '../services'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {IsNotMinted} from '../utils/decorators'
import {HolographConfig, TokenUriType} from '../utils/types'
import {CxipERC721, HolographDropERC721} from '../contracts'

export class NFT {
  isMinted: boolean
  private metadata: HolographNFTMetadata
  private chainId: number
  private collectionAddress?: Address
  private file?: string
  private owner?: string
  private tokenId?: string // Decimal tokenId string
  private txHash?: string

  private cxipERC721: CxipERC721
  private holographDropERC721: HolographDropERC721

  constructor(configObject: HolographConfig, {chainId, collectionAddress, metadata}: CreateNft) {
    this.chainId = validate.chainId.parse(chainId)
    this.collectionAddress = validate.collectionAddress.parse(collectionAddress) as Address
    this.metadata = validate.metadata.parse(metadata)
    const config = Config.getInstance(configObject)
    const cxipERC721 = new CxipERC721(config, this.collectionAddress)
    const holographDropERC721 = new HolographDropERC721(config, this.collectionAddress)
    this.cxipERC721 = cxipERC721
    this.holographDropERC721 = holographDropERC721
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

  async _estimateGasForMintingNft(chainId = this.chainId, tokenUri = '') {
    let gasPrice, gasLimit
    const gasController = GAS_CONTROLLER.nftMint[chainId]

    if (gasController.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice!)
    } else {
      gasPrice = await this.cxipERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier!)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = BigInt(gasController.gasLimit)
    } else {
      gasLimit = await this.cxipERC721.estimateContractFunctionGas({
        args: [0, 1, tokenUri || DEFAULT_TOKEN_URI],
        chainId,
        functionName: 'cxipMint',
      })
    }

    if (gasController.gasLimitMultiplier) {
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier!)) / BigInt(100)
    }

    const gas = BigInt(gasPrice) * BigInt(gasLimit)

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  async _estimateGasForMintingMoeNft(chainId = this.chainId, quantity = 1) {
    let gasPrice, gasLimit
    const gasController = GAS_CONTROLLER.moeNftMint[this.chainId]

    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (BigInt(total) * BigInt(5)) / BigInt(100)

    if (gasController.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice)
    } else {
      gasPrice = await this.holographDropERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier!)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = BigInt(gasController.gasLimit)
    } else {
      gasLimit = await this.holographDropERC721.estimateContractFunctionGas({
        args: [quantity],
        chainId,
        functionName: 'purchase',
        options: {
          value: total + slippage,
        },
      })
    }

    if (gasController.gasLimitMultiplier) {
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier!)) / BigInt(100)
    }

    const gas = BigInt(gasPrice) * BigInt(gasLimit)

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  async mint(tokenUri: string, chainId = this.chainId) {
    const client = await this.cxipERC721.getClientByChainId(chainId)
    const {gasLimit, gasPrice} = await this._estimateGasForMintingNft(chainId, tokenUri)

    const txHash = await this.cxipERC721.cxipMint(chainId, 0, TokenUriType.IPFS, tokenUri, undefined, {
      gas: gasLimit,
      gasPrice,
    })

    const receipt = await client.waitForTransactionReceipt({hash: txHash as Hex})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})
    this.txHash = String(txHash)
    this.tokenId = tokenIdBytesString

    return {
      tx: txHash,
      tokenId: tokenIdBytesString,
    }
  }

  async moeMint(chainId = this.chainId, quantity = 1) {
    const client = await this.cxipERC721.getClientByChainId(chainId)
    const {gasLimit, gasPrice} = await this._estimateGasForMintingMoeNft(chainId, quantity)
    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (BigInt(total) * BigInt(5)) / BigInt(100)

    const txHash = await this.holographDropERC721.purchase(chainId, quantity, undefined, {
      gas: gasLimit,
      gasPrice,
      value: total + slippage,
    })

    const receipt = await client.waitForTransactionReceipt({hash: txHash as Hex})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})
    this.txHash = String(txHash)
    this.tokenId = tokenIdBytesString

    return {
      tx: txHash,
      tokenId: tokenIdBytesString,
    }
  }

  async exists(tokenId: string, chainId = this.chainId): Promise<boolean> {
    const exists = await this.cxipERC721.exists(chainId, tokenId)
    return !!(exists || exists === 'true')
  }

  async isOwner(account: string, tokenId: string, chainId = this.chainId): Promise<boolean> {
    const owner = await this.cxipERC721.ownerOf(chainId, tokenId)
    return String(owner)?.toLowerCase() === String(account)?.toLowerCase()
  }

  // TODO: Do later
  setOwner(owner: string) {
    validate.owner.parse(owner)
  }

  uploadFileToIpfs() {}

  // TODO: Functions below are used for easy testing while in development. Remove before public release.
  setTokenId(tokenId: string) {
    validate.tokenId.parse(tokenId)
    this.tokenId = tokenId
  }

  setChainId(chainId: number) {
    validate.chainId.parse(chainId)
    this.chainId = chainId
  }

  toggleIsMinted() {
    this.isMinted = !this.isMinted
  }
}
