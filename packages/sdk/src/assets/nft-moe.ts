import {Hex, pad, toHex} from 'viem'

import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {HolographDropERC721} from '../contracts'
import {Config} from '../services'
import {queryTokenIdFromReceipt} from '../utils/decoders'
import {HolographConfig, HolographVersion, MintConfig} from '../utils/types'
import {NFT} from './nft'
import {CreateNft} from './nft.validation'

export class MoeNFT extends NFT {
  private holographDropERC721: HolographDropERC721

  constructor(configObject: HolographConfig, {collectionAddress, metadata, version = HolographVersion.V2}: CreateNft) {
    super(configObject, {collectionAddress, metadata, version})
    const config = Config.getInstance(configObject)
    const holographDropERC721 = new HolographDropERC721(config, this.collectionAddress!, version)
    this.holographDropERC721 = holographDropERC721
  }

  async _estimateGasForMintingNft({chainId, quantity: quantity_}: MintConfig) {
    const quantity = quantity_ || 1

    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.moeNftMint[chainId]

    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    if (gasController.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice)
    } else {
      gasPrice = await this.holographDropERC721.getGasPrice(chainId)
    }

    if (gasController.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
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
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    const gas = gasPrice * gasLimit

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  async mint({chainId, quantity: quantity_}: MintConfig) {
    const quantity = quantity_ || 1

    const {gasLimit, gasPrice} = await this._estimateGasForMintingNft({
      chainId,
      quantity,
    })
    const value = await this.holographDropERC721.getNativePrice(chainId)
    const protocolFee = await this.holographDropERC721.getHolographFeeWei(chainId, quantity)
    const total = BigInt(String(value)) * BigInt(quantity) + BigInt(String(protocolFee))

    // 5% slippage
    const slippage = (total * BigInt(5)) / BigInt(100)

    const txHash = (await this.holographDropERC721.purchase(chainId, quantity, undefined, {
      gas: gasLimit,
      gasPrice,
      value: total + slippage,
    })) as Hex

    const client = await this.holographDropERC721.getClientByChainId(chainId)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const tokenId = queryTokenIdFromReceipt(receipt, this.collectionAddress!)
    const tokenIdBytesString = pad(toHex(BigInt(tokenId!)), {size: 32})
    this.txHash = txHash
    this.tokenId = tokenIdBytesString
    this.isMinted = true

    return {
      tokenId: tokenIdBytesString,
      txHash,
    }
  }
}
