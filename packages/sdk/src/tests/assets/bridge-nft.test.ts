import {Address} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {BridgeContract} from '../../assets/bridge-contract'
import {BridgeNFT} from '../../assets/bridge-nft'
import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {NFT} from '../../assets/nft'
import {HolographWallet} from '../../services'
import {testConfigObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID} from '../setup'
import {generateRandomSalt} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

/**
 * TODO:
 * These tests should be executed on a testnet as they are not expected to run successfully locally.
 */
describe('Asset class: BridgeNFT', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const wallet = new HolographWallet({
    account,
    networks: testConfigObject.networks,
  })

  let contract: HolographERC721Contract
  let bridgeNFT: BridgeNFT
  let sourceChainId: number
  let destinationChainId: number
  let contractAddress: Address

  beforeAll(async () => {
    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID

    contract = new HolographERC721Contract({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        symbol: 'HOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: sourceChainId,
    })
    contract.erc721ConfigHash

    const signatureData = await contract.signDeploy(wallet)
    const deploymentData = await contract.deploy(signatureData)

    const myNFT = new NFT({
      contract,
      ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
    })

    const {tokenId, txHash} = await myNFT.mint({
      chainId: sourceChainId,
    })

    contractAddress = deploymentData.contractAddress

    bridgeNFT = new BridgeNFT({
      sourceChainId,
      destinationChainId,
      contractAddress,
      tokenId,
      wallet,
    })
  })

  it('should be able to get the BridgeNFT wrapper class', () => {
    expect(BridgeContract).toHaveProperty('createInitCode')

    expect(bridgeNFT).toHaveProperty('getInitCode')
    expect(bridgeNFT).toHaveProperty('bridgeOut')
  })

  describe('getInitCode()', () => {
    it('should be able to get the bridge out request init code', async () => {
      const bridgeOutPayload = await bridgeNFT.getInitCode()

      expectTypeOf(bridgeOutPayload).toBeString()
      expect(bridgeOutPayload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('bridgeOut()', () => {
    it('should be able to bridge a NFT', async () => {
      const tx = await bridgeNFT.bridgeOut(wallet)

      console.log('DEBUG| transaction hash: ', tx)

      const receipt = await wallet.onChain(sourceChainId).getTransactionReceipt({hash: tx.hash})
      expect(receipt.status).toBe('success')
    })
  })
})
