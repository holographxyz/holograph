import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../config/config.service'
import {Holograph} from '../../contracts/Holograph'
import {Providers} from '../../services/providers.service'
import {REGEX} from '../../utils/transformers'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

describe('Contract class: Holograph', () => {
  let config: Config
  let providersWrapper: Providers

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty('5')
    expect(multiProviders).toHaveProperty('80001')
  })

  it('should be able to get the Holograph wrapper class', () => {
    const holograph = new Holograph(config, providersWrapper)
    expect(holograph).toHaveProperty('getBridge')
    expect(holograph).toHaveProperty('getBridgeByNetworks')
    expect(holograph).toHaveProperty('getRegistryByNetworks')
  })

  it('getBridge(): should be able to get the correct bridge address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const holograph = new Holograph(config, providersWrapper)
    const bridgeAddress = await holograph.getBridge(chainId)
    expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
    expect(bridgeAddress).toBe('0xD85b5E176A30EdD1915D6728FaeBD25669b60d8b')
  })
})
