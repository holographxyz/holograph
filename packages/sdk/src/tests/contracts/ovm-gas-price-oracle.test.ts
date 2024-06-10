import {beforeAll, describe, expect, it} from 'vitest'

import {OVMGasPriceOracleContract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject, localhostContractAddresses} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

//NOTICE: the expected values are for the development env
const expectedValues = {
  ovmGasPriceOracleAddress: localhostContractAddresses.ovmGasPriceOracle,
}

describe('Contract class: OVMGasPriceOracleContract', () => {
  let providersWrapper: Providers
  let ovmGasPriceOracle: OVMGasPriceOracleContract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    ovmGasPriceOracle = new OVMGasPriceOracleContract()
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers
    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the OVMGasPriceOracleContract wrapper class', () => {
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
    const chainId = chainIds[0]
    expect(ovmGasPriceOracle.getAddress(chainId)).toBe(expectedValues.ovmGasPriceOracleAddress.toLowerCase())
  })

  // TODO: Finish the following tests
  it.skip('getL1Fee(): should be able to get the correct L1 fee', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getL1GasUsed(): should be able to get the correct L1 gas used', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setGasPrice(): should be able to set the correct gas price', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setL1BaseFee(): should be able to set the correct L1 base fee', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setOverhead(): should be able to set the correct overhead', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setScalar(): should be able to set the correct scalar', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setDecimals(): should be able to set the correct decimals', async () => {
    const chainId = chainIds[0]
  })
})
