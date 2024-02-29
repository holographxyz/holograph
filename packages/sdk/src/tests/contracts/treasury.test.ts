import {beforeAll, describe, expect, it} from 'vitest'

<<<<<<< HEAD
import {Treasury} from '../../contracts'
import {Providers, Config} from '../../services'
import {REGEX} from '../../utils/transformers'

import {configObject} from './utils'
=======
import {CHAIN_ID_BY_CHAIN_NAME} from '../../constants/rpcs'
import {Treasury} from '../../contracts'
import {Providers} from '../../services'
import {NetworkRpc, Config} from '../../services/config.service'
import {REGEX} from '../../utils/transformers'

const NETWORKS_MOCK: NetworkRpc = {
  ethereumTestnetGoerli: process.env.ETHEREUM_TESTNET_GOERLI_RPC_URL ?? '',
  polygonTestnet: process.env.POLYGON_TESTNET_RPC_URL ?? '',
}
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

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
<<<<<<< HEAD
  const chainIds = Object.keys(configObject.networks)
=======
  const chainIds = Object.keys(NETWORKS_MOCK).map(chainName => CHAIN_ID_BY_CHAIN_NAME[chainName])
  console.log('MANOOOO', chainIds)
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

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
    const address = (await treasury.getAddress(Number(chainIds[1]))).toLowerCase()
    expect(address).toBe(expectedValues.contractAddress)
  })

  it('getBridge(): should be able to get the correct HolographBridge address', async () => {
    const chainId = Number(chainIds[0])
    const bridgeAddress = await treasury.getBridge(chainId)
    expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
    expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await treasury.getBridgeByNetworks()
<<<<<<< HEAD
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(Object.keys(configObject.networks))
=======
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(chainIds.map(String))
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getOperator(): should be able to get the correct HolographOperator address', async () => {
<<<<<<< HEAD
    const chainId = Number(Object.keys(configObject.networks)[0])
=======
    const chainId = chainIds[0]
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)
    const operatorAddress = await treasury.getOperator(chainId)

    expect(operatorAddress).toBe(expectedValues.operatorAddress)
  })

  it('getOperatorByNetworks(): should be able to get the correct HolographOperator address per network', async () => {
    const operatorAddressByNetworks = await treasury.getOperatorByNetworks()
<<<<<<< HEAD
    expect(Object.keys(operatorAddressByNetworks)).toEqual(Object.keys(configObject.networks))
=======
    expect(Object.keys(operatorAddressByNetworks)).toEqual(chainIds.map(String))
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

    Object.values(operatorAddressByNetworks).forEach(operatorAddress => {
      expect(operatorAddress).toBe(expectedValues.operatorAddress)
    })
  })

  it('getRegistry(): should be able to get the correct HolographRegistry address', async () => {
<<<<<<< HEAD
    const chainId = Number(Object.keys(configObject.networks)[0])
=======
    const chainId = chainIds[0]
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)
    const registryAddress = await treasury.getRegistry(chainId)

    expect(registryAddress).toBe(expectedValues.registryAddress)
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await treasury.getRegistryByNetworks()
<<<<<<< HEAD
    expect(Object.keys(registryAddressByNetworks)).toEqual(Object.keys(configObject.networks))
=======
    expect(Object.keys(registryAddressByNetworks)).toEqual(chainIds.map(String))
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  it.skip('getHolographMintFee(): should be able to get the fee that is charged to mint holographable assets', async () => {
<<<<<<< HEAD
    const chainId = Number(Object.keys(configObject.networks)[0])
=======
    const chainId = chainIds[0]
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)
    const mintFee = await treasury.getHolographMintFee(chainId)

    expect(BigInt(mintFee as string)).toBeGreaterThanOrEqual(0)
  })

  it.skip('getHolographMintFeeByNetworks(): should be able to get the fee that is charged to mint holographable assets per network', async () => {
    const mintFeeByNetworks = await treasury.getHolographMintFeeByNetworks()
<<<<<<< HEAD
    expect(Object.keys(mintFeeByNetworks)).toEqual(Object.keys(configObject.networks))
=======
    expect(Object.keys(mintFeeByNetworks)).toEqual(chainIds.map(String))
>>>>>>> cc34e98 (refactor: Address review comments and make the network name as the networks object keys)

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
