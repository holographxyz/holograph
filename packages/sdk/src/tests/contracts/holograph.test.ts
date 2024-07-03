import {beforeAll, describe, expect, it} from 'vitest'

import {HolographContract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject, localhostContractAddresses} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'

//NOTICE: the expected values are for the development env -> 0x8dd0A4D129f03F1251574E545ad258dE26cD5e97
const expectedValues = {
  contractAddress: localhostContractAddresses.holograph,
  hTokenAddress: localhostContractAddresses.holographUtilityToken,
  bridgeAddress: localhostContractAddresses.holographBridge,
  factoryAddress: localhostContractAddresses.holographFactory,
  registryAddress: localhostContractAddresses.holographRegistry,
  treasuryAddress: localhostContractAddresses.holographTreasury,
  operatorAddress: localhostContractAddresses.holographOperator,
  interfacesAddress: localhostContractAddresses.holographInterfaces,
  holographChainId: {1338: 4294967294, 1339: 4294967293},
}

describe('Contract class: HolographContract', () => {
  let providersWrapper: Providers
  let holograph: HolographContract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    holograph = new HolographContract()
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the HolographContract wrapper class', () => {
    expect(holograph).toHaveProperty('getAddress')
    expect(holograph).toHaveProperty('getBridge')
    expect(holograph).toHaveProperty('getBridgeByNetworks')
    expect(holograph).toHaveProperty('getRegistryByNetworks')
  })

  it('should be able to get the correct Holograph contract address according to the environment and chainId', () => {
    expect(holograph.getAddress().toLowerCase()).toBe(expectedValues.contractAddress.toLowerCase())
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

    expect(holographChainId).toBe(BigInt(chainId))
  })

  it('getChainIdByNetworks(): should be able to get the correct chainId per network', async () => {
    const holographChainIdByNetworks = await holograph.getChainIdByNetworks()
    expect(Object.keys(holographChainIdByNetworks)).toEqual(chainIds.map(String))
    expect(Object.values(holographChainIdByNetworks)).toEqual(chainIds.map(BigInt))
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
