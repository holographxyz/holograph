import {beforeAll, beforeEach, describe, expect, it} from 'vitest'

import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {NFT} from '../../assets/nft'
import {NOT_MINTED_NFT_ERROR_MESSAGE} from '../../errors/assets/not-minted-nft.error'
import {UPDATE_MINTED_NFT_ERROR_MESSAGE} from '../../errors/assets/update-minted-nft.error'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, configObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

const expectedValues = {
  mintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  notMintedNFTTokenId: '0x0000000000000000000000000000000000000000000000000000000000000002',
  owner: configObject.accounts?.default?.address!,
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
  const account: HolographAccount = configObject.accounts?.default!
  const wallet = new HolographWallet({account, networks: configObject.networks})

  let collection: HolographLegacyCollection
  let nft: NFT

  beforeAll(async () => {
    collection = new HolographLegacyCollection({
      collectionInfo: {
        name: 'My First Collection',
        description: 'Nothing',
        symbol: 'MFC',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(1500) // Sleep to avoid nonce issues
    const signatureData = await collection.signDeploy(wallet)
    await collection.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new NFT({
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
      ipfsInfo: {
        ipfsImageCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32',
        ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
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
    expect(nft).toHaveProperty('_estimateGasForMintingNFT')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('tokenIdExists')
  })

  describe('getMetadata()', () => {
    it('should be able to get the NFT metadata', () => {
      const metadata = nft.metadata

      expect(metadata).toHaveProperty('name')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('creator')
      expect(metadata).toHaveProperty('attributes')
      expect(metadata.name).toBe('NFTs Without Boundaries')
      expect(metadata.description).toBe('Probably nothing.')
      expect(metadata.creator).toBe('Holograph Protocol')
      expect(metadata.attributes).toHaveProperty('key')
      expect(metadata.attributes).toHaveProperty('anotherKey')
      expect(metadata.attributes?.key).toBe('value')
      expect(metadata.attributes?.anotherKey).toBe('anotherValue')
    })
  })

  it('should be able to get the NFT name', () => {
    const name = nft.name
    expect(name).toBe('NFTs Without Boundaries')
  })

  it('should be able to get the NFT description', () => {
    const description = nft.description

    expect(description).toBe('Probably nothing.')
  })

  it('should be able to get the NFT creator', () => {
    const creator = nft.creator

    expect(creator).toBe('Holograph Protocol')
  })

  it('should be able to get the NFT attributes', () => {
    const attributes = nft.attributes

    expect(attributes).toHaveProperty('key')
    expect(attributes).toHaveProperty('anotherKey')
    expect(attributes?.key).toBe('value')
    expect(attributes?.anotherKey).toBe('anotherValue')
  })

  it('should be able to get the NFT IPFS file URL', () => {
    const ipfsUrl = nft.ipfsUrl

    expect(ipfsUrl).toBe(
      'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
    )
  })

  it('should be able to get the NFT IPFS image cid', () => {
    const ipfsImageCid = nft.ipfsImageCid

    expect(ipfsImageCid).toBe('QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32')
  })

  it('should be able to get the NFT IPFS metadata cid', () => {
    const ipfsMetadataCid = nft.ipfsMetadataCid

    expect(ipfsMetadataCid).toBe('QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json')
  })

  describe('getParsedTokenId()', () => {
    it('should fail if the NFT has not been minted', () => {
      expect(() => nft.getParsedTokenId()).toThrowError(NOT_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to get the NFT tokenId', () => {
      nft.setTokenId(expectedValues.tokenId.decimal)
      nft.toggleIsMinted()

      const tokenId = nft.getParsedTokenId()

      expect(tokenId).toHaveProperty('decimal')
      expect(tokenId).toHaveProperty('hex')
      expect(tokenId).toHaveProperty('part')
      expect(tokenId.part).toHaveProperty('chainId')
      expect(tokenId.part).toHaveProperty('tokenNumber')
      expect(tokenId.decimal).toEqual(expectedValues.tokenId.decimal)
      expect(tokenId.hex).toEqual(expectedValues.tokenId.hex)
      expect(tokenId.part.tokenNumber).toEqual(expectedValues.tokenId.part.tokenNumber)
    })
  })

  describe('setMetadata()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() =>
        nft.setMetadata({
          name: 'New NFT Name',
          description: 'New NFT Description',
          creator: 'New Creator',
          attributes: {newKey: 'newValue'},
        }),
      ).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT metadata', () => {
      nft.setMetadata({
        name: 'New NFT Name',
        description: 'New NFT Description',
        creator: 'New Creator',
        attributes: {newKey: 'newValue'},
      })
      const newMetadata = nft.metadata

      expect(newMetadata.name).toBe('New NFT Name')
      expect(newMetadata.description).toBe('New NFT Description')
      expect(newMetadata.creator).toBe('New Creator')
      expect(newMetadata.attributes).toHaveProperty('newKey')
      expect(newMetadata.attributes?.newKey).toBe('newValue')
    })
  })

  describe('setName()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() => nft.setName('New NFT Name')).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT name', () => {
      nft.setName('New NFT Name')
      const name = nft.name

      expect(name).toBe('New NFT Name')
    })
  })

  describe('setDescription()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() => nft.setDescription('New NFT Description')).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT description', () => {
      nft.setDescription('New NFT Description')
      const description = nft.description

      expect(description).toBe('New NFT Description')
    })
  })

  describe('setCreator()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() => nft.setCreator('New Creator')).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT creator', () => {
      nft.setCreator('New NFT creator')
      const creator = nft.creator

      expect(creator).toBe('New NFT creator')
    })
  })

  describe('setAttributes()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() =>
        nft.setAttributes({
          newKey: 'newValue',
        }),
      ).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT attributes', () => {
      nft.setAttributes({newKey: 'newValue'})
      const attributes = nft.attributes

      expect(attributes).toHaveProperty('newKey')
      expect(attributes?.newKey).toBe('newValue')
    })
  })

  describe('setIpfsUrl()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()

      expect(() =>
        nft.setIpfsUrl('https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo95/nft.jpeg'),
      ).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT IPFS file URL', () => {
      nft.setIpfsUrl('https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo95/nft.jpeg')
      const ipfsUrl = nft.ipfsUrl

      expect(ipfsUrl).toBe(
        'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo95/nft.jpeg',
      )
    })
  })

  describe('_estimateGasForMintingNFT()', () => {
    it('should be able to estimate gas for minting an NFT', async () => {
      await sleep(500) // Sleep to avoid nonce issues
      const gasEstimation = await nft['_estimateGasForMintingNFT']({chainId: LOCALHOST2_CHAIN_ID})
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
