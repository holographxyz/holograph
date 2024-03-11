import {beforeEach, describe, expect, it} from 'vitest'

import {HolographMoeERC721DropV1} from '../../assets/collection-moe'
import {generateRandomSalt} from '../../utils/helpers'
import {LOCALHOST2_CHAIN_ID} from '../setup'

describe('Asset class: HolographMoeERC721DropV1', () => {
  let collection: HolographMoeERC721DropV1

  beforeEach(() => {
    collection = new HolographMoeERC721DropV1({
      collectionInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 1000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsUrl: 'ipfs://fileurl.com/file://',
        ipfsImageCid: 'QmQJNvXvNqfDAV4srQ8dRr8s4FYBKB67RnWhvWLvE72osu',
      },
      saleConfig: {
        maxSalePurchasePerAddress: 10,
        publicSaleStart: '2025-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-02T00:00:00Z',
        publicSalePrice: 10000,
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
  })

  it('should be able to get the collection wrapper class', () => {
    expect(collection).toHaveProperty('getCollectionInfo')
    expect(collection).toHaveProperty('_getRegistryAddress')
    expect(collection).toHaveProperty('_getMetadataRendererAddress')
    expect(collection).toHaveProperty('_generateMetadataRendererInitCode')
    expect(collection).toHaveProperty('_generateHolographDropERC721InitCodeV1')
    expect(collection).toHaveProperty('_generateHolographDropERC721InitCodeV2')
    expect(collection).toHaveProperty('_generateHolographERC721InitCode')
    expect(collection).toHaveProperty('_getCollectionPayload')
    expect(collection).toHaveProperty('_getCollectionPayloadWithVersion')
    expect(collection).toHaveProperty('signDeploy')
    expect(collection).toHaveProperty('estimateGasForDeployingCollection')
    expect(collection).toHaveProperty('deploy')
    expect(collection).toHaveProperty('deployBatch')
  })

  describe('getCollectionInfo()', () => {
    it('should be able to get the collection info', () => {
      const info = collection.getCollectionInfo()

      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('description')
      expect(info).toHaveProperty('symbol')
      expect(info).toHaveProperty('royaltiesBps')
      expect(info).toHaveProperty('tokenType')
      expect(info).toHaveProperty('salt')
      expect(info).toHaveProperty('ipfsUrl')
      expect(info).toHaveProperty('ipfsImageCid')
      expect(info).toHaveProperty('maxSalePurchasePerAddress')
      expect(info).toHaveProperty('publicSaleStart')
      expect(info).toHaveProperty('publicSaleEnd')
      expect(info).toHaveProperty('publicSalePrice')
      expect(info.name).toBe('NFTs Without Boundaries')
      expect(info.description).toBe('Probably nothing')
      expect(info.symbol).toBe('HOLO')
      expect(info.royaltiesBps).toBe(1000)
      expect(info.tokenType).toBe('ERC721')
      expect(info.ipfsUrl).toBe('ipfs://fileurl.com/file://')
      expect(info.ipfsImageCid).toBe('QmQJNvXvNqfDAV4srQ8dRr8s4FYBKB67RnWhvWLvE72osu')
      expect(info.maxSalePurchasePerAddress).toBe(10)
      expect(info.publicSaleStart).toBe('2025-01-01T00:00:00Z')
      expect(info.publicSaleEnd).toBe('2025-01-02T00:00:00Z')
      expect(info.publicSalePrice).toBe(10000)
    })
  })
})
