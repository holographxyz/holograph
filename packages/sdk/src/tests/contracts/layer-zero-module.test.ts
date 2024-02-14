import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../services/config.service'
import {LayerZeroModule} from '../../contracts'
import {Providers} from '../../services'
import {REGEX} from '../../utils/transformers'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

//NOTICE: the expected values are for the development env
const expectedValues = {
  layerZeroModuleAddress: '0x422cfa9d656588e55fdd5d34a55c89f711f724cc',
  optimismGasPriceOracleAddress: '0xd17C85EE12114bE77Ed0451c42c701fb2aE77C6f',
  bridgeAddress: '0x747f62b66cec00AC36E33CFda63238aEdc8a08d8',
  interfacesAddress: '0xD9E5f062A539B421af91013a401F93677D439ee1',
  operatorAddress: '0xe5CBE551D7717141f430fC1dC3bD71009BedE017',
  lzEndpoint: {
    5: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
    80001: '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8',
  },
}

describe('Contract class: LayerZeroModule', () => {
  let config: Config
  let providersWrapper: Providers
  let layerZeroModule: LayerZeroModule

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    layerZeroModule = new LayerZeroModule(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(NETWORKS_MOCK)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the LayerZeroModule wrapper class', () => {
    expect(layerZeroModule).toHaveProperty('getAddress')
    expect(layerZeroModule).toHaveProperty('getGasParametersByNetworks')
    expect(layerZeroModule).toHaveProperty('getOptimismGasPriceOracleByNetworks')
    expect(layerZeroModule).toHaveProperty('getLZEndpointByNetworks')
    expect(layerZeroModule).toHaveProperty('getBridgeByNetworks')
    expect(layerZeroModule).toHaveProperty('getInterfacesByNetworks')
    expect(layerZeroModule).toHaveProperty('getOperatorByNetworks')
  })

  it('should be able to get the correct LayerZeroModule contract address according to the environment and chainId', () => {
    expect(layerZeroModule.getAddress()).toBe(expectedValues.layerZeroModuleAddress)
  })

  it('getGasParametersByNetworks(): should be able to get the correct gas parameters per network', async () => {
    const gasParametersByNetworks = await layerZeroModule.getGasParametersByNetworks()
    expect(Object.keys(gasParametersByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(gasParametersByNetworks).forEach(item => {
      const gasParameters = item as string[]
      expect(gasParameters).toBeInstanceOf(Array)
      expect(gasParameters).toHaveLength(6)
      expect(
        gasParameters.map(Number).forEach(value => {
          expect(value).toBeGreaterThan(0)
        }),
      )
    })
  })

  it('getOptimismGasPriceOracleByNetworks(): should be able to get the correct Optimism gas price oracle address per network', async () => {
    const optimismGasPriceOracleByNetworks = await layerZeroModule.getOptimismGasPriceOracleByNetworks()
    expect(Object.keys(optimismGasPriceOracleByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(optimismGasPriceOracleByNetworks).forEach(optimismGasPriceOracle => {
      expect(optimismGasPriceOracle).toMatch(REGEX.WALLET_ADDRESS)
      expect(optimismGasPriceOracle).toBe(expectedValues.optimismGasPriceOracleAddress)
    })
  })

  it('getLZEndpointByNetworks(): should be able to get the correct LZ endpoint addresses per network', async () => {
    const lzEndpointByNetworks = await layerZeroModule.getLZEndpointByNetworks()
    expect(Object.keys(lzEndpointByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.entries(lzEndpointByNetworks).map(([chainId, lzEndpoint]) => {
      expect(lzEndpoint).toMatch(REGEX.WALLET_ADDRESS)
      expect(lzEndpoint).toBe(expectedValues.lzEndpoint[chainId])
    })
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await layerZeroModule.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getInterfacesByNetworks(): should be able to get the correct HolographInterfaces address per network', async () => {
    const interfacesAddressByNetworks = await layerZeroModule.getInterfacesByNetworks()
    expect(Object.keys(interfacesAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(interfacesAddressByNetworks).forEach(interfacesAddress => {
      expect(interfacesAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(interfacesAddress).toBe(expectedValues.interfacesAddress)
    })
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await layerZeroModule.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })
})
