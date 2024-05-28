import {getNetworkByChainId} from '@holographxyz/networks'
import {Address, Hex} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {HolographWallet} from '../../services'
import {HolographAccount} from '../../utils/types'
import {BridgeAsset} from '../../assets/bridge-asset'
import {generateRandomSalt} from '../../utils/helpers'
import {BridgeCollection} from '../../assets/bridge-collection'
import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {configObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID} from '../setup'
import {getTestGasLimit, MAX_GAS_VALUE} from '../../utils/gas'

/**
 * TODO:
 * Some tests are currently skipped because `LayerZeroModule.getMessageFee` needs to be adapted to function correctly on localhost.
 * Once `getMessageFee` is functional for localhost, remove the `describe.skip` and update the tests.
 */
describe('Asset class: BridgeAsset', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, networks: configObject.networks})

  let bridgeAsset: BridgeAsset
  let sourceChainId: number
  let destinationChainId: number
  let holographChainId: number
  let holographableContract: Address
  let gasLimit: bigint
  let gasPrice: bigint
  let bridgeOutPayload: Hex
  let factoryAddress

  beforeAll(async () => {
    bridgeAsset = new BridgeAsset(configObject)

    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID

    holographChainId = getNetworkByChainId(destinationChainId).holographId

    const collection = new HolographLegacyCollection({
      collectionInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: sourceChainId,
    })

    const signatureData = await collection.signDeploy(wallet)
    const {collectionAddress} = await collection.deploy(signatureData)
    holographableContract = collectionAddress

    const erc721DeploymentConfig = await collection['createERC721DeploymentConfig'](accountAddress)
    factoryAddress = await collection['_getFactoryAddress']()

    bridgeOutPayload = await BridgeCollection.createInitCode(sourceChainId, erc721DeploymentConfig, wallet)

    gasLimit = BigInt(450000)
    gasPrice = BigInt(0)
  })

  it('should be able to get the BridgeAsset wrapper class', () => {
    expect(BridgeAsset).toHaveProperty('createUnsignedBridgeOutTx')

    expect(bridgeAsset).toHaveProperty('_createBridgeOutPayload')
    expect(bridgeAsset).toHaveProperty('_getMessageFee')
    expect(bridgeAsset).toHaveProperty('_getValue')
    expect(bridgeAsset).toHaveProperty('_estimateBridgeOutDestinationGas')
    expect(bridgeAsset).toHaveProperty('_prepareBridgeOutRequest')
    expect(bridgeAsset).toHaveProperty('_bridgeOut')
  })

  describe('createUnsignedBridgeOutTx()', () => {
    it('should be able to create the correct payload for a bridgeOutRequest transaction', () => {
      const txData = BridgeAsset.createUnsignedBridgeOutTx(
        holographChainId,
        holographableContract,
        gasLimit,
        gasPrice,
        bridgeOutPayload,
      )

      expectTypeOf(txData).toBeString()
      expect(txData.startsWith('0x')).toBeTruthy()
    })
  })

  describe('_createBridgeOutPayload()', () => {
    it('should be able to static call the "getBridgeOutRequestPayload" from the bridge contract and get the bridge out payload', async () => {
      const payload = await bridgeAsset['_createBridgeOutPayload'](
        sourceChainId,
        holographChainId,
        factoryAddress,
        MAX_GAS_VALUE,
        MAX_GAS_VALUE,
        bridgeOutPayload,
      )

      expectTypeOf(payload).toBeString()
      expect(payload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('_getMessageFee()', () => {
    it('should be able to static call the "getMessageFee" from the bridge contract', async () => {
      const fee = await bridgeAsset['_getMessageFee'](
        sourceChainId,
        holographChainId,
        MAX_GAS_VALUE,
        MAX_GAS_VALUE,
        bridgeOutPayload,
      )

      /**
       * fee[0]: hlgFee the amount (in wei) of native gas token that will cost for finalizing job on destiantion chain
       * fee[1]:  msgFee the amount (in wei) of native gas token that will cost for sending message to destiantion chain
       * fee[2]:  dstGasPrice the amount (in wei) that destination message maximum gas price will be
       */
      expectTypeOf(fee).toBeArray()
      expect(fee.length).toBe(3)
    })
  })

  describe.skip('_getValue()', () => {
    it('should calculate the total bridge request fee accurately', async () => {
      const totalFee = await bridgeAsset['_getValue'](
        sourceChainId,
        holographChainId,
        MAX_GAS_VALUE,
        MAX_GAS_VALUE,
        bridgeOutPayload,
      )
      expect(typeof totalFee).toBe('bigint')
    })
  })

  describe.skip('_estimateBridgeOutDestinationGas()', () => {
    it('should calculate necessary gas settings to execute the bridge request on the destination chain', async () => {
      const {destinationGasPrice, destinationGasLimit} = await bridgeAsset['_estimateBridgeOutDestinationGas'](
        sourceChainId,
        destinationChainId,
        holographableContract,
        bridgeOutPayload,
      )

      expect(typeof destinationGasPrice).toBe('bigint')
      expect(typeof destinationGasLimit).toBe('bigint')

      expect(destinationGasPrice).toBeGreaterThan(0)
      expect(destinationGasLimit).toBeGreaterThan(0)
      expect(destinationGasLimit).toBeLessThan(getTestGasLimit(destinationChainId))
    })
  })

  describe.skip('_prepareBridgeOutRequest()', () => {
    it('should assemble complete bridge out request data', async () => {
      const result = await bridgeAsset['_prepareBridgeOutRequest'](
        sourceChainId,
        destinationChainId,
        holographableContract,
        bridgeOutPayload,
      )

      expect(result).toHaveProperty('gasSource')
      expect(result).toHaveProperty('gasDestination')
      expect(result).toHaveProperty('value')
      expect(result).toHaveProperty('unsignedTx')

      const _ = [result.gasSource, result.gasDestination].forEach(gasSettings => {
        expect(gasSettings).toHaveProperty('chainId')
        expectTypeOf(gasSettings.chainId).toBeNumber()

        expect(gasSettings).toHaveProperty('gasPrice')
        expect(typeof gasSettings.gasPrice).toBe('bigint')

        expect(gasSettings).toHaveProperty('gasLimit')
        expect(typeof gasSettings.gasLimit).toBe('bigint')
      })

      expect(typeof result.value).toBe('bigint')
      expect(typeof result.unsignedTx).toHaveProperty('string')
      expect(result.unsignedTx.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('_bridgeOut()', () => {
    it('should send a bridge out resquest transaction', async () => {
      const tx = await bridgeAsset['_bridgeOut'](
        sourceChainId,
        destinationChainId,
        holographableContract,
        bridgeOutPayload,
        wallet,
      )
      expect(tx.hash.startsWith('0x')).toBeTruthy()
    })
  })
})
