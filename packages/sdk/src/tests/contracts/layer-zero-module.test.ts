import {beforeAll, describe, expect, it} from 'vitest'

import {LayerZeroModule} from '../../contracts'
import {Providers} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'

import {testConfigObject, testConfig, localhostContractAddresses} from '../setup'
import {Addresses} from '../../constants/addresses'

//TODO: localhost deploy needs to configure these values
const expectedValues = {
  layerZeroModuleAddress: localhostContractAddresses.layerZeroModule,
  optimismGasPriceOracleAddress: Addresses.zero(),
  bridgeAddress: Addresses.zero(),
  interfacesAddress: Addresses.zero(),
  operatorAddress: Addresses.zero(),
  lzEndpoint: {
    1338: Addresses.zero(),
    1339: Addresses.zero(),
  },
}

describe('Contract class: LayerZeroModule', () => {
  let providersWrapper: Providers
  let layerZeroModule: LayerZeroModule
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers(testConfig)
    layerZeroModule = new LayerZeroModule(testConfig)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the LayerZeroModule wrapper class', () => {
    expect(layerZeroModule).toHaveProperty('getAddress')
    expect(layerZeroModule).toHaveProperty('getGasParametersByNetworks')
    expect(layerZeroModule).toHaveProperty('getOptimismGasPriceOracleByNetworks')
    expect(layerZeroModule).toHaveProperty('getLZEndpointByNetworks')
    expect(layerZeroModule).toHaveProperty('getBridgeByNetworks')
    expect(layerZeroModule).toHaveProperty('getInterfacesByNetworks')
    expect(layerZeroModule).toHaveProperty('getOperatorByNetworks')
    expect(layerZeroModule).toHaveProperty('getMessageFee')
    expect(layerZeroModule).toHaveProperty('getHlgFee')
    expect(layerZeroModule).toHaveProperty('send')
    expect(layerZeroModule).toHaveProperty('setInterfaces')
    expect(layerZeroModule).toHaveProperty('setLZEndpoint')
    expect(layerZeroModule).toHaveProperty('setOperator')
    expect(layerZeroModule).toHaveProperty('setOptimismGasPriceOracle')
    expect(layerZeroModule).toHaveProperty('setGasParameters')
  })

  it('should be able to get the correct LayerZeroModule contract address according to the environment and chainId', () => {
    expect(layerZeroModule.getAddress()).toBe(expectedValues.layerZeroModuleAddress.toLowerCase())
  })

  it('getGasParametersByNetworks(): should be able to get the correct gas parameters per network', async () => {
    const gasParametersByNetworks = await layerZeroModule.getGasParametersByNetworks()
    expect(Object.keys(gasParametersByNetworks)).toEqual(chainIds.map(String))

    Object.values(gasParametersByNetworks).forEach(gasParameters => {
      expect(gasParameters).toBeInstanceOf(Object)
      expect(gasParameters).toHaveProperty('msgBaseGas')
      expect(gasParameters).toHaveProperty('msgGasPerByte')
      expect(gasParameters).toHaveProperty('jobBaseGas')
      expect(gasParameters).toHaveProperty('jobGasPerByte')
      expect(gasParameters).toHaveProperty('minGasPrice')
      expect(gasParameters).toHaveProperty('maxGasLimit')
    })
  })

  it('getOptimismGasPriceOracleByNetworks(): should be able to get the correct Optimism gas price oracle address per network', async () => {
    const optimismGasPriceOracleByNetworks = await layerZeroModule.getOptimismGasPriceOracleByNetworks()
    expect(Object.keys(optimismGasPriceOracleByNetworks)).toEqual(chainIds.map(String))

    Object.values(optimismGasPriceOracleByNetworks).forEach(optimismGasPriceOracle => {
      expect(optimismGasPriceOracle).toMatch(REGEX.WALLET_ADDRESS)
      expect(optimismGasPriceOracle).toBe(expectedValues.optimismGasPriceOracleAddress)
    })
  })

  it('getLZEndpointByNetworks(): should be able to get the correct LZ endpoint addresses per network', async () => {
    const lzEndpointByNetworks = await layerZeroModule.getLZEndpointByNetworks()
    expect(Object.keys(lzEndpointByNetworks)).toEqual(chainIds.map(String))

    Object.entries(lzEndpointByNetworks).map(([chainId, lzEndpoint]) => {
      expect(lzEndpoint).toMatch(REGEX.WALLET_ADDRESS)
      expect(lzEndpoint).toBe(expectedValues.lzEndpoint[chainId])
    })
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await layerZeroModule.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getInterfacesByNetworks(): should be able to get the correct HolographInterfaces address per network', async () => {
    const interfacesAddressByNetworks = await layerZeroModule.getInterfacesByNetworks()
    expect(Object.keys(interfacesAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(interfacesAddressByNetworks).forEach(interfacesAddress => {
      expect(interfacesAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(interfacesAddress).toBe(expectedValues.interfacesAddress)
    })
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await layerZeroModule.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  // TODO: Finish the following tests
  it.skip('getMessageFee(): should be able to get the correct message fee', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getHlgFee(): should be able to get the correct HLG fee', async () => {
    const chainId = chainIds[0]
  })

  it.skip('send(): should be able to send a transaction', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setInterfaces(): should be able to set the HolographInterfaces address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setLZEndpoint(): should be able to set the LZ endpoint address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setOperator(): should be able to set the HolographOperator address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setOptimismGasPriceOracle(): should be able to set the Optimism gas price oracle address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setGasParameters(): should be able to set the gas parameters', async () => {
    const chainId = chainIds[0]
  })
})
