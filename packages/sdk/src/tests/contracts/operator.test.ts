import {beforeAll, describe, expect, it} from 'vitest'
import {Address} from 'abitype'

import {OperatorContract} from '../../contracts'
import {testConfigObject, localhostContractAddresses} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'
import {REGEX} from '../../utils/transformers'

const expectedValues = {
  holographAddress: localhostContractAddresses.holograph,
  bridgeAddress: localhostContractAddresses.holographBridge,
  registryAddress: localhostContractAddresses.holographRegistry,
  operatorAddress: localhostContractAddresses.holographOperator,
  utilityTokenAddress: localhostContractAddresses.holographUtilityToken,
  messagingModuleAddress: localhostContractAddresses.messageModule,
  minGasPrice: 1000000000n,
}

describe('Contract class: OperatorContract', () => {
  let operator: OperatorContract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    operator = new OperatorContract()
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
    expect(operator).toHaveProperty('getMessageFee')
    expect(operator).toHaveProperty('recoverJob')
    expect(operator).toHaveProperty('executeJob')
    expect(operator).toHaveProperty('nonRevertingBridgeCall')
    expect(operator).toHaveProperty('crossChainMessage')
    expect(operator).toHaveProperty('jobEstimator')
    expect(operator).toHaveProperty('send')
    expect(operator).toHaveProperty('topupUtilityToken')
    expect(operator).toHaveProperty('bondUtilityToken')
    expect(operator).toHaveProperty('unbondUtilityToken')
    expect(operator).toHaveProperty('setBridge')
    expect(operator).toHaveProperty('setHolograph')
    expect(operator).toHaveProperty('setInterfaces')
    expect(operator).toHaveProperty('setMessagingModule')
    expect(operator).toHaveProperty('setRegistry')
    expect(operator).toHaveProperty('setUtilityToken')
    expect(operator).toHaveProperty('setMinGasPrice')
  })

  it('should be able to get the correct operator contract address according to the environment and chainId', async () => {
    const address = await operator.getAddress(chainIds[1])
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
    expect(pod).toBe(0n)
  })

  it('getBondedPodIndex(): should be able to get the correct bonded pod index', async () => {
    const index = await operator.getBondedPodIndex(chainIds[1], expectedValues.operatorAddress as Address)
    expect(index).toBe(0n)
  })

  it('getMinGasPrice(): should be able to get the minimum value required to execute a job without it being marked as under priced', async () => {
    const minGasPrice = await operator.getMinGasPrice(chainIds[1])
    expect(minGasPrice).toBe(expectedValues.minGasPrice)
  })

  it('getHolographByNetworks(): should be able to get the correct Holograph address per network', async () => {
    const holographAddressByNetworks = await operator.getHolographByNetworks()
    expect(Object.keys(holographAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(holographAddressByNetworks).forEach(holographAddress => {
      expect(holographAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(holographAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getBridgeByNetworks(): should be able to get the correct HolographBridge address per network', async () => {
    const bridgeAddressByNetworks = await operator.getBridgeByNetworks()
    expect(Object.keys(bridgeAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(bridgeAddressByNetworks).forEach(bridgeAddress => {
      expect(bridgeAddress).toMatch(REGEX.WALLET_ADDRESS)
      expect(bridgeAddress).toBe(expectedValues.bridgeAddress)
    })
  })

  it('getRegistryByNetworks(): should be able to get the correct HolographRegistry address per network', async () => {
    const registryAddressByNetworks = await operator.getRegistryByNetworks()
    expect(Object.keys(registryAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(registryAddressByNetworks).forEach(registryAddress => {
      expect(registryAddress).toBe(expectedValues.registryAddress)
    })
  })

  it('getMessagingModuleByNetworks(): should be able to get the correct HolographMessagingModule address per network', async () => {
    const messagingModuleAddressByNetworks = await operator.getMessagingModuleByNetworks()
    expect(Object.keys(messagingModuleAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(messagingModuleAddressByNetworks).forEach(messagingModuleAddress => {
      expect(messagingModuleAddress).toBe(expectedValues.messagingModuleAddress)
    })
  })

  it.skip('getUtilityTokenByNetworks(): should be able to get the correct HolographUtilityToken address per network', async () => {
    const utilityTokenAddressByNetworks = await operator.getUtilityTokenByNetworks()
    expect(Object.keys(utilityTokenAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(utilityTokenAddressByNetworks).forEach(utilityTokenAddress => {
      expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
    })
  })

  // TODO: We cannot create tests for the following methods until we can call bondUtilityToken() to become an operator.
  it.skip('getJobDetails(): should be able to get the correct job details', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getPodOperatorsLength(): should be able to get the correct pod operators length', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getPodOperators(): should be able to get the correct pod operators', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getPaginatedPodOperators(): should be able to get the correct paginated pod operators', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getPodBondAmounts(): should be able to get the correct pod bond amounts', async () => {
    const chainId = chainIds[0]
  })

  it.skip('getMessageFee(): should be able to get the correct pod bond amounts', async () => {
    const chainId = chainIds[0]
  })

  // TODO: Finish the following tests (write functions)
  it.skip('recoverJob(): should be able to recover a job', async () => {
    const chainId = chainIds[0]
  })

  it.skip('executeJob(): should be able to execute a job', async () => {
    const chainId = chainIds[0]
  })

  it.skip('nonRevertingBridgeCall(): should be able to execute a non-reverting bridge call', async () => {
    const chainId = chainIds[0]
  })

  it.skip('crossChainMessage(): should be able to send a cross chain message', async () => {
    const chainId = chainIds[0]
  })

  it.skip('jobEstimator(): should be able to estimate a job', async () => {
    const chainId = chainIds[0]
  })

  it.skip('send(): should be able to send a message', async () => {
    const chainId = chainIds[0]
  })

  it.skip('topupUtilityToken(): should be able to topup the utility token', async () => {
    const chainId = chainIds[0]
  })

  it.skip('bondUtilityToken(): should be able to bond the utility token', async () => {
    const chainId = chainIds[0]
  })

  it.skip('unbondUtilityToken(): should be able to unbond the utility token', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setBridge(): should be able to set the bridge address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setHolograph(): should be able to set the holograph address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setInterfaces(): should be able to set the interfaces address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setMessagingModule(): should be able to set the messaging module address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setRegistry(): should be able to set the registry address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setUtilityToken(): should be able to set the utility token address', async () => {
    const chainId = chainIds[0]
  })

  it.skip('setMinGasPrice(): should be able to set the minimum gas price', async () => {
    const chainId = chainIds[0]
  })
})
