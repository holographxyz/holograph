import {beforeAll, describe, expect, it} from 'vitest'
import {Address} from 'abitype'

import {Config} from '../../services/config.service'
import {Operator} from '../../contracts'
import {Providers} from '../../services'
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
  operatorAddress: '0xe5cbe551d7717141f430fc1dc3bd71009bede017',
  utilityTokenAddress: '0x01F3f1Ce33592a548a2EdF047Fe331f8A5Eb4389',
  messagingModuleAddress: '0xa534C5D756b0b7Cb5dec153FA64351459a28eB98',
  minGasPrice: '1000000000',
}

describe('Contract class: Operator', () => {
  let config: Config
  let providersWrapper: Providers
  let operator: Operator
  const chainIds = Object.keys(NETWORKS_MOCK).map(Number)

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    operator = new Operator(config)
  })

  it('should be able to get the operator wrapper class', () => {
    expect(operator).toHaveProperty('getAddress')
    expect(operator).toHaveProperty('getJobDetails')
    expect(operator).toHaveProperty('getTotalPods')
    expect(operator).toHaveProperty('getPodOperatorsLength')
    expect(operator).toHaveProperty('getPodOperators')
    expect(operator).toHaveProperty('getPaginatedPodOperators')
    expect(operator).toHaveProperty('getPodBondAmounts')
    expect(operator).toHaveProperty('getBondedAmount')
    expect(operator).toHaveProperty('getBondedPod')
    expect(operator).toHaveProperty('getBondedPodIndex')
    expect(operator).toHaveProperty('getMinGasPrice')
    expect(operator).toHaveProperty('getHolographByNetworks')
    expect(operator).toHaveProperty('getBridgeByNetworks')
    expect(operator).toHaveProperty('getRegistryByNetworks')
    expect(operator).toHaveProperty('getMessagingModuleByNetworks')
    expect(operator).toHaveProperty('getUtilityTokenByNetworks')
  })

  it('should be able to get the correct operator contract address according to the environment and chainId', async () => {
    const address = (await operator.getAddress(chainIds[1])).toLowerCase()
    expect(address).toBe(expectedValues.operatorAddress)
  })

  it('getTotalPods(): should be able to get the correct total pods', async () => {
    const totalPods = await operator.getTotalPods(chainIds[1])
    expect(Number(totalPods)).toBe(1)
  })

  it('getBondedAmount(): should be able to get the correct bonded amount', async () => {
    const amount = await operator.getBondedAmount(chainIds[1], expectedValues.operatorAddress as Address)
    expect(Number(amount)).toBeGreaterThanOrEqual(0)
  })

  it('getBondedPod(): should be able to get the correct bonded pod', async () => {
    const pod = await operator.getBondedPod(chainIds[1], expectedValues.operatorAddress as Address)
    expect(pod).toBe('0')
  })

  it('getBondedPodIndex(): should be able to get the correct bonded pod index', async () => {
    const index = await operator.getBondedPodIndex(chainIds[1], expectedValues.operatorAddress as Address)
    expect(index).toBe('0')
  })

  it('getMinGasPrice(): should be able to get the minimum value required to execute a job without it being marked as under priced', async () => {
    const minGasPrice = await operator.getMinGasPrice(chainIds[1])
    expect(minGasPrice).toBe(expectedValues.minGasPrice)
  })

  it('getHolographByNetworks(): should be able to get the correct Holograph address per network', async () => {
    const bridgeAddressByNetworks = await operator.getHolographByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await operator.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await operator.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  it('getMessagingModuleByNetworks(): should be able to get the correct HolographMessagingModule address per network', async () => {
    const messagingModuleAddressByNetworks = await operator.getMessagingModuleByNetworks()
    expect(Object.keys(messagingModuleAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(messagingModuleAddressByNetworks).forEach(messagingModuleAddress => {
      expect(messagingModuleAddress).toBe(expectedValues.messagingModuleAddress)
    })
  })

  it('getUtilityTokenByNetworks(): should be able to get the correct HolographUtilityToken address per network', async () => {
    const utilityTokenAddressByNetworks = await operator.getUtilityTokenByNetworks()
    expect(Object.keys(utilityTokenAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(utilityTokenAddressByNetworks).forEach(utilityTokenAddress => {
      expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
    })
  })

  // TODO: We cannot create tests for the following methods until we can call bondUtilityToken() to become an operator.
  it('getJobDetails(): should be able to get the correct job details', async () => {})

  it('getPodOperatorsLength(): should be able to get the correct pod operators length', async () => {})

  it('getPodOperators(): should be able to get the correct pod operators', async () => {})

  it('getPaginatedPodOperators(): should be able to get the correct paginated pod operators', async () => {})

  it('getPodBondAmounts(): should be able to get the correct pod bond amounts', async () => {})
})