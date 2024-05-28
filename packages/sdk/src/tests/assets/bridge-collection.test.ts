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
 * These tests should be executed on a testnet as they are not expected to run successfully locally.
 */
describe('Asset class: BridgeCollection', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, networks: configObject.networks})

  let collection: HolographLegacyCollection
  let bridgeCollection: BridgeCollection
  let sourceChainId: number
  let destinationChainId: number
  let contractAddress: Address

  beforeAll(async () => {
    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID

    collection = new HolographLegacyCollection({
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
    const erc721DeploymentConfig = await collection.createERC721DeploymentConfig(accountAddress)

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
    it('should be able to bridge a collection', async () => {
      const tx = await bridgeCollection.bridgeOut(destinationChainId)

      console.log('DEBUG| transaction hash: ', tx)

      const receipt = await wallet.onChain(sourceChainId).getTransactionReceipt({hash: tx.hash})
      expect(receipt.status).toBe('success')
    })
  })
})
