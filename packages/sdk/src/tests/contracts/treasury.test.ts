import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../services/config.service'
import {Treasury} from '../../contracts'
import {Providers} from '../../services'
import {} from '../../contracts/treasury.contract'
import {REGEX} from '../../utils/transformers'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

//NOTICE: the expected values are for the development env -> 0x8dd0A4D129f03F1251574E545ad258dE26cD5e97
const expectedValues = {
  contractAddress: '0x98ad6d9ff18c5f3adf7aa225a374c56e246094ef',
  holographAddress: '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97',
  bridgeAddress: '0x747f62b66cec00AC36E33CFda63238aEdc8a08d8',
  registryAddress: '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB',
  operatorAddress: '0xe5CBE551D7717141f430fC1dC3bD71009BedE017',
}

describe('Contract class: Treasury', () => {
  let config: Config
  let providersWrapper: Providers
  let treasury: Treasury

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    treasury = new Treasury(config)
  })

  it('should be able to get the Treasury wrapper class', () => {
    expect(treasury).toHaveProperty('getOperator')
    expect(treasury).toHaveProperty('getBridge')
    expect(treasury).toHaveProperty('getHolographByNetworks')
  })

  it('should be able to get the correct Treasury contract address according to the environment and chainId', () => {
    expect(treasury.getAddress()).toBe(expectedValues.contractAddress)
  })

  it('getBridge(): should be able to get the correct HolographBridge address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const bridgeAddress = await treasury.getBridge(chainId)
    expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await treasury.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getOperator(): should be able to get the correct HolographOperator address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const operatorAddress = await treasury.getOperator(chainId)

    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await treasury.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistry(): should be able to get the correct HolographRegistry address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const registryAddress = await treasury.getRegistry(chainId)

    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await treasury.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })
})
