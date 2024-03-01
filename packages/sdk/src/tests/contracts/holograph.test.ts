import {beforeAll, describe, expect, it} from 'vitest'

import {Holograph} from '../../contracts'
import {Providers, Config} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'

import {configObject} from './utils'

//NOTICE: the expected values are for the development env -> 0x8dd0A4D129f03F1251574E545ad258dE26cD5e97
const expectedValues = {
  contractAddress: '0x8dd0a4d129f03f1251574e545ad258de26cd5e97',
  hTokenAddress: '0x01F3f1Ce33592a548a2EdF047Fe331f8A5Eb4389',
  bridgeAddress: '0x747f62b66cec00AC36E33CFda63238aEdc8a08d8',
  factoryAddress: '0x90425798cc0e33932f11edc3EeDBD4f3f88DFF64',
  registryAddress: '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB',
  treasuryAddress: '0x98Ad6d9Ff18C5f3ADf7aa225A374C56e246094eF',
  operatorAddress: '0xe5CBE551D7717141f430fC1dC3bD71009BedE017',
  interfacesAddress: '0xD9E5f062A539B421af91013a401F93677D439ee1',
  holographChainId: {5: '4000000011', 80001: '4000000004'},
}

describe('Contract class: Holograph', () => {
  let config: Config
  let providersWrapper: Providers
  let holograph: Holograph
  const chainIds = getChainIdsByNetworksConfig(configObject.networks)

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    holograph = new Holograph(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the Holograph wrapper class', () => {
    expect(holograph).toHaveProperty('getAddress')
    expect(holograph).toHaveProperty('getBridge')
    expect(holograph).toHaveProperty('getBridgeByNetworks')
    expect(holograph).toHaveProperty('getRegistryByNetworks')
  })

  it('should be able to get the correct Holograph contract address according to the environment and chainId', () => {
    expect(holograph.getAddress()).toBe(expectedValues.contractAddress)
  })

  it('getBridge(): should be able to get the correct HolographBridge address', async () => {
    const chainId = chainIds[0]
    const bridgeAddress = await holograph.getBridge(chainId)
    expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await holograph.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getChainId(): should be able to get the correct chainId', async () => {
    const chainId = chainIds[0]
    const holographChainId = await holograph.getChainId(Number(chainId))

    expect(holographChainId).toBe(String(chainId))
  })

  it('getChainIdByNetworks(): should be able to get the correct chainId per network', async () => {
    const holographChainIdByNetworks = await holograph.getChainIdByNetworks()
    expect(Object.keys(holographChainIdByNetworks)).toEqual(chainIds.map(String))
    expect(Object.values(holographChainIdByNetworks)).toEqual(chainIds.map(String))
  })

  it('getHolographChainId(): should be able to get the correct holographChainId', async () => {
    const chainId = chainIds[0]
    const holographChainId = await holograph.getHolographChainId(chainId)

    expect(holographChainId).toBe(expectedValues.holographChainId[chainId])
  })

  it('getHolographChainIdByNetworks(): should be able to get the correct holographChainId per network', async () => {
    const holographChainIdByNetworks = await holograph.getHolographChainIdByNetworks()
    expect(Object.keys(holographChainIdByNetworks)).toEqual(chainIds.map(String))
    expect(Object.values(holographChainIdByNetworks)).toEqual(Object.values(expectedValues.holographChainId))
  })

  it('getFactory(): should be able to get the correct HolographFactory address', async () => {
    const chainId = chainIds[0]
    const factoryAddress = await holograph.getFactory(chainId)

    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getFactoryByNetworks(): should be able to get the correct HolographFactory address per network', async () => {
    const factoryAddressByNetworks = await holograph.getFactoryByNetworks()
    expect(Object.keys(factoryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(factoryAddressByNetworks).forEach(factoryAddress => {
      expect(factoryAddress).toBe(expectedValues.factoryAddress)
    })
  })

  it('getFactory(): should be able to get the correct HolographFactory address', async () => {
    const chainId = chainIds[0]
    const factoryAddress = await holograph.getFactory(chainId)

    expect(factoryAddress).toBe(expectedValues.factoryAddress)
  })

  it('getFactoryByNetworks(): should be able to get the correct HolographFactory address per network', async () => {
    const factoryAddressByNetworks = await holograph.getFactoryByNetworks()
    expect(Object.keys(factoryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(factoryAddressByNetworks).forEach(factoryAddress => {
      expect(factoryAddress).toBe(expectedValues.factoryAddress)
    })
  })

  it('getInterfaces(): should be able to get the correct HolographInterfaces address', async () => {
    const chainId = chainIds[0]
    const interfacesAddress = await holograph.getInterfaces(chainId)

    expect(interfacesAddress).toBe(expectedValues.interfacesAddress)
  })

  it('getInterfacesByNetworks(): should be able to get the correct HolographInterfaces address per network', async () => {
    const interfacesAddressByNetworks = await holograph.getInterfacesByNetworks()
    expect(Object.keys(interfacesAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(interfacesAddressByNetworks).forEach(interfacesAddress => {
      expect(interfacesAddress).toBe(expectedValues.interfacesAddress)
    })
  })

  it('getOperator(): should be able to get the correct HolographOperator address', async () => {
    const chainId = chainIds[0]
    const operatorAddress = await holograph.getOperator(chainId)

    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await holograph.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistry(): should be able to get the correct HolographRegistry address', async () => {
    const chainId = chainIds[0]
    const registryAddress = await holograph.getRegistry(chainId)

    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await holograph.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  it('getTreasury(): should be able to get the correct HolographTreasury address', async () => {
    const chainId = chainIds[0]
    const treasuryAddress = await holograph.getTreasury(chainId)

    expect(treasuryAddress).toBe(expectedValues.treasuryAddress)
  })

  it('getTreasuryByNetworks(): should be able to get the correct HolographTreasury address per network', async () => {
    const treasuryAddressByNetworks = await holograph.getTreasuryByNetworks()
    expect(Object.keys(treasuryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(treasuryAddressByNetworks).forEach(treasuryAddress => {
      expect(treasuryAddress).toBe(expectedValues.treasuryAddress)
    })
  })

  it('getUtilityToken(): should be able to get the correct utility token address', async () => {
    const chainId = chainIds[0]
    const utilityTokenAddress = await holograph.getUtilityToken(chainId)

    expect(utilityTokenAddress).toBe(expectedValues.hTokenAddress)
  })

  it('getUtilityTokenByNetworks(): should be able to get the correct utility token address per network', async () => {
    const utilityTokenAddressByNetworks = await holograph.getUtilityTokenByNetworks()
    expect(Object.keys(utilityTokenAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(utilityTokenAddressByNetworks).forEach(utilityTokenAddress => {
      expect(utilityTokenAddress).toBe(expectedValues.hTokenAddress)
    })
  })
})
