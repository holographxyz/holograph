import {beforeEach, describe, expect, it} from 'vitest'

import {HolographMoeERC721DropV2} from '../../assets/collection-moe'
import {bytecodes} from '../../constants/bytecodes'
import {ContractRevertError} from '../../errors'
import {HolographWallet} from '../../services'
import {configObject, localhostContractAddresses, LOCALHOST2_CHAIN_ID} from '../setup'
import {enableDropEventsV2, generateRandomSalt} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'
import {isAddress} from 'viem'

describe('Asset class: HolographMoeERC721DropV2', () => {
  const account: HolographAccount = configObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, chainsRpc: configObject.networks})
  let collection: HolographMoeERC721DropV2

  beforeEach(() => {
    collection = new HolographMoeERC721DropV2(configObject, {
      collectionInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsUrl: 'ipfs://fileurl.com/file://',
        ipfsImageCid: 'QmQJNvXvNqfDAV4srQ8dRr8s4FYBKB67RnWhvWLvE72osu',
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSaleStart: '2025-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-02T00:00:00Z',
        publicSalePrice: 25,
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
  })

  it('should be able to get the collection wrapper class', () => {
    expect(collection).toHaveProperty('_getRegistryAddress')
    expect(collection).toHaveProperty('_getMetadataRendererAddress')
    expect(collection).toHaveProperty('_generateMetadataRendererInitCode')
    expect(collection).toHaveProperty('_getDropContractType')
    expect(collection).toHaveProperty('_getDropInitCode')
    expect(collection).toHaveProperty('_getEventConfig')
    expect(collection).toHaveProperty('_generateHolographDropERC721InitCode')
    expect(collection).toHaveProperty('_generateHolographERC721InitCode')
    expect(collection).toHaveProperty('_getCollectionPayload')
    expect(collection).toHaveProperty('_estimateGasForDeployingCollection')
    expect(collection).toHaveProperty('getCollectionInfo')
    expect(collection).toHaveProperty('signDeploy')
    expect(collection).toHaveProperty('deploy')
    expect(collection).toHaveProperty('deployBatch')
  })

  describe('getCollectionInfo()', () => {
    it('should be able to get the collection info', () => {
      const info = collection.getCollectionInfo()

      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('description')
      expect(info).toHaveProperty('symbol')
      expect(info).toHaveProperty('royaltiesBps')
      expect(info).toHaveProperty('tokenType')
      expect(info).toHaveProperty('salt')
      expect(info).toHaveProperty('ipfsUrl')
      expect(info).toHaveProperty('ipfsImageCid')
      expect(info).toHaveProperty('maxSalePurchasePerAddress')
      expect(info).toHaveProperty('publicSaleStart')
      expect(info).toHaveProperty('publicSaleEnd')
      expect(info).toHaveProperty('publicSalePrice')
      expect(info.name).toBe('NFTs Without Boundaries')
      expect(info.description).toBe('Probably nothing')
      expect(info.symbol).toBe('HOLO')
      expect(info.royaltiesBps).toBe(2000)
      expect(info.tokenType).toBe('ERC721')
      expect(info.ipfsUrl).toBe('ipfs://fileurl.com/file://')
      expect(info.ipfsImageCid).toBe('QmQJNvXvNqfDAV4srQ8dRr8s4FYBKB67RnWhvWLvE72osu')
      expect(info.maxSalePurchasePerAddress).toBe(10)
      expect(info.publicSaleStart).toBe('2025-01-01T00:00:00Z')
      expect(info.publicSaleEnd).toBe('2025-01-02T00:00:00Z')
      expect(info.publicSalePrice).toBe(25)
    })
  })

  describe('_getRegistryAddress()', () => {
    it('should be able to get the correct registry address', async () => {
      const registryAddress = await collection._getRegistryAddress()
      expect(registryAddress).toBe(localhostContractAddresses.holographRegistry)
    })
  })

  describe('_getMetadataRendererAddress()', () => {
    it('should be able to get the correct metadata renderer address', async () => {
      const metadataRendererAddress = collection._getMetadataRendererAddress()

      expect(metadataRendererAddress).toBe(localhostContractAddresses.editionsMetadataRenderer.toLowerCase())
    })
  })

  describe('_getEventConfig()', () => {
    it('should be able to get the correct event config', async () => {
      const eventConfig = collection._getEventConfig()

      expect(eventConfig).toBe(enableDropEventsV2())
    })
  })

  describe('_generateMetadataRendererInitCode()', () => {
    it('should be able to generate the correct metadata renderer init code', async () => {
      const imageFileName = collection.nftIpfsUrl.split('/').at(-1)
      const metadataRendererInitCode = collection._generateMetadataRendererInitCode(
        JSON.stringify(collection.description).slice(1, -1),
        `ipfs://${collection.nftIpfsImageCid}/${imageFileName}`,
      )

      expect(metadataRendererInitCode).not.toBeUndefined()
      expect(metadataRendererInitCode).to.be.an('string')
      expect(metadataRendererInitCode.startsWith('0x')).to.be.true
    })
  })

  describe('_getCollectionPayload()', () => {
    it('should be able to get the correct collection payload', async () => {
      const collectionPayload = await collection._getCollectionPayload(accountAddress)
      const {byteCode, chainType, configHash, configHashBytes, contractType, initCode, salt} = collectionPayload
      const properties = [byteCode, chainType, configHash, contractType, initCode, salt]

      expect(collectionPayload).toHaveProperty('byteCode')
      expect(collectionPayload).toHaveProperty('chainType')
      expect(collectionPayload).toHaveProperty('configHash')
      expect(collectionPayload).toHaveProperty('configHashBytes')
      expect(collectionPayload).toHaveProperty('contractType')
      expect(collectionPayload).toHaveProperty('initCode')
      expect(collectionPayload).toHaveProperty('salt')
      expect(collectionPayload.byteCode).toBe(bytecodes.HolographDropERC721)
      expect(configHashBytes).to.be.a('Uint8Array')

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })
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

      const properties = [account, byteCode, chainType, contractType, initCode, salt, r, s]

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(Number(v)).to.be.greaterThan(0)
    })
  })

  describe('deploy()', () => {
    it('should be able to deploy a collection', async () => {
      const signatureData = await collection.signDeploy(wallet)
      const {collectionAddress, txHash} = await collection.deploy(signatureData)

      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(String(txHash).startsWith('0x')).to.be.true
      expect(collectionAddress).to.be.an('string')
      expect(collectionAddress).to.have.length(42)
      expect(isAddress(collectionAddress)).to.be.true
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
