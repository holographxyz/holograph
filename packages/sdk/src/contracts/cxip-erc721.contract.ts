import {Address} from 'abitype'

import {CxipERC721ABI, HolographERC721ABI} from '../constants/abi/develop'
import {HolographLogger, Config, HolographWallet} from '../services'
import {EstimateContractFunctionGasArgs, GetContractFunctionArgs, WriteContractOptions} from '../utils/types'
import {HolographBaseContract} from './holograph-base.contract'
import {Hex} from 'viem'

const ABIs = [...CxipERC721ABI, ...HolographERC721ABI]

/**
 * @group Contracts
 * CxipERC721
 *
 * @remarks
 *
 * CXIP ERC-721 Contract that is bridgeable via Holograph.
 * Used for minting and managing Holograph Bridgeable ERC721 NFTs.
 *
 */
export class CxipERC721Contract extends HolographBaseContract {
  private contractAddress: Address

  constructor(contractAddress: Address, parentLogger?: HolographLogger) {
    let logger: HolographLogger

    if (parentLogger) {
      logger = parentLogger.addContext({className: CxipERC721Contract.name})
    } else {
      logger = HolographLogger.createLogger({className: CxipERC721Contract.name})
    }

    super(logger, ABIs, 'CxipERC721')
    this.contractAddress = contractAddress
  }

  private async _getContractFunction({
    chainId,
    functionName,
    wallet,
    args,
    options,
  }: GetContractFunctionArgs<typeof ABIs>) {
    return this._callContractFunction({address: this.contractAddress, chainId, functionName, wallet, args, options})
  }

  async estimateContractFunctionGas({
    chainId,
    functionName,
    wallet,
    args,
  }: EstimateContractFunctionGasArgs<typeof ABIs>) {
    return this._estimateContractGas({address: this.contractAddress, chainId, functionName, wallet, args})
  }

  /**
   * @readonly
   * Check if the NFT exists through its token id.
   * @param chainId  The chain id of the network to get the result from.
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
   * Get's the URI of the token.
   * @param chainId  The chain id of the network to get the result from.
   * @returns The URI.
   */
  async tokenURI(chainId: number, tokenId: string): Promise<string> {
    return this._getContractFunction({
      args: [tokenId],
      chainId,
      functionName: 'tokenURI',
    })
  }

  /**
   * Mint a holographable NFT.
   * @param chainId  The chain id of the network to send the transaction.
   * @param tokenId The token id of the NFT.
   * @param uriType The type of the URI.
   * @param tokenUri The URI of the token.
   * @param wallet Holograph wallet instance, optional param.
   * @param options The override options for the transaction.
   * @returns A transaction hash.
   */
  async cxipMint(
    chainId: number,
    tokenId: number | bigint,
    uriType: number,
    tokenUri: string,
    wallet?: {account: string | HolographWallet},
    options?: WriteContractOptions,
  ): Promise<Hex> {
    return this._getContractFunction({
      args: [tokenId, uriType, tokenUri],
      chainId,
      functionName: 'cxipMint',
      options,
      wallet,
    })
  }
}
