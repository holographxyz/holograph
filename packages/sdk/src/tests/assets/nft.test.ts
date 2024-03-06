import {beforeEach, describe, expect, it} from 'vitest'

import {NFT, NOT_MINTED_NFT_ERROR_MESSAGE, UPDATE_MINTED_NFT_ERROR_MESSAGE} from '../../assets/nft'

const expectedTokenId = {
  hex: '0x000000060000000000000000000000000000000000000000000000000000a4f4',
  decimal: '161759680002903838768002090522117784041822866535243434886621661537524',
  part: {
    chainId: '6',
    decimal: '42228',
    hex: '0xa4f4',
  },
}

describe('Asset class: NFT', () => {
  let nft: NFT

  beforeEach(() => {
    nft = new NFT({
      name: 'NFTs Without Boundaries',
      description: 'Probably nothing',
      creator: 'Holograph Protocol',
      attributes: {
        key: 'value',
        anotherKey: 'anotherValue',
      },
    })
    nft.setTokenId(expectedTokenId.decimal)
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
    expect(nft).toHaveProperty('mint')
    expect(nft).toHaveProperty('uploadFileToIpfs')
    expect(nft).toHaveProperty('setOwner')
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
      nft.toggleIsMinted()
      nft.setChainId(6)
      const tokenId = nft.getTokenId()
      expect(tokenId).toHaveProperty('decimal')
      expect(tokenId).toHaveProperty('hex')
      expect(tokenId).toHaveProperty('part')
      expect(tokenId.part).toHaveProperty('chainId')
      expect(tokenId.part).toHaveProperty('decimal')
      expect(tokenId.part).toHaveProperty('hex')
      expect(tokenId.decimal).toEqual(expectedTokenId.decimal)
      expect(tokenId.hex).toEqual(expectedTokenId.hex)
      expect(tokenId.part.chainId).toEqual(expectedTokenId.part.chainId)
      expect(tokenId.part.decimal).toEqual(expectedTokenId.part.decimal)
      expect(tokenId.part.hex).toEqual(expectedTokenId.part.hex)
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
      expect(() => nft.setFile('https://newfileurl.com/file')).toThrowError(UPDATE_MINTED_NFT_ERROR_MESSAGE)
    })

    it('should be able to set the NFT file', () => {
      nft.setFile('https://fileurl.com/file')
      const file = nft.getFile()
      expect(file).toBe('https://fileurl.com/file')
    })
  })

  describe('mint()', () => {
    it.skip('should be able to mint an NFT', () => {})
  })

  describe('uploadFileToIpfs()', () => {
    it.skip('should be able to upload an NFT file to IPFS', () => {})
  })

  describe('setOwner', () => {
    it.skip('should be able to get the NFT owner address', () => {})
  })
})
