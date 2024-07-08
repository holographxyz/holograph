import {Address, Hex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {OpenEditionERC721Contract} from '../contracts'
import {NotMintedNFTError} from '../errors'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from './holograph-open-edition-erc721-contract'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {HolographVersion, MintConfig, WriteContractOptions} from '../utils/types'
import {CreateOpenEditionNFT, validate} from './nft.validation'
import {RequireMintedToken} from '../utils/decorators'
import {getParsedTokenId} from '../utils/transformers'

export class OpenEditionNFT {
  public contract: HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2
  public isMinted: boolean
  public txHash?: string
  protected _tokenId?: string // Decimal tokenId string
  private holographOpenEditionERC721: OpenEditionERC721Contract

  constructor({contract, version = HolographVersion.V2}: CreateOpenEditionNFT) {
    this.contract = validate.openEditionContract.parse(contract)

    this.holographOpenEditionERC721 = new OpenEditionERC721Contract(contract.contractAddress!, version)
    this.isMinted = false
  }

  @RequireMintedToken()
  get tokenId() {
    return this._tokenId
  }

  @RequireMintedToken()
  public getParsedTokenId() {
    return getParsedTokenId(this._tokenId!)
  }

  public async purchase({chainId, quantity = 1, wallet}: MintConfig, options?: WriteContractOptions) {
    const {gasLimit, gasPrice} = await this.estimateGasForMintingNFT({
      chainId,
      quantity,
      wallet,
    })
    const value = await this.holographOpenEditionERC721.getNativePrice(chainId)
    const protocolFee = await this.holographOpenEditionERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    const txHash = (await this.holographOpenEditionERC721.purchase(chainId, quantity, wallet, {
      ...options,
      gas: gasLimit,
      gasPrice,
      value: total + slippage,
    })) as Hex

    const client = await this.holographOpenEditionERC721.getClientByChainId(chainId)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.contract.contractAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})

    this.txHash = txHash
    this._tokenId = tokenIdBytesString
    this.isMinted = true

    return {
      tokenId: tokenIdBytesString,
      txHash,
    }
  }

  public async mint(...args: Parameters<OpenEditionNFT['purchase']>) {
    return this.purchase(...args)
  }

  public async estimateGasForPurchasingNFT({chainId, quantity: quantity_, wallet}: MintConfig) {
    const quantity = quantity_ || 1

    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.openEditionNftMint[chainId]

    const value = await this.holographOpenEditionERC721.getNativePrice(chainId)
    const protocolFee = await this.holographOpenEditionERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    if (gasController.gasPrice) {
      gasPrice = gasController.gasPrice
    } else {
      gasPrice = await this.holographOpenEditionERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (gasPrice * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = gasController.gasLimit
    } else {
      gasLimit = await this.holographOpenEditionERC721.estimateContractFunctionGas({
        args: [quantity],
        chainId,
        functionName: 'purchase',
        options: {
          value: total + slippage,
        },
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
      protocolFee,
      total,
    }
  }

  public async estimateGasForMintingNFT(...args: Parameters<OpenEditionNFT['estimateGasForPurchasingNFT']>) {
    return this.estimateGasForPurchasingNFT(...args)
  }

  public async tokenIdExists(tokenId: string, chainId: number): Promise<boolean> {
    return this.holographOpenEditionERC721.exists(chainId, tokenId)
  }

  public async getOwner(tokenId: string, chainId: number) {
    const tokenId_ = tokenId || this._tokenId!
    if (!tokenId) throw new NotMintedNFTError(this.getOwner.name)
    const owner = (await this.holographOpenEditionERC721.ownerOf(chainId, tokenId_)) as Address
    return owner
  }

  public async isOwner(account: Address, tokenId: string, chainId: number): Promise<boolean> {
    const owner = await this.holographOpenEditionERC721.ownerOf(chainId, tokenId)
    return String(owner)?.toLowerCase() === String(account)?.toLowerCase()
  }
}
