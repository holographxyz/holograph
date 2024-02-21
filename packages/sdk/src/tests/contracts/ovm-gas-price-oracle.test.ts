import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../services/config.service'
import {OVMGasPriceOracle} from '../../contracts'
import {Providers} from '../../services'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

//NOTICE: the expected values are for the development env
const expectedValues = {
  ovmGasPriceOracleAddress: '0xd17c85ee12114be77ed0451c42c701fb2ae77c6f',
}

describe('Contract class: OVMGasPriceOracle', () => {
  let config: Config
  let providersWrapper: Providers
  let ovmGasPriceOracle: OVMGasPriceOracle

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    ovmGasPriceOracle = new OVMGasPriceOracle(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    const chainIds = Object.keys(NETWORKS_MOCK)
    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the OVMGasPriceOracle wrapper class', () => {
    expect(ovmGasPriceOracle).toHaveProperty('getL1Fee')
    expect(ovmGasPriceOracle).toHaveProperty('getL1GasUsed')
    expect(ovmGasPriceOracle).toHaveProperty('setGasPrice')
    expect(ovmGasPriceOracle).toHaveProperty('setL1BaseFee')
    expect(ovmGasPriceOracle).toHaveProperty('setOverhead')
    expect(ovmGasPriceOracle).toHaveProperty('setScalar')
    expect(ovmGasPriceOracle).toHaveProperty('setDecimals')
  })

  it('should be able to get the correct OVMGasPriceOracle contract address according to the environment and chainId', () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    expect(ovmGasPriceOracle.getAddress(chainId)).toBe(expectedValues.ovmGasPriceOracleAddress)
  })

  // TODO: Finish the following tests
  it.skip('getL1Fee(): should be able to get the correct L1 fee', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('getL1GasUsed(): should be able to get the correct L1 gas used', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setGasPrice(): should be able to set the correct gas price', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setL1BaseFee(): should be able to set the correct L1 base fee', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setOverhead(): should be able to set the correct overhead', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setScalar(): should be able to set the correct scalar', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })

  it.skip('setDecimals(): should be able to set the correct decimals', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
  })
})
