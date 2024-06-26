import {beforeAll, describe, expect, it} from 'vitest'

import {OpenEditionERC721Contract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

const FAKE_CONTRACT_ADDRESS = '0x9876543210987654321098765432109876543210'

describe('Contract class: OpenEditionERC721Contract', () => {
  let providersWrapper: Providers
  let holographOpenEditionERC721: OpenEditionERC721Contract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    holographOpenEditionERC721 = new OpenEditionERC721Contract(FAKE_CONTRACT_ADDRESS)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the OpenEditionERC721Contract wrapper class', () => {
    expect(holographOpenEditionERC721).toHaveProperty('estimateContractFunctionGas')
    expect(holographOpenEditionERC721).toHaveProperty('exists')
    expect(holographOpenEditionERC721).toHaveProperty('getHolographFeeWei')
    expect(holographOpenEditionERC721).toHaveProperty('getNativePrice')
    expect(holographOpenEditionERC721).toHaveProperty('ownerOf')
    expect(holographOpenEditionERC721).toHaveProperty('purchase')
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
