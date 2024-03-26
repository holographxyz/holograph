import {beforeAll, describe, expect, it} from 'vitest'

import {CxipERC721} from '../../contracts'
import {Providers, Config} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

import {configObject} from '../setup'

const FAKE_COLLECTION_ADDRESS = '0xAbCdEf0123456789ABCDEF0123456789abcdef01'

describe('Contract class: CxipERC721', () => {
  let config: Config
  let providersWrapper: Providers
  let cxipERC721: CxipERC721
  const chainIds = getChainIdsByNetworksConfig(configObject.networks)

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    cxipERC721 = new CxipERC721(config, FAKE_COLLECTION_ADDRESS)
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
