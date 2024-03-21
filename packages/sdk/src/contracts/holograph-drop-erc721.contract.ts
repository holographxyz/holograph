import {Address} from 'abitype'

import {HolographDropERC721ABI, HolographERC721ABI} from '../constants/abi/develop'
import {HolographBaseContract} from './holograph-base.contract'
import {HolographLogger, Config, HolographWallet} from '../services'
import {EstimateContractFunctionGasArgs, GetContractFunctionArgs, WriteContractOptions} from '../utils/types'

const ABIs = [...HolographDropERC721ABI, ...HolographERC721ABI]

/**
 * @group Contracts
 * HolographDropERC721
 *
 */
export class HolographDropERC721 extends HolographBaseContract {
  private collectionAddress: Address

  constructor(_config: Config, collectionAddress: Address, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: HolographDropERC721.name})
    } else {
      logger = HolographLogger.createLogger({className: HolographDropERC721.name})
    }

    super(_config, logger, ABIs, 'HolographDropERC721')
    this.collectionAddress = collectionAddress
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: GetContractFunctionArgs<typeof ABIs>) {
    return this._callContractFunction({address: this.collectionAddress, chainId, functionName, wallet, args, options})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractFunctionGasArgs<typeof ABIs>) {
    return this._estimateContractGas({address: this.collectionAddress, chainId, functionName, wallet, args, options})
  }

  /**
   * @readonly
   * Convert contract's USD mint price into native token price.
   * @param chainId  The chain id of the network to get the result from.
   * @returns The native price of the NFT.
   */
  async getNativePrice(chainId: number) {
    return this._getContractFunction({chainId, functionName: 'getNativePrice'})
  }

  /**
   * @readonly
   * Get the holograph fee in wei.
   * @param chainId  The chain id of the network to get the result from.
   * @param quantity The quantity of NFTs to purchase.
   * @returns The holograph fee in wei.
   */
  async getHolographFeeWei(chainId: number, quantity: number) {
    return this._getContractFunction({args: [quantity], chainId, functionName: 'getHolographFeeWei'})
  }

  /**
   * @readonly
   * Check if the NFT exists through its token id.
   * @param chainId  The chain id of the network to get the result from.
   * @returns A boolean indicating if the NFT exists.
   */
  async exists(chainId: number, tokenId: string) {
    return this._getContractFunction({
      args: [tokenId],
      chainId,
      functionName: 'exists',
    })
  }

  /**
   * @readonly
   * Get the owner of the NFT.
   * @param chainId  The chain id of the network to get the result from.
   * @returns The owner address of the NFT.
   */
  async ownerOf(chainId: number, tokenId: string) {
    return this._getContractFunction({
      args: [tokenId],
      chainId,
      functionName: 'ownerOf',
    })
  }

  /**
   * Mint a holographable MOE NFT.
   * @param chainId  The chain id of the network to send the transaction.
   * @param quantity The quantity of NFTs to purchase.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction.
   */
  async purchase(
    chainId: number,
    quantity: number,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      args: [quantity],
      chainId,
      functionName: 'purchase',
      options,
      wallet,
    })
  }
}
