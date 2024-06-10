import {beforeAll, describe, expect, it} from 'vitest'

import {CxipERC721Contract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

const FAKE_CONTRACT_ADDRESS = '0xAbCdEf0123456789ABCDEF0123456789abcdef01'

describe('Contract class: CxipERC721Contract', () => {
  let providersWrapper: Providers
  let cxipERC721: CxipERC721Contract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    cxipERC721 = new CxipERC721Contract(FAKE_CONTRACT_ADDRESS)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the CxipERC721Contract wrapper class', () => {
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
