import {beforeAll, describe, expect, it} from 'vitest'

import {Factory} from '../../contracts'
import {Providers} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

import {ONLY_ADMIN_ERROR_MESSAGE, testConfigObject, testConfig, localhostContractAddresses} from '../setup'
import {Addresses} from '../../constants/addresses'
import {Address} from 'viem'

const expectedValues = {
  holographAddress: localhostContractAddresses.holograph,
  factoryAddress: localhostContractAddresses.holographFactory,
  registryAddress: localhostContractAddresses.holographRegistry,
}

describe('Contract class: Factory', () => {
  let providersWrapper: Providers
  let factory: Factory
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers(testConfig)
    factory = new Factory(testConfig)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the Factory wrapper class', () => {
    expect(factory).toHaveProperty('getAddress')
    expect(factory).toHaveProperty('getHolograph')
    expect(factory).toHaveProperty('getRegistry')
    expect(factory).toHaveProperty('setHolograph')
    expect(factory).toHaveProperty('setRegistry')
    expect(factory).toHaveProperty('deployHolographableContract')
    expect(factory).toHaveProperty('deployHolographableContractMultiChain')
    expect(factory).toHaveProperty('bridgeIn')
    expect(factory).toHaveProperty('bridgeOut')
  })

  it('should be able to get the correct Factory contract address according to the environment and chainId', async () => {
    const chainId = chainIds[0]
    const factoryAddress = await factory.getAddress(chainId)
    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getHolograph(): should be able to get the correct Holograph Protocol address', async () => {
    const chainId = chainIds[0]
    const holographAddress = await factory.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getRegistry(): should be able to get the correct Registry address', async () => {
    const chainId = chainIds[0]
    const registryAddress = await factory.getRegistry(chainId)
    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  // TODO: Finish the following tests
  describe('setHolograph()', () => {
    it('The admin should be able to set the Holograph Protocol address', async () => {
      const chainId = chainIds[0]
      await expect(() => factory.setHolograph(chainId, expectedValues.holographAddress as Address)).not.toThrowError(
        ONLY_ADMIN_ERROR_MESSAGE,
      )
    })

    it('should revert if it is not the admin who is setting the Holograph Protocol address', async () => {
      const chainId = chainIds[0]
      await expect(() => factory.setHolograph(chainId, Addresses.zero(), {account: 'account1'})).rejects.toThrowError(
        ONLY_ADMIN_ERROR_MESSAGE,
      )
    })
  })

  describe('setRegistry()', () => {
    it('The admin should be able to set the Registry address', async () => {
      const chainId = chainIds[0]
      await expect(() => factory.setRegistry(chainId, expectedValues.registryAddress as Address)).not.toThrowError(
        ONLY_ADMIN_ERROR_MESSAGE,
      )
    })
    it('should revert if it is not the admin who is setting the Registry address', async () => {
      const chainId = chainIds[0]
      await expect(() => factory.setRegistry(chainId, Addresses.zero(), {account: 'account1'})).rejects.toThrowError(
        ONLY_ADMIN_ERROR_MESSAGE,
      )
    })
  })

  it.skip('deployHolographableContract(): should be able to deploy a holographable contract', async () => {
    const chainId = chainIds[0]
  })

  it.skip('deployHolographableContractMultiChain(): should be able to deploy a holographable contract in multiple chains', async () => {
    const chainId = chainIds[0]
  })

  it.skip('bridgeIn(): should be able to bridge in a token', async () => {
    const chainId = chainIds[0]
  })

  it.skip('bridgeOut(): should be able to bridge out a token', async () => {
    const chainId = chainIds[0]
  })
})
