import {beforeAll, describe, expect, it} from 'vitest'

import {CxipERC721} from '../../contracts'
import {Providers} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

import {testConfigObject} from '../setup'

const FAKE_COLLECTION_ADDRESS = '0xAbCdEf0123456789ABCDEF0123456789abcdef01'

describe('Contract class: CxipERC721', () => {
  let providersWrapper: Providers
  let cxipERC721: CxipERC721
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    cxipERC721 = new CxipERC721(FAKE_COLLECTION_ADDRESS)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the CxipERC721 wrapper class', () => {
    expect(cxipERC721).toHaveProperty('estimateContractFunctionGas')
    expect(cxipERC721).toHaveProperty('cxipMint')
    expect(cxipERC721).toHaveProperty('exists')
    expect(cxipERC721).toHaveProperty('ownerOf')
  })

  // TODO: Do later
  describe('cxipMint()', () => {
    it.skip('should be able to mint an NFT', async () => {
      const chainId = chainIds[0]
    })
  })

  describe('exists()', () => {
    it.skip('should be able to check if an NFT exists', async () => {
      const chainId = chainIds[0]
    })
  })

  describe('ownerOf()', () => {
    it.skip('should be able to get the owner of an NFT', async () => {
      const chainId = chainIds[0]
    })
  })
})
