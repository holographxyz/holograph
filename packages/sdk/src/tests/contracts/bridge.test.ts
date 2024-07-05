import {beforeAll, describe, expect, it} from 'vitest'
import {getNetworkByChainId} from '@holographxyz/networks'

import {BridgeContract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject, localhostContractAddresses} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'
import {MAX_GAS_VALUE} from '../../utils/gas'

const expectedValues = {
  holographAddress: localhostContractAddresses.holograph,
  bridgeAddress: localhostContractAddresses.holographBridge,
  factoryAddress: localhostContractAddresses.holographFactory,
  operatorAddress: localhostContractAddresses.holographOperator,
  registryAddress: localhostContractAddresses.holographRegistry,
}

describe('Contract class: BridgeContract', () => {
  let providersWrapper: Providers
  let bridge: BridgeContract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    bridge = new BridgeContract()
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
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
    const chainId = chainIds[0]
    const bridgeAddress = await bridge.getAddress(chainId)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getHolograph(): should be able to get the correct Holograph Protocol address', async () => {
    const chainId = chainIds[0]
    const holographAddress = await bridge.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getFactory(): should be able to get the correct Factory address', async () => {
    const chainId = chainIds[0]
    const factoryAddress = await bridge.getFactory(chainId)
    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getJobNonce(): should be able to get the job nonce', async () => {
    const chainId = chainIds[0]
    const jobNonce = await bridge.getJobNonce(chainId)
    expect(Number(jobNonce)).toBeGreaterThanOrEqual(0)
  })

  it('getOperator(): should be able to get the correct Operator address', async () => {
    const chainId = chainIds[0]
    const operatorAddress = await bridge.getOperator(chainId)
    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getRegistry(): should be able to get the correct Registry address', async () => {
    const chainId = chainIds[0]
    const registryAddress = await bridge.getRegistry(chainId)
    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getHolographByNetworks(): should be able to get the correct Holograph address per network', async () => {
    const holographAddressByNetworks = await bridge.getHolographByNetworks()
    expect(Object.keys(holographAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(holographAddressByNetworks).forEach(holographAddress => {
      expect(holographAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(holographAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getFactoryByNetworks(): should be able to get the correct Factory address per network', async () => {
    const factoryAddressByNetworks = await bridge.getFactoryByNetworks()
    expect(Object.keys(factoryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(factoryAddressByNetworks).forEach(factoryAddress => {
      expect(factoryAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(factoryAddress).toBe(expectedValues.factoryAddress)
    })
  })

  it('getJobNonceByNetworks(): should be able to get the job nonce per network', async () => {
    const jobNonceByNetworks = await bridge.getJobNonceByNetworks()
    expect(Object.keys(jobNonceByNetworks)).toEqual(chainIds.map(String))

    Object.values(jobNonceByNetworks).forEach((jobNonce, index) => {
      expect(Number(jobNonce)).toBeGreaterThanOrEqual(0)
    })
  })

  it('getOperatorByNetworks(): should be able to get the correct Operator address per network', async () => {
    const operatorAddressByNetworks = await bridge.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistryByNetworks(): should be able to get the correct Registry address per network', async () => {
    const registryAddressByNetworks = await bridge.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  // TODO: This reverts
  it.skip('getMessageFee(): should be able to get the correct message fee', async () => {
    const chainId = chainIds[0]
    const toChainId = chainIds[1]

    const fees = await bridge.getMessageFee(
      chainId,
      getNetworkByChainId(toChainId).holographId,
      MAX_GAS_VALUE,
      MAX_GAS_VALUE,
      '0x',
    )
  })

  it.skip('getBridgeOutRequestPayload(): should be able to get the correct bridge out request payload', async () => {
    const chainId = chainIds[0]
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
    const chainId = chainIds[0]
  })

  it.skip('bridgeOutRequest(): should be able to bridge out request', async () => {
    const chainId = chainIds[0]
  })

  it.skip('revertedBridgeOutRequest(): should be able to revert the bridge out request', async () => {
    const chainId = chainIds[0]
  })
})
