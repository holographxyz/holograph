import {beforeAll, describe, expect, it} from 'vitest'

import {Treasury} from '../../contracts'
import {Providers, Config} from '../../services'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'

import {configObject} from './utils'

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
  const chainIds = getChainIdsByNetworksConfig(configObject.networks)

  beforeAll(() => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    treasury = new Treasury(config)
  })

  it('should be able to get the Treasury wrapper class', () => {
    expect(treasury).toHaveProperty('getAddress')
    expect(treasury).toHaveProperty('getOperator')
    expect(treasury).toHaveProperty('getBridge')
    expect(treasury).toHaveProperty('getHolographByNetworks')
  })

  it('should be able to get the correct Treasury contract address according to the environment and chainId', async () => {
    const address = (await treasury.getAddress(chainIds[1])).toLowerCase()
    expect(address).toBe(expectedValues.contractAddress)
  })

  it('getBridge(): should be able to get the correct HolographBridge address', async () => {
    const chainId = chainIds[0]
    const bridgeAddress = await treasury.getBridge(chainId)
    expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await treasury.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getOperator(): should be able to get the correct HolographOperator address', async () => {
    const chainId = chainIds[0]
    const operatorAddress = await treasury.getOperator(chainId)

    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await treasury.getOperatorByNetworks()
    expect(Object.keys(operatorAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistry(): should be able to get the correct HolographRegistry address', async () => {
    const chainId = chainIds[0]
    const registryAddress = await treasury.getRegistry(chainId)

    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await treasury.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  it.skip('getHolographMintFee(): should be able to get the fee that is charged to mint holographable assets', async () => {
    const chainId = chainIds[0]
    const mintFee = await treasury.getHolographMintFee(chainId)

    expect(BigInt(mintFee as string)).toBeGreaterThanOrEqual(0)
  })

  it.skip('getHolographMintFeeByNetworks(): should be able to get the fee that is charged to mint holographable assets per network', async () => {
    const mintFeeByNetworks = await treasury.getHolographMintFeeByNetworks()
    expect(Object.keys(mintFeeByNetworks)).toEqual(chainIds.map(String))

    Object.values(mintFeeByNetworks).forEach(mintFee => {
      expect(BigInt(mintFee as string)).toBeGreaterThanOrEqual(0)
    })
  })

  describe.skip('setBridge():', () => {
    it('Should allow the admin to update the Holograph Bridge module address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setHolograph():', () => {
    it('Should allow the admin to update the Holograph Protocol contract address.', () => {})
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

  describe.skip('withdraw():', () => {
    it('Should allow the admin to successfully withdraw funds.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
    it('Should revert if there is no balance to withdraw.', () => {})
  })

  describe.skip('withdrawTo():', () => {
    it('Should allow the admin to successfully withdraw funds to the recipient address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
    it('Should revert if there is no balance to withdraw.', () => {})
  })
})
