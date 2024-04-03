import {Address} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {HolographWallet} from '../../services'
import {HolographAccount} from '../../utils/types'
import {generateRandomSalt} from '../../utils/helpers'
import {BridgeCollection} from '../../assets/bridge-collection'
import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {configObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID} from '../setup'
import {NFT} from '../../assets/nft'
import {BridgeNft} from '../../assets/bridge-nft'

/**
 * TODO:
 * These tests should be executed on a testnet as they are not expected to run successfully locally.
 */
describe('Asset class: BridgeNft', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})

  let collection: HolographLegacyCollection
  let bridgeNft: BridgeNft
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

    const myNft = new NFT({
      collection,
      metadata: {
        name: 'My new NFT',
        description: 'Probably nothing.',
        creator: 'Holograph Protocol',
      },
      ipfsInfo: {
        ipfsImageCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32',
        ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
      },
    })

    const {tokenId, txHash} = await myNft.mint({
      chainId: sourceChainId,
    })

    contractAddress = collectionAddress

    bridgeNft = new BridgeNft(configObject, {
      sourceChainId,
      destinationChainId,
      contractAddress,
      tokenId,
      from: accountAddress,
    })
  })

  it('should be able to get the BridgeNft wrapper class', () => {
    expect(BridgeCollection).toHaveProperty('createInitCode')

    expect(bridgeNft).toHaveProperty('getInitCode')
    expect(bridgeNft).toHaveProperty('bridgeOut')
  })

  describe('getInitCode()', () => {
    it('should be able to get the bridge out request init code', async () => {
      const bridgeOutPayload = await bridgeNft.getInitCode()

      expectTypeOf(bridgeOutPayload).toBeString()
      expect(bridgeOutPayload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('bridgeOut()', () => {
    it('should be able to bridge a NFT', async () => {
      const tx = await bridgeNft.bridgeOut(wallet)

      console.log('tx: ', tx)

      const receipt = await wallet.onChain(sourceChainId).getTransactionReceipt({hash: tx.hash})
      expect(receipt.status).toBe('success')
    })
  })
})
