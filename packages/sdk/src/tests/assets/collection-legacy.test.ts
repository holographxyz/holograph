import {beforeEach, describe, expect, it} from 'vitest'

import {HolographLegacyCollection} from '../../assets/collection-legacy'
import {ContractRevertError} from '../../errors'
import {HolographWallet} from '../../services'
import {configObject, localhostContractAddresses, LOCALHOST2_CHAIN_ID} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

describe('Asset class: HolographLegacyCollection', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  let collection: HolographLegacyCollection
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})

  beforeEach(() => {
    collection = new HolographLegacyCollection(configObject, {
      collectionInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
  })

  it('should be able to get the collection wrapper class', () => {
    expect(collection).toHaveProperty('_getFactoryAddress')
    expect(collection).toHaveProperty('_getRegistryAddress')
    expect(collection).toHaveProperty('_getPredictedCollectionAddress')
    expect(collection).toHaveProperty('_generateInitCode')
    expect(collection).toHaveProperty('_getCollectionPayload')
    expect(collection).toHaveProperty('_estimateGasForDeployingCollection')
    expect(collection).toHaveProperty('getCollectionInfo')
    expect(collection).toHaveProperty('signDeploy')
    expect(collection).toHaveProperty('deploy')
    expect(collection).toHaveProperty('deployBatch')
  })

  describe('getCollectionInfo()', () => {
    it('should be able to get the collection info', () => {
      const collectionInfo = collection.getCollectionInfo()

      expect(collectionInfo).toHaveProperty('name')
      expect(collectionInfo).toHaveProperty('description')
      expect(collectionInfo).toHaveProperty('symbol')
      expect(collectionInfo).toHaveProperty('royaltiesBps')
      expect(collectionInfo).toHaveProperty('tokenType')
      expect(collectionInfo).toHaveProperty('salt')
      expect(collectionInfo.name).toBe('NFTs Without Boundaries')
      expect(collectionInfo.description).toBe('Probably nothing')
      expect(collectionInfo.symbol).toBe('HOLO')
      expect(collectionInfo.royaltiesBps).toBe(2000)
      expect(collectionInfo.tokenType).toBe('ERC721')
    })
  })

  describe('_getFactoryAddress()', () => {
    it('should be able to get the correct factory address', async () => {
      const factoryAddress = await collection._getFactoryAddress()

      expect(factoryAddress).toBe(localhostContractAddresses.holographFactory)
    })
  })

  describe('_getRegistryAddress()', () => {
    it('should be able to get the correct registry address', async () => {
      const registryAddress = await collection._getRegistryAddress()

      expect(registryAddress).toBe(localhostContractAddresses.holographRegistry)
    })
  })

  describe('_getPredictedCollectionAddress()', () => {
    it('should be able to get the correct predicted collection address', async () => {
      const collectionPayload = await collection._getCollectionPayload(accountAddress)
      const predictedCollectionAddress = await collection._getPredictedCollectionAddress(
        collectionPayload.config.erc721ConfigHash,
      )

      expect(predictedCollectionAddress).toBe(collectionPayload.config.erc721FutureAddress)
    })
  })

  describe('_generateInitCode()', () => {
    it('should be able to generate the correct init code', async () => {
      const initCode = await collection._generateInitCode(accountAddress)

      expect(typeof initCode).toBe('string')
      expect(initCode.startsWith('0x')).to.be.true
    })
  })

  describe('_getCollectionPayload()', () => {
    it('should be able to get the correct collection payload', async () => {
      const collectionPayload = await collection._getCollectionPayload(accountAddress)
      const {
        config: {
          erc721Config: {byteCode, chainType, contractType, initCode, salt},
          erc721ConfigHash,
          erc721FutureAddress,
          erc721Hash,
        },
      } = collectionPayload
      const properties = [byteCode, contractType, erc721Hash, erc721ConfigHash, erc721FutureAddress, initCode, salt]

      expect(collectionPayload).toHaveProperty('config')
      expect(collectionPayload).toHaveProperty('salt')
      expect(collectionPayload.config).toHaveProperty('erc721Hash')
      expect(collectionPayload.config).toHaveProperty('erc721Config')
      expect(collectionPayload.config).toHaveProperty('erc721ConfigHash')
      expect(collectionPayload.config).toHaveProperty('erc721ConfigHashBytes')
      expect(collectionPayload.config).toHaveProperty('erc721FutureAddress')

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(chainType).not.toBeUndefined()
      expect(chainType).to.be.a('bigint')
    })
  })

  describe('_estimateGasForDeployingCollection()', () => {
    it('should be able to estimate the gas for deploying the collection', async () => {
      const signatureData = await collection.signDeploy(wallet)
      const gasEstimation = await collection._estimateGasForDeployingCollection(signatureData)
      const gasPrice = Number(gasEstimation.gasPrice)
      const gasLimit = Number(gasEstimation.gasLimit)
      const gas = Number(gasEstimation.gas)

      expect(gasEstimation).toHaveProperty('gasPrice')
      expect(gasEstimation).toHaveProperty('gasLimit')
      expect(gasPrice).toBeGreaterThan(0)
      expect(gasLimit).toBeGreaterThan(0)
      expect(gas).toBe(gasPrice * gasLimit)
    })
  })

  describe('signDeploy()', () => {
    it('should be able to sign the collection deployment', async () => {
      const signatureData = await collection.signDeploy(wallet)

      expect(signatureData).toHaveProperty('account')
      expect(signatureData).toHaveProperty('config')
      expect(signatureData).toHaveProperty('signature')
      expect(signatureData.config).toHaveProperty('contractType')
      expect(signatureData.config).toHaveProperty('chainType')
      expect(signatureData.config).toHaveProperty('salt')
      expect(signatureData.config).toHaveProperty('byteCode')
      expect(signatureData.config).toHaveProperty('initCode')
      expect(signatureData.signature).toHaveProperty('r')
      expect(signatureData.signature).toHaveProperty('s')
      expect(signatureData.signature).toHaveProperty('v')

      const {
        account,
        config: {byteCode, chainType, contractType, initCode, salt},
        signature: {r, s, v},
      } = signatureData

      const properties = [account, byteCode, contractType, initCode, salt, r, s, v]

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(chainType).not.toBeUndefined()
      expect(chainType).to.be.a('bigint')
    })
  })

  describe('deploy()', () => {
    it('should be able to deploy a collection', async () => {
      await sleep(250) // Sleep to avoid nonce issues
      const signatureData = await collection.signDeploy(wallet)
      const txHash = await collection.deploy(signatureData)

      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(String(txHash).startsWith('0x')).to.be.true
    })

    it('should throw an error if the collection is already deployed', async () => {
      const signatureData = await collection.signDeploy(wallet)
      await collection.deploy(signatureData)

      try {
        await collection.deploy(signatureData)
      } catch (err: unknown) {
        const errorMessage = (err as ContractRevertError).message

        expect(errorMessage).toContain('HOLOGRAPH: already deployed')
      }
    })
  })
})
