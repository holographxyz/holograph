import {beforeAll, describe, expect, it} from 'vitest'
import {networks} from '@holographxyz/networks'

import {OVMGasPriceOracle} from '../../contracts'
import {Providers, Config} from '../../services'

import {configObject} from './utils'

//NOTICE: the expected values are for the development env
const expectedValues = {
  ovmGasPriceOracleAddress: '0xd17c85ee12114be77ed0451c42c701fb2ae77c6f',
}

describe('Contract class: OVMGasPriceOracle', () => {
  let config: Config
  let providersWrapper: Providers
  let ovmGasPriceOracle: OVMGasPriceOracle
  const chainIds = Object.keys(NETWORKS_MOCK).map(networkKey => Number(networks[networkKey].chain))

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    ovmGasPriceOracle = new OVMGasPriceOracle(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(configObject.networks)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the OVMGasPriceOracle wrapper class', () => {
    expect(ovmGasPriceOracle).toHaveProperty('getAddress')
    expect(ovmGasPriceOracle).toHaveProperty('getL1Fee')
    expect(ovmGasPriceOracle).toHaveProperty('getL1GasUsed')
    expect(ovmGasPriceOracle).toHaveProperty('setGasPrice')
    expect(ovmGasPriceOracle).toHaveProperty('setL1BaseFee')
    expect(ovmGasPriceOracle).toHaveProperty('setOverhead')
    expect(ovmGasPriceOracle).toHaveProperty('setScalar')
    expect(ovmGasPriceOracle).toHaveProperty('setDecimals')
  })

  it('should be able to get the correct OVMGasPriceOracle contract address according to the environment and chainId', () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
    expect(ovmGasPriceOracle.getAddress(chainId)).toBe(expectedValues.ovmGasPriceOracleAddress)
  })

  // TODO: Finish the following tests
  it.skip('getL1Fee(): should be able to get the correct L1 fee', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('getL1GasUsed(): should be able to get the correct L1 gas used', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('setGasPrice(): should be able to set the correct gas price', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('setL1BaseFee(): should be able to set the correct L1 base fee', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('setOverhead(): should be able to set the correct overhead', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('setScalar(): should be able to set the correct scalar', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })

  it.skip('setDecimals(): should be able to set the correct decimals', async () => {
    const chainId = Number(Object.keys(configObject.networks)[0])
  })
})
