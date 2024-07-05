import {Address} from 'abitype'
import {Hex} from 'viem'

import {HolographDropERC721ABI, HolographDropERC721V2ABI, HolographERC721ABI} from '../constants/abi/develop'
import {HolographBaseContract} from './holograph-base.contract'
import {HolographLogger, HolographWallet} from '../services'
import {
  EstimateContractFunctionGasArgs,
  GetContractFunctionArgs,
  HolographVersion,
  WriteContractOptions,
} from '../utils/types'

const ABIs = [...HolographDropERC721ABI, ...HolographERC721ABI]
const V2ABIs = [...HolographDropERC721V2ABI, ...HolographERC721ABI]

/**
 * @group Contracts
 * OpenEditionERC721
 *
 */
export class OpenEditionERC721Contract extends HolographBaseContract {
  private contractAddress: Address
  private abis: typeof ABIs | typeof V2ABIs

  constructor(contractAddress: Address, version = HolographVersion.V2, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: OpenEditionERC721Contract.name})
    } else {
      logger = HolographLogger.createLogger({className: OpenEditionERC721Contract.name})
    }

    const isV2 = version === HolographVersion.V2
    const abis = isV2 ? V2ABIs : ABIs
    super(logger, abis, isV2 ? 'HolographDropERC721V2' : 'HolographDropERC721')
    this.contractAddress = contractAddress
    this.abis = abis
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: GetContractFunctionArgs<typeof this.abis>) {
    return this._callContractFunction({address: this.contractAddress, chainId, functionName, wallet, args, options})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: EstimateContractFunctionGasArgs<typeof this.abis>) {
    return this._estimateContractGas({address: this.contractAddress, chainId, functionName, wallet, args, options})
  }

  /**
   * @readonly
   * Convert contract's USD mint price into native token price.
   * @param chainId  The chain id of the network to get the result from.
   * @returns The native price of the NFT.
   */
  async getNativePrice(chainId: number): Promise<bigint> {
    return this._getContractFunction({chainId, functionName: 'getNativePrice'})
  }

  /**
   * @readonly
   * Get the holograph fee in wei.
   * @param chainId  The chain id of the network to get the result from.
   * @param quantity The quantity of NFTs to purchase.
   * @returns The holograph fee in wei.
   */
  async getHolographFeeWei(chainId: number, quantity: number): Promise<bigint> {
    return this._getContractFunction({args: [BigInt(quantity)], chainId, functionName: 'getHolographFeeWei'})
  }

  /**
   * @readonly
   * Check if the NFT exists through its token id.
   * @param chainId  The chain id of the network to get the result from.
   * @param tokenId ID of token.
   * @returns A boolean indicating if the NFT exists.
   */
  async exists(chainId: number, tokenId: string): Promise<boolean> {
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
   * @param tokenId ID of token.
   * @returns The owner address of the NFT.
   */
  async ownerOf(chainId: number, tokenId: string): Promise<Address> {
    return this._getContractFunction({
      args: [tokenId],
      chainId,
      functionName: 'ownerOf',
    })
  }

  /**
   * @readonly
   * Token URI Getter
   * @param chainId  The chain id of the network to get the result from.
   * @param tokenId ID of token to get URI for.
   * @returns The token URI.
   */
  async tokenURI(chainId: number, tokenId: string): Promise<string> {
    return this._getContractFunction({
      args: [tokenId],
      chainId,
      functionName: 'tokenURI',
    })
  }

  /**
   * Purchase a holographable open edition NFT.
   * @param chainId  The chain id of the network to send the transaction.
   * @param quantity The quantity of NFTs to purchase.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction hash.
   */
  async purchase(
    chainId: number,
    quantity: number,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      args: [quantity],
      chainId,
      functionName: 'purchase',
      options,
      wallet,
    })
  }
}
