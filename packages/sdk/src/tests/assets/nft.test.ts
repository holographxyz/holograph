import {beforeAll, beforeEach, describe, expect, it} from 'vitest'

import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {NFT} from '../../assets/nft'
import {NOT_MINTED_NFT_ERROR_MESSAGE} from '../../errors/assets/not-minted-nft.error'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, testConfigObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

const expectedValues = {
  mintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  notMintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000002',
  owner: testConfigObject.accounts?.default?.address!,
  tokenId: {
    hex: '0x000000060000000000000000000000000000000000000000000000000000a4f4',
    decimal: '161759680002903838768002090522117784041822866535243434886621661537524',
    part: {
      chainId: LOCALHOST2_CHAIN_ID,
      tokenNumber: '42228',
    },
  },
}

describe('Asset class: NFT', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})

  let contract: HolographERC721Contract
  let nft: NFT

  beforeAll(async () => {
    contract = new HolographERC721Contract({
      contractInfo: {
        name: 'My First Contract',
        symbol: 'MFC',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(1500) // Sleep to avoid nonce issues
    const signatureData = await contract.signDeploy(wallet)
    await contract.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new NFT({
      contract,
      ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
    })
  })

  it('should be able to get the NFT wrapper class', () => {
    expect(nft).toHaveProperty('ipfsMetadataCid')
    expect(nft).toHaveProperty('getOwner')
    expect(nft).toHaveProperty('getParsedTokenId')
    expect(nft).toHaveProperty('estimateGasForMintingNFT')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('tokenIdExists')
  })

  it('should be able to get the NFT IPFS metadata cid', () => {
    const ipfsMetadataCid = nft.ipfsMetadataCid

    expect(ipfsMetadataCid).toBe('QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json')
  })

  describe('getParsedTokenId()', () => {
    it('should fail if the NFT has not been minted', () => {
      expect(() => nft.getParsedTokenId()).toThrowError(NOT_MINTED_NFT_ERROR_MESSAGE)
    })
  })

  describe('estimateGasForMintingNFT()', () => {
    it('should be able to estimate gas for minting an NFT', async () => {
      await sleep(500) // Sleep to avoid nonce issues
      const gasEstimation = await nft['estimateGasForMintingNFT']({chainId: LOCALHOST2_CHAIN_ID})
      const gasPrice = gasEstimation.gasPrice
      const gasLimit = gasEstimation.gasLimit
      const gas = gasEstimation.gas

      expect(gasEstimation).toHaveProperty('gasPrice')
      expect(gasEstimation).toHaveProperty('gasLimit')
      expect(gasPrice).toBeGreaterThan(0)
      expect(gasLimit).toBeGreaterThan(0)
      expect(gas).toBe(gasPrice * gasLimit)
    })
  })

  describe('mint()', () => {
    it('should be able to mint an NFT', async () => {
      const {tokenId, txHash} = await nft.mint({chainId: LOCALHOST2_CHAIN_ID})

      expect(nft.isMinted).toBe(true)
      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(txHash.startsWith('0x')).to.be.true
      expect(tokenId).to.be.an('string')
      expect(tokenId).to.be.equals(expectedValues.mintedNFTTokenId)
    })
  })

  describe('getOwner()', () => {
    it('should be able to get the NFT owner', async () => {
      const owner = await nft.getOwner(expectedValues.mintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(owner).toBe(expectedValues.owner)
    })
  })

  describe('isOwner()', () => {
    it('should be able to check if an account is the NFT owner', async () => {
      const isOwner = await nft.isOwner(expectedValues.owner, expectedValues.mintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(isOwner).toBe(true)
    })
  })

  describe('tokenIdExists()', () => {
    it('should be able to check if a minted NFT exists', async () => {
      const exists = await nft.tokenIdExists(expectedValues.mintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(exists).toBe(true)
    })

    it('should be able to check if a random NFT token id NFT does not exist', async () => {
      const exists = await nft.tokenIdExists(expectedValues.notMintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(exists).toBe(false)
    })
  })
})
