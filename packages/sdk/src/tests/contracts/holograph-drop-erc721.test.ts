import {beforeAll, describe, expect, it} from 'vitest'

import {HolographDropERC721} from '../../contracts'
import {Providers} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

import {testConfigObject, testConfig} from '../setup'

const FAKE_COLLECTION_ADDRESS = '0x9876543210987654321098765432109876543210'

describe('Contract class: HolographDropERC721', () => {
  let providersWrapper: Providers
  let holographDropERC721: HolographDropERC721
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    holographDropERC721 = new HolographDropERC721(FAKE_COLLECTION_ADDRESS)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the HolographDropERC721 wrapper class', () => {
    expect(holographDropERC721).toHaveProperty('estimateContractFunctionGas')
    expect(holographDropERC721).toHaveProperty('exists')
    expect(holographDropERC721).toHaveProperty('getHolographFeeWei')
    expect(holographDropERC721).toHaveProperty('getNativePrice')
    expect(holographDropERC721).toHaveProperty('ownerOf')
    expect(holographDropERC721).toHaveProperty('purchase')
  })

  // TODO: Do later
  describe('getHolographFeeWei()', () => {
    it.skip('should be able to get the holograph fee', async () => {
      const chainId = chainIds[0]
    })
  })

  describe('getNativePrice()', () => {
    it.skip('should be able to get the native price', async () => {
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

  describe('purchase()', () => {
    it.skip('should be able to mint an NFT', async () => {
      const chainId = chainIds[0]
    })
  })
})
