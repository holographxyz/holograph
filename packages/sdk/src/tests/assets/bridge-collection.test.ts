import {Address} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {HolographWallet} from '../../services'
import {HolographAccount} from '../../utils/types'
import {generateRandomSalt} from '../../utils/helpers'
import {BridgeCollection} from '../../assets/bridge-collection'
import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {configObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID} from '../setup'

/**
 * TODO:
 * Some tests are currently skipped because `LayerZeroModule.getMessageFee` needs to be adapted to function correctly on localhost.
 * Once `getMessageFee` is functional for localhost, remove the `describe.skip` and update the tests.
 */
describe('Asset class: BridgeCollection', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})

  let collection: HolographLegacyCollection
  let bridgeCollection: BridgeCollection
  let sourceChainId: number
  let destinationChainId: number
  let contractAddress: Address

  beforeAll(async () => {
    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID

    collection = new HolographLegacyCollection(configObject, {
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
    const erc721DeploymentConfig = await collection['_createErc721DeploymentConfig'](accountAddress)

    contractAddress = collectionAddress

    bridgeCollection = new BridgeCollection(configObject, {
      sourceChainId,
      contractAddress,
      erc721DeploymentConfig,
      wallet,
    })
  })

  it('should be able to get the BridgeCollection wrapper class', () => {
    expect(BridgeCollection).toHaveProperty('createInitCode')

    expect(bridgeCollection).toHaveProperty('getInitCode')
    expect(bridgeCollection).toHaveProperty('bridgeOut')
  })

  describe('getInitCode()', () => {
    it('should be able to get the bridge out request init code', async () => {
      const bridgeOutPayload = await bridgeCollection.getInitCode()

      expectTypeOf(bridgeOutPayload).toBeString()
      expect(bridgeOutPayload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('bridgeOut()', () => {
    it('should be able to bridge a collection', () => {})
  })
})
