import {beforeAll, beforeEach, describe, expect, it} from 'vitest'

import {HolographOpenEditionERC721ContractV2} from '../../assets/holograph-open-edition-erc721-contract'
import {OpenEditionNFT} from '../../assets/open-edition-nft'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, testConfigObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

const expectedValues = {
  mintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  owner: testConfigObject.accounts?.default?.address!,
}

describe('Asset class: OpenEditionNFT', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})

  let contract: HolographOpenEditionERC721ContractV2
  let nft: OpenEditionNFT

  beforeAll(async () => {
    contract = new HolographOpenEditionERC721ContractV2({
      contractInfo: {
        name: 'My First Contract',
        description: 'Probably nothing.',
        symbol: 'MFC',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsImageCid: 'QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93',
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSalePrice: 25,
        publicSaleStart: '2024-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-02T00:00:00Z',
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(500) // Sleep to avoid nonce issues
    const signatureData = await contract.signDeploy(wallet)
    await contract.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new OpenEditionNFT({
      contract,
    })
  })

  it.skip('should be able to get the OpenEditionNFT wrapper class', () => {
    expect(nft).toHaveProperty('metadata')
    expect(nft).toHaveProperty('name')
    expect(nft).toHaveProperty('description')
    expect(nft).toHaveProperty('properties')
    expect(nft).toHaveProperty('ipfsImageCid')
    expect(nft).toHaveProperty('animationUrl')
    expect(nft).toHaveProperty('getOwner')
    expect(nft).toHaveProperty('getParsedTokenId')
    expect(nft).toHaveProperty('estimateGasForPurchasingNFT')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('tokenIdExists')
  })

  describe('estimateGasForPurchasingNFT()', () => {
    it('should be able to estimate gas for purchasing an open edition NFT', async () => {
      await sleep(500) // Sleep to avoid nonce issues
      const gasEstimation = await nft['estimateGasForPurchasingNFT']({
        chainId: LOCALHOST2_CHAIN_ID,
      })
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
    it('should be able to purchase an open edition NFT', async () => {
      await sleep(500) // Sleep to avoid nonce issues
      const {tokenId, txHash} = await nft.mint({
        chainId: LOCALHOST2_CHAIN_ID,
      })

      expect(nft.isMinted).toBe(true)
      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(txHash.startsWith('0x')).to.be.true
      expect(tokenId).to.be.an('string')
      expect(tokenId).to.be.equals(expectedValues.mintedNFTTokenId)
    })
  })

  describe('getOwner()', () => {
    it('should be able to get the open edition NFT owner', async () => {
      const owner = await nft.getOwner(expectedValues.mintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(owner).toBe(expectedValues.owner)
    })
  })

  describe('purchase()', () => {
    it('should be able to purchase a open edition NFT', () => {})
  })
})
