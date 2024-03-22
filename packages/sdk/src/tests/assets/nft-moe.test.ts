import {beforeAll, beforeEach, describe, expect, it} from 'vitest'
import {Hex} from 'viem'

import {MoeNFT} from '../../assets/nft-moe'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, configObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'
import {HolographMoeERC721DropV2} from '../../assets/collection-moe'

const expectedValues = {
  mintedNftTokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  owner: configObject.accounts?.default?.address!,
}

describe('Asset class: MoeNFT', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})

  let collection: HolographMoeERC721DropV2
  let nft: MoeNFT
  let nftTokenId: Hex

  beforeAll(async () => {
    collection = new HolographMoeERC721DropV2(configObject, {
      collectionInfo: {
        name: 'My First Collection',
        description: 'Nothing',
        symbol: 'MFC',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsImageCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32',
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSalePrice: 25,
        publicSaleStart: '2024-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-01T00:00:00Z',
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(2000) // Sleep to avoid nonce issues
    const signatureData = await collection.signDeploy(wallet)
    await collection.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new MoeNFT(configObject, {
      chainId: LOCALHOST2_CHAIN_ID,
      collectionAddress: collection.collectionAddress!,
      metadata: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        creator: 'Holograph Protocol',
        attributes: {
          key: 'value',
          anotherKey: 'anotherValue',
        },
      },
    })
  })

  it('should be able to get the NFT wrapper class', () => {
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
    expect(nft).toHaveProperty('_estimateGasForMintingNft')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('tokenIdExists')
  })

  describe('_estimateGasForMintingNft()', () => {
    it.skip('should be able to estimate gas for minting an NFT', async () => {
      await sleep(250) // Sleep to avoid nonce issues
      const gasEstimation = await nft._estimateGasForMintingNft()
      const gasPrice = Number(gasEstimation.gasPrice)
      const gasLimit = Number(gasEstimation.gasLimit)
      const gas = Number(gasEstimation.gas)

      expect(gasEstimation).toHaveProperty('gasPrice')
      expect(gasEstimation).toHaveProperty('gasLimit')
      expect(gasPrice).toBeGreaterThan(0)
      expect(gasLimit).toBeGreaterThan(0)
      expect(gas).toBe(gasPrice * gasLimit)
    })
  })

  describe('mint()', () => {
    it.skip('should be able to mint an NFT', async () => {
      const {tokenId, txHash} = await nft.mint()
      nftTokenId = tokenId

      expect(nft.isMinted).toBe(true)
      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(String(txHash).startsWith('0x')).to.be.true
      expect(tokenId).to.be.an('string')
      expect(tokenId).to.be.equals(expectedValues.mintedNftTokenId)
    })
  })

  describe('getOwner()', () => {
    it.skip('should be able to get the NFT owner', async () => {
      const owner = await nft.getOwner(nftTokenId)

      expect(owner).toBe(expectedValues.owner)
    })
  })
})
