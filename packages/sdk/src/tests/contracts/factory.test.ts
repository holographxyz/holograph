import {beforeAll, describe, expect, it} from 'vitest'
import {networks} from '@holographxyz/networks'

import {Factory} from '../../contracts'
import {Providers, Config} from '../../services'

import {ONLY_ADMIN_ERROR_MESSAGE, configObject} from './utils'

//NOTICE: the expected values are for the development env
const expectedValues = {
  factoryAddress: '0x90425798cc0e33932f11edc3EeDBD4f3f88DFF64',
  holographAddress: '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97',
  registryAddress: '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB',
}

describe('Contract class: Factory', () => {
  let config: Config
  let providersWrapper: Providers
  let factory: Factory
  const chainIds = Object.keys(NETWORKS_MOCK).map(networkKey => Number(networks[networkKey].chain))

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    factory = new Factory(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(configObject.networks)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
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
    const chainId = Number(Object.keys(configObject.networks)[0])
    const factoryAddress = await factory.getAddress(chainId)
    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getHolograph(): should be able to get the correct Holograph Protocol address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const holographAddress = await factory.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getRegistry(): should be able to get the correct Registry address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const registryAddress = await factory.getRegistry(chainId)
    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  // TODO: Finish the following tests
  describe('setHolograph()', () => {
    it.skip('The admin should be able to set the Holograph Protocol address', async () => {
      const chainId = Number(Object.keys(configObject.networks)[0])
    })
    it('should revert if it is not the admin who is setting the Holograph Protocol address', async () => {
      const chainId = Number(Object.keys(configObject.networks)[0])
      await expect(() =>
        factory.setHolograph(chainId, '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97'),
      ).rejects.toThrowError(ONLY_ADMIN_ERROR_MESSAGE)
    })
  })

  describe('setRegistry()', () => {
    it.skip('The admin should be able to set the Registry address', async () => {
      const chainId = Number(Object.keys(configObject.networks)[0])
    })
    it('should revert if it is not the admin who is setting the Registry address', async () => {
      const chainId = Number(Object.keys(configObject.networks)[0])
      await expect(() =>
        factory.setRegistry(chainId, '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB'),
      ).rejects.toThrowError(ONLY_ADMIN_ERROR_MESSAGE)
    })
  })

  it.skip('deployHolographableContract(): should be able to deploy a holographable contract', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('deployHolographableContractMultiChain(): should be able to deploy a holographable contract in multiple chains', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('bridgeIn(): should be able to bridge in a token', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('bridgeOut(): should be able to bridge out a token', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })
})
