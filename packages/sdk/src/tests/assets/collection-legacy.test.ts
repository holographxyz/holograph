import {beforeEach, describe, expect, it} from 'vitest'

import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {generateRandomSalt} from '../../utils/helpers'
import {LOCALHOST2_CHAIN_ID} from '../setup'

describe('Asset class: HolographLegacyCollection', () => {
  let collection: HolographLegacyCollection

  beforeEach(() => {
    collection = new HolographLegacyCollection({
      collectionInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 1000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
  })

  it('should be able to get the collection wrapper class', () => {
    expect(collection).toHaveProperty('getCollectionInfo')
    expect(collection).toHaveProperty('_getFactoryAddress')
    expect(collection).toHaveProperty('_getRegistryAddress')
    expect(collection).toHaveProperty('_getPredictedCollectionAddress')
    expect(collection).toHaveProperty('_generateInitCode')
    expect(collection).toHaveProperty('_getCollectionPayload')
    expect(collection).toHaveProperty('signDeploy')
    expect(collection).toHaveProperty('estimateGasForDeployingCollection')
    expect(collection).toHaveProperty('deploy')
    expect(collection).toHaveProperty('deployBatch')
  })

  describe('getCollectionInfo()', () => {
    it('should be able to get the collection info', () => {
      const collectionInfo = collection.getCollectionInfo()
      expect(collectionInfo).toHaveProperty('name')
      expect(collectionInfo).toHaveProperty('description')
      expect(collectionInfo).toHaveProperty('symbol')
      expect(collectionInfo).toHaveProperty('royaltiesBps')
      expect(collectionInfo).toHaveProperty('tokenType')
      expect(collectionInfo).toHaveProperty('salt')
      expect(collectionInfo.name).toBe('NFTs Without Boundaries')
      expect(collectionInfo.description).toBe('Probably nothing')
      expect(collectionInfo.symbol).toBe('HOLO')
      expect(collectionInfo.royaltiesBps).toBe(1000)
      expect(collectionInfo.tokenType).toBe('ERC721')
    })
  })
})
