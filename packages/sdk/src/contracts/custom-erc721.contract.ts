import {Address} from 'abitype'

import {CustomERC721ABI} from '../constants/abi/develop'
import {HolographLogger, Config, HolographWallet} from '../services'
import {EstimateContractFunctionGasArgs, GetContractFunctionArgs, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'
import {Hex} from 'viem'

const ABIs = [...CustomERC721ABI]
//TODO: get correct ABI

/**
 * @group Contracts
 * CustomERC721
 *
 * @remarks
 *
 * CustomERC721 that is bridgeable via Holograph.
 * Used for minting and managing custom holographable ERC721 NFTs.
 *
 */
export class CustomERC721 extends HolographBaseContract {
  private collectionAddress: Address

  constructor(_config: Config, collectionAddress: Address, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: CustomERC721.name})
    } else {
      logger = HolographLogger.createLogger({className: CustomERC721.name})
    }

    super(_config, logger, ABIs, 'CustomERC721')
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
  }: EstimateContractFunctionGasArgs<typeof ABIs>) {
    return this._estimateContractGas({address: this.collectionAddress, chainId, functionName, wallet, args})
  }

  /**
   * @readonly
   * Returns the contract owner
   * @param chainId  The chain id of the network to get the result from.
   * @returns the owner address
   */
  async owner(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'owner',
    })
  }

  /**
   * @readonly
   * Returns if the provided wallet address is the owner
   * @param chainId  The chain id of the network to get the result from.
   * @param user a wallet address
   * @returns true or false
   */
  async isAdmin(chainId: number, user: Address) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'isAdmin',
    })
  }

  /**
   * @readonly
   * @param chainId  The chain id of the network to get the result from.
   */
  async maxSupply(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'maxSupply',
    })
  }

  /**
   * @readonly
   * @param chainId  The chain id of the network to get the result from.
   * @return SaleDetails sale information details
   */
  async saleDetails(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'saleDetails',
    })
  }

  /**
   * @readonly
   * @param chainId The chain id of the network to get the result from.
   * @return contract URI
   */
  async contractURI(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'contractURI',
    })
  }

  /**
   * @readonly
   * The Holograph fee is a flat fee for each mint in USD and is controlled by the treasury
   * @param chainId  The chain id of the network to get the result from.
   * @return The flat Holograph protocol fee for a single mint in USD
   */
  async getHolographFeeFromTreasury(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'getHolographFeeFromTreasury',
    })
  }

  /**
   * @readonly
   * The Holograph fee is a flat fee for each mint in USD
   * @param chainId  The chain id of the network to get the result from.
   * @return The Holograph protocol fee for amount of mints in USD
   */
  async getHolographFeeUsd(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'getHolographFeeUsd',
    })
  }

  /**
   * @readonly
   * The Holograph fee is a flat fee for each mint in wei after conversion
   * @param chainId  The chain id of the network to get the result from.
   * @param quantity The quantity of NFTs to purchase.
   * @returns The Holograph protocol fee for amount of mints in wei
   */
  async getHolographFeeWei(chainId: number, quantity: number) {
    return this._getContractFunction({args: [BigInt(quantity)], chainId, functionName: 'getHolographFeeWei'})
  }

  /**
   * @readonly
   * Number of NFTs the user has minted per address
   * @param chainId  The chain id of the network to get the result from.
   * @param minter to get counts for
   * @returns The number of NFTs the user has minted
   */
  async mintedPerAddress(chainId: number, minter: Address) {
    return this._getContractFunction({args: [minter], chainId, functionName: 'mintedPerAddress'})
  }

  /**
   * @readonly
   * Returns the URI for a given tokenId.
   * @param chainId  The chain id of the network to get the result from.
   * @param tokenId id of token to get URI for
   * @returns The token URI
   */
  async tokenURI(chainId: number, tokenId: string) {
    return this._getContractFunction({args: [tokenId], chainId, functionName: 'tokenURI'})
  }

  /**
   * @readonly
   * Returns the base URI for a given tokenId. It return the base URI corresponding to the batch the tokenId belongs to.
   * @param chainId  The chain id of the network to get the result from.
   * @param tokenId id of token to get URI for
   * @returns The token URI
   */
  async baseURI(chainId: number, tokenId: string) {
    return this._getContractFunction({args: [tokenId], chainId, functionName: 'baseURI'})
  }

  /**
   * @readonly
   * Convert USD price to current price in native Ether units
   * @param chainId  The chain id of the network to get the result from.
   * @return current price in native Ether units
   */
  async getNativePrice(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'getNativePrice',
    })
  }

  /**
   * @readonly
   * Returns the name of the token through the holographer entrypoint
   * @param chainId  The chain id of the network to get the result from.
   * @return The name of the token
   */
  async name(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'name',
    })
  }

  /**
   * @readonly
   * Returns the total amount of tokens minted in the contract.
   * @param chainId  The chain id of the network to get the result from.
   * @returns The number of tokens minted
   */
  async totalMinted(chainId: number) {
    return this._getContractFunction({
      args: [],
      chainId,
      functionName: 'totalMinted',
    })
  }

  /**
   * WRITE FUNCTIONS
   */

  /**
   * @onlyAdmin
   * Used internally to initialize the contract instead of through a constructor
   * @param chainId  The chain id of the network to send the transaction.
   * @param initPayload The abi encoded payload to use for contract initilaization.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction.
   */
  async init(
    chainId: number,
    initPayload: Hex,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      args: [initPayload],
      chainId,
      functionName: 'init',
      options,
      wallet,
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

  /**
   * @onlyAdmin
   * Admin mint tokens to a recipient for free
   * @param chainId  The chain id of the network to send the transaction.
   * @param recipient recipient to mint to
   * @param quantity quantity to mint
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction.
   */
  async adminMint(
    chainId: number,
    recipient: Address,
    quantity: number,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      args: [recipient, quantity],
      chainId,
      functionName: 'adminMint',
      options,
      wallet,
    })
  }

  /**
   * @onlyAdmin
   * This sets the sales configuration
   * @param chainId  The chain id of the network to send the transaction.
   * @param publicSalePrice New public sale price
   * @param maxSalePurchasePerAddress Max # of purchases (public) per address allowed
   * @param publicSaleStart unix timestamp when the public sale starts
   * @param publicSaleEnd unix timestamp when the public sale ends (set to 0 to disable)
   * @param presaleStart unix timestamp when the presale starts
   * @param presaleEnd unix timestamp when the presale ends
   * @param presaleMerkleRoot merkle root for the presale information
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction.
   */
  async setSaleConfiguration(
    chainId: number,
    publicSalePrice: bigint,
    maxSalePurchasePerAddress: number,
    publicSaleStart: bigint,
    publicSaleEnd: bigint,
    presaleStart: bigint,
    presaleEnd: bigint,
    presaleMerkleRoot: Hex,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ) {
    return this._getContractFunction({
      args: [
        publicSalePrice,
        maxSalePurchasePerAddress,
        publicSaleStart,
        publicSaleEnd,
        presaleStart,
        presaleEnd,
        presaleMerkleRoot,
      ],
      chainId,
      functionName: 'setSaleConfiguration',
      options,
      wallet,
    })
  }

  /**
   * @onlyAdmin
   * This withdraws native tokens from the contract to the contract owner.
   * @param chainId The chainId of the network to send the transaction to.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @return A transaction.
   */
  async withdraw(chainId: number, wallet?: {account: string | HolographWallet}, options?: WriteContractOptions) {
    return this._getContractFunction({chainId, functionName: 'withdraw', wallet})
  }
}
