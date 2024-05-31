import {Hex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {HolographDropERC721} from '../contracts'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {HolographVersion, MintConfig, WriteContractOptions} from '../utils/types'
import {NFT} from './nft'
import {CreateNFT} from './nft.validation'

export class MoeNFT extends NFT {
  private holographDropERC721: HolographDropERC721

  constructor({collection, metadata, version = HolographVersion.V2}: CreateNFT) {
    super({collection, metadata, version})

    const holographDropERC721 = new HolographDropERC721(collection.collectionAddress!, version)
    this.holographDropERC721 = holographDropERC721
  }

  public async mint({chainId, quantity = 1, wallet}: MintConfig, options?: WriteContractOptions) {
    const {gasLimit, gasPrice} = await this._estimateGasForMintingNFT({
      chainId,
      quantity,
      wallet,
    })
    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    const txHash = (await this.holographDropERC721.purchase(chainId, quantity, wallet, {
      ...options,
      gas: gasLimit,
      gasPrice,
      value: total + slippage,
    })) as Hex

    const client = await this.holographDropERC721.getClientByChainId(chainId)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collection.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})
    this.txHash = txHash
    this._tokenId = tokenIdBytesString
    this.isMinted = true

    return {
      tokenId: tokenIdBytesString,
      txHash,
    }
  }

  protected async _estimateGasForMintingNFT({chainId, quantity: quantity_, wallet}: MintConfig) {
    const quantity = quantity_ || 1

    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.moeNftMint[chainId]

    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    if (gasController.gasPrice) {
      gasPrice = gasController.gasPrice
    } else {
      gasPrice = await this.holographDropERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (gasPrice * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    if (gasController.gasLimit) {
      gasLimit = gasController.gasLimit
    } else {
      gasLimit = await this.holographDropERC721.estimateContractFunctionGas({
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
    }
  }
}
