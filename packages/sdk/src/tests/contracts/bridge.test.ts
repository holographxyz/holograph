import {beforeAll, describe, expect, it} from 'vitest'

import {Bridge} from '../../contracts'
import {Providers, Config} from '../../services'
import {REGEX} from '../../utils/transformers'
import {configObject} from './utils'

//NOTICE: the expected values are for the development env
const expectedValues = {
  bridgeAddress: '0x747f62b66cec00AC36E33CFda63238aEdc8a08d8',
  holographAddress: '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97',
  factoryAddress: '0x90425798cc0e33932f11edc3EeDBD4f3f88DFF64',
  operatorAddress: '0xe5CBE551D7717141f430fC1dC3bD71009BedE017',
  registryAddress: '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB',
  jobNonce: {
    5: '609',
    80001: '133',
  },
}

describe('Contract class: Bridge', () => {
  let config: Config
  let providersWrapper: Providers
  let bridge: Bridge
  const chainIds = Object.keys(NETWORKS_MOCK).map(chainName => CHAIN_ID_BY_CHAIN_NAME[chainName])

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    bridge = new Bridge(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(configObject.networks)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the bridge wrapper class', () => {
    expect(bridge).toHaveProperty('getAddress')
    expect(bridge).toHaveProperty('getHolograph')
    expect(bridge).toHaveProperty('getHolographByNetworks')
    expect(bridge).toHaveProperty('getFactory')
    expect(bridge).toHaveProperty('getFactoryByNetworks')
    expect(bridge).toHaveProperty('getJobNonce')
    expect(bridge).toHaveProperty('getJobNonceByNetworks')
    expect(bridge).toHaveProperty('getOperator')
    expect(bridge).toHaveProperty('getOperatorByNetworks')
    expect(bridge).toHaveProperty('getRegistry')
    expect(bridge).toHaveProperty('getRegistryByNetworks')
    expect(bridge).toHaveProperty('getMessageFee')
    expect(bridge).toHaveProperty('getBridgeOutRequestPayload')
    expect(bridge).toHaveProperty('setHolograph')
    expect(bridge).toHaveProperty('setFactory')
    expect(bridge).toHaveProperty('setOperator')
    expect(bridge).toHaveProperty('setRegistry')
    expect(bridge).toHaveProperty('bridgeInRequest')
    expect(bridge).toHaveProperty('bridgeOutRequest')
    expect(bridge).toHaveProperty('revertedBridgeOutRequest')
  })

  it('should be able to get the correct bridge contract address according to the environment and chainId', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const bridgeAddress = await bridge.getAddress(chainId)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getHolograph(): should be able to get the correct Holograph Protocol address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const holographAddress = await bridge.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getFactory(): should be able to get the correct Factory address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const factoryAddress = await bridge.getFactory(chainId)
    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getJobNonce(): should be able to get the correct job nonce', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const jobNonce = await bridge.getJobNonce(chainId)
    expect(jobNonce).toBe(expectedValues.jobNonce[chainId])
  })

  it('getOperator(): should be able to get the correct Operator address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const operatorAddress = await bridge.getOperator(chainId)
    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getRegistry(): should be able to get the correct Registry address', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    const registryAddress = await bridge.getRegistry(chainId)
    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getHolographByNetworks(): should be able to get the correct Holograph address per network', async () => {
    const holographAddressByNetworks = await bridge.getHolographByNetworks()
    expect(Object.keys(holographAddressByNetworks)).toEqual(Object.keys(configObject.networks))

    Object.values(holographAddressByNetworks).forEach(holographAddress => {
      expect(holographAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(holographAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getFactoryByNetworks(): should be able to get the correct Factory address per network', async () => {
    const factoryAddressByNetworks = await bridge.getFactoryByNetworks()
    expect(Object.keys(factoryAddressByNetworks)).toEqual(Object.keys(configObject.networks))

    Object.values(factoryAddressByNetworks).forEach(factoryAddress => {
      expect(factoryAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(factoryAddress).toBe(expectedValues.factoryAddress)
    })
  })

  it('getJobNonceByNetworks(): should be able to get the correct job nonce per network', async () => {
    const jobNonceByNetworks = await bridge.getJobNonceByNetworks()
    const networksArray = Object.keys(configObject.networks)
    expect(Object.keys(jobNonceByNetworks)).toEqual(networksArray)

    Object.values(jobNonceByNetworks).forEach((jobNonce, index) => {
      expect(Number(jobNonce)).toBeGreaterThan(0)
      expect(jobNonce).toBe(expectedValues.jobNonce[chainIds[index]])
    })
  })

  it('getOperatorByNetworks(): should be able to get the correct Operator address per network', async () => {
    const operatorAddressByNetworks = await bridge.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(Object.keys(configObject.networks))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistryByNetworks(): should be able to get the correct Registry address per network', async () => {
    const registryAddressByNetworks = await bridge.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(Object.keys(configObject.networks))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  // TODO: Finish the following tests
  it.skip('getMessageFee(): should be able to get the correct message fee', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('getBridgeOutRequestPayload(): should be able to get the correct bridge out request payload', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  describe.skip('setHolograph():', () => {
    it('Should allow the admin to update the Holograph Protocol contract address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setFactory():', () => {
    it('Should allow the admin to update the Holograph Factory module address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setOperator():', () => {
    it('Should allow the admin to update the Holograph Operator contract address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setRegistry():', () => {
    it('Should allow the admin to update the Holograph Registry contract address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  it.skip('bridgeInRequest(): should be able to bridge in request', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('bridgeOutRequest(): should be able to bridge out request', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('revertedBridgeOutRequest(): should be able to revert the bridge out request', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })
})
