import {Address, Hex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {CxipERC721Contract} from '../contracts'
import {NotMintedNFTError} from '../errors/assets/not-minted-nft.error'
import {HolographERC721Contract} from './holograph-erc721-contract'
import {CreateNFT, DEFAULT_TOKEN_URI, validate} from './nft.validation'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {IsNotMinted} from '../utils/decorators'
import {getParsedTokenId} from '../utils/transformers'
import {MintConfig, TokenUriType, WriteContractOptions} from '../utils/types'

export class NFT {
  public contract: HolographERC721Contract
  public isMinted: boolean
  public txHash?: string

  public ipfsMetadataCid?: string
  private _tokenId?: string // Decimal tokenId string

  private cxipERC721: CxipERC721Contract

  constructor({contract, ipfsMetadataCid}: CreateNFT) {
    this.ipfsMetadataCid = validate.ipfsMetadataCid.parse(ipfsMetadataCid)
    this.contract = validate.contract.parse(contract)

    this.cxipERC721 = new CxipERC721Contract(contract.contractAddress!)
    this.isMinted = false
  }

  @IsNotMinted()
  public setIpfsMetadataCid(ipfsMetadataCid: string) {
    validate.ipfsMetadataCid.parse(ipfsMetadataCid)
    this.ipfsMetadataCid = ipfsMetadataCid
  }

  get tokenId() {
    if (!this._tokenId) throw new NotMintedNFTError('tokenId')

    return this._tokenId
  }

  public getParsedTokenId() {
    if (!this._tokenId) throw new NotMintedNFTError(this.getParsedTokenId.name)

    return getParsedTokenId(this._tokenId!)
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

  public async tokenIdExists(tokenId: string, chainId: number): Promise<boolean> {
    return this.cxipERC721.exists(chainId, tokenId)
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
}
