import {beforeAll, beforeEach, describe, expect, it} from 'vitest'

import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {NFT} from '../../assets/nft'
import {NOT_MINTED_NFT_ERROR_MESSAGE} from '../../errors/assets/not-minted-nft.error'
import {UPDATE_MINTED_NFT_ERROR_MESSAGE} from '../../errors/assets/update-minted-nft.error'
import {HolographWallet} from '../../services'
import {LOCALHOST2_CHAIN_ID, configObject} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

const expectedTokenId = {
  hex: '0x000000060000000000000000000000000000000000000000000000000000a4f4',
  decimal: '161759680002903838768002090522117784041822866535243434886621661537524',
  part: {
    chainId: LOCALHOST2_CHAIN_ID,
    tokenNumber: '42228',
  },
}

describe('Asset class: NFT', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})

  let collection: HolographLegacyCollection
  let nft: NFT

  beforeAll(async () => {
    collection = new HolographLegacyCollection(configObject, {
      collectionInfo: {
        name: 'My First Collection',
        description: 'Nothing',
        symbol: 'MFC',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
    await sleep(500) // Sleep to avoid nonce issues
    const signatureData = await collection.signDeploy(wallet)
    await collection.deploy(signatureData)
  })

  beforeEach(() => {
    nft = new NFT(configObject, {
      chainId: LOCALHOST2_CHAIN_ID,
      collectionAddress: collection.predictedCollectionAddress!,
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
    expect(nft).toHaveProperty('getMetadata')
    expect(nft).toHaveProperty('getName')
    expect(nft).toHaveProperty('getDescription')
    expect(nft).toHaveProperty('getCreator')
    expect(nft).toHaveProperty('getAttributes')
    expect(nft).toHaveProperty('getOwner')
    expect(nft).toHaveProperty('getFile')
    expect(nft).toHaveProperty('getTokenId')
    expect(nft).toHaveProperty('setMetadata')
    expect(nft).toHaveProperty('setName')
    expect(nft).toHaveProperty('setDescription')
    expect(nft).toHaveProperty('setAttributes')
    expect(nft).toHaveProperty('setCreator')
    expect(nft).toHaveProperty('setFile')
    expect(nft).toHaveProperty('setOwner')
    expect(nft).toHaveProperty('_estimateGasForMintingNft')
    expect(nft).toHaveProperty('_estimateGasForMintingMoeNft')
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('moeMint')
    expect(nft).toHaveProperty('uploadFileToIpfs')
  })

  describe('getMetadata()', () => {
    it('should be able to get the NFT metadata', () => {
      const metadata = nft.getMetadata()
      expect(metadata).toHaveProperty('name')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('creator')
      expect(metadata).toHaveProperty('attributes')
      expect(metadata.name).toBe('NFTs Without Boundaries')
      expect(metadata.description).toBe('Probably nothing')
      expect(metadata.creator).toBe('Holograph Protocol')
      expect(metadata.attributes).toHaveProperty('key')
      expect(metadata.attributes).toHaveProperty('anotherKey')
      expect(metadata.attributes?.key).toBe('value')
      expect(metadata.attributes?.anotherKey).toBe('anotherValue')
    })
  })

  describe('getName()', () => {
    it('should be able to get the NFT name', () => {
      const name = nft.getName()
      expect(name).toBe('NFTs Without Boundaries')
    })
  })

  describe('getDescription()', () => {
    it('should be able to get the NFT description', () => {
      const description = nft.getDescription()
      expect(description).toBe('Probably nothing')
    })
  })

  describe('getCreator()', () => {
    it('should be able to get the NFT creator', () => {
      const creator = nft.getCreator()
      expect(creator).toBe('Holograph Protocol')
    })
  })

  describe('getAttributes()', () => {
    it('should be able to get the NFT attributes', () => {
      const attributes = nft.getAttributes()
      expect(attributes).toHaveProperty('key')
      expect(attributes).toHaveProperty('anotherKey')
      expect(attributes?.key).toBe('value')
      expect(attributes?.anotherKey).toBe('anotherValue')
    })
  })

  describe('getOwner()', () => {
    it('should be able to get the NFT owner', () => {
      const owner = nft.getOwner()
      expect(owner).toBe(undefined)
    })
  })

  describe('getFile()', () => {
    it('should be able to get the NFT file', () => {
      const file = nft.getFile()
      expect(file).toBe(undefined)
    })
  })

  describe('getTokenId()', () => {
    it('should fail if the NFT has not been minted', () => {
      expect(() => nft.getTokenId()).toThrowError(NOT_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to get the NFT tokenId', () => {
      nft.setTokenId(expectedTokenId.decimal)
      nft.toggleIsMinted()
      nft.setChainId(6)
      const tokenId = nft.getTokenId()
      expect(tokenId).toHaveProperty('decimal')
      expect(tokenId).toHaveProperty('hex')
      expect(tokenId).toHaveProperty('part')
      expect(tokenId.part).toHaveProperty('chainId')
      expect(tokenId.part).toHaveProperty('tokenNumber')
      expect(tokenId.decimal).toEqual(expectedTokenId.decimal)
      expect(tokenId.hex).toEqual(expectedTokenId.hex)
      // expect(tokenId.part.chainId).toEqual(expectedTokenId.part.chainId)
      expect(tokenId.part.chainId).toEqual('6')
      expect(tokenId.part.tokenNumber).toEqual(expectedTokenId.part.tokenNumber)
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
      const newMetadata = nft.getMetadata()
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
      const name = nft.getName()
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
      const description = nft.getDescription()
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
      const creator = nft.getCreator()
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
      const attributes = nft.getAttributes()
      expect(attributes).toHaveProperty('newKey')
      expect(attributes?.newKey).toBe('newValue')
    })
  })

  describe('setFile()', () => {
    it('should fail if the NFT has been deployed', () => {
      nft.toggleIsMinted()
      expect(() => nft.setFile('ipfs://newfileurl.com/file')).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT file', () => {
      nft.setFile('ipfs://fileurl.com/file')
      const file = nft.getFile()
      expect(file).toBe('ipfs://fileurl.com/file')
    })
  })

  describe('_estimateGasForMintingNft()', () => {
    it.skip('should be able to estimate gas for minting an NFT', () => {})
  })

  describe('_estimateGasForMintingMoeNft()', () => {
    it.skip('should be able to estimate gas for minting a MOE NFT', () => {})
  })

  describe('mint()', () => {
    it('should be able to mint an NFT', async () => {})
  })

  describe('moeMint()', () => {
    it.skip('should be able to mint a MOE NFT', () => {})
  })

  describe('uploadFileToIpfs()', () => {
    it.skip('should be able to upload an NFT file to IPFS', () => {})
  })

  describe('setOwner', () => {
    it.skip('should be able to get the NFT owner address', () => {})
  })
})
