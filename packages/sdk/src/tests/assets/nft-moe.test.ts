import {beforeAll, beforeEach, describe, expect, it} from 'vitest'

import {HolographMoeERC721DropV2} from '../../assets/collection-moe'
import {MoeNFT} from '../../assets/nft-moe'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, configObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

const expectedValues = {
  mintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  owner: configObject.accounts?.default?.address!,
}

describe('Asset class: MoeNFT', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const wallet = new HolographWallet({account, networks: configObject.networks})

  let collection: HolographMoeERC721DropV2
  let nft: MoeNFT

  beforeAll(async () => {
    collection = new HolographMoeERC721DropV2({
      collectionInfo: {
        name: 'My First Collection',
        description: 'Probably nothing.',
        symbol: 'MFC',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsImageCid: 'QmVRoVke1wqxw3caH2ARpbNSrQ4M3Q8GFHqRwe352LXQvd',
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmbC3ACnaUVHaLoMzcgJvQE6MgGXVBcWoGpaHi5CKkPafc/nft.jpg',
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSalePrice: 25,
        publicSaleStart: '2024-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-01T00:00:00Z',
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(500) // Sleep to avoid nonce issues
    const signatureData = await collection.signDeploy(wallet)
    await collection.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new MoeNFT({
      collection,
      metadata: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing.',
        creator: 'Holograph Protocol',
        attributes: {
          key: 'value',
          anotherKey: 'anotherValue',
        },
      },
    })
  })

  it('should be able to get the MOE NFT wrapper class', () => {
    expect(nft).toHaveProperty('metadata')
    expect(nft).toHaveProperty('name')
    expect(nft).toHaveProperty('description')
    expect(nft).toHaveProperty('creator')
    expect(nft).toHaveProperty('attributes')
    expect(nft).toHaveProperty('ipfsUrl')
    expect(nft).toHaveProperty('ipfsImageCid')
    expect(nft).toHaveProperty('getOwner')
    expect(nft).toHaveProperty('getParsedTokenId')
    expect(nft).toHaveProperty('setMetadata')
    expect(nft).toHaveProperty('setName')
    expect(nft).toHaveProperty('setDescription')
    expect(nft).toHaveProperty('setAttributes')
    expect(nft).toHaveProperty('setCreator')
    expect(nft).toHaveProperty('setIpfsUrl')
    expect(nft).toHaveProperty('setIpfsImageCid')
    expect(nft).toHaveProperty('_estimateGasForMintingNFT')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('tokenIdExists')
  })

  describe('_estimateGasForMintingNFT()', () => {
    it('should be able to estimate gas for minting a MOE NFT', async () => {
      await sleep(500) // Sleep to avoid nonce issues
      const gasEstimation = await nft['_estimateGasForMintingNFT']({
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
    it('should be able to purchase a MOE NFT', async () => {
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
    it('should be able to get the MOE NFT owner', async () => {
      const owner = await nft.getOwner(expectedValues.mintedNFTTokenId, LOCALHOST2_CHAIN_ID)

      expect(owner).toBe(expectedValues.owner)
    })
  })
})
