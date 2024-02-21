import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../services/config.service'
import {Factory} from '../../contracts'
import {Providers} from '../../services'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

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

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    factory = new Factory(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(NETWORKS_MOCK)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the Factory wrapper class', () => {
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
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const factoryAddress = await factory.getAddress(chainId)
    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getHolograph(): should be able to get the correct Holograph Protocol address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const holographAddress = await factory.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getRegistry(): should be able to get the correct Registry address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const registryAddress = await factory.getRegistry(chainId)
    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  // TODO: Finish the following tests
  it.skip('setHolograph(): should be able to set the correct Holograph Protocol address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setRegistry(): should be able to set the correct Registry address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('deployHolographableContract(): should be able to deploy a holographable contract', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('deployHolographableContractMultiChain(): should be able to deploy a holographable contract in multiple chains', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('bridgeIn(): should be able to bridge in a token', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('bridgeOut(): should be able to bridge out a token', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })
})
