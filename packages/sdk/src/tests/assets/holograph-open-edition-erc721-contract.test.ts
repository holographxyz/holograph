import {beforeEach, describe, expect, it} from 'vitest'
import {isAddress} from 'viem'

import {HolographOpenEditionERC721ContractV2} from '../../assets/holograph-open-edition-erc721-contract'
import {bytecodes} from '../../constants/bytecodes'
import {ContractRevertError} from '../../errors'
import {HolographWallet} from '../../services'
import {testConfigObject, localhostContractAddresses, LOCALHOST2_CHAIN_ID} from '../setup'
import {enableOpenEditionEventsV2, generateRandomSalt} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

describe('Asset class: HolographOpenEditionERC721ContractV2', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})
  let contract: HolographOpenEditionERC721ContractV2

  beforeEach(() => {
    contract = new HolographOpenEditionERC721ContractV2({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing.',
        symbol: 'HOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
        ipfsImageCid: 'QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93',
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

  it('should be able to get the contract wrapper class', () => {
    expect(contract).toHaveProperty('_getRegistryAddress')
    expect(contract).toHaveProperty('_getMetadataRendererAddress')
    expect(contract).toHaveProperty('_generateMetadataRendererInitCode')
    expect(contract).toHaveProperty('_getOpenEditionContractType')
    expect(contract).toHaveProperty('_getOpenEditionInitCode')
    expect(contract).toHaveProperty('_getEventConfig')
    expect(contract).toHaveProperty('_generateHolographOpenEditionERC721InitCode')
    expect(contract).toHaveProperty('_generateHolographERC721InitCode')
    expect(contract).toHaveProperty('_getContractPayload')
    expect(contract).toHaveProperty('_estimateGasForDeployingContract')
    expect(contract).toHaveProperty('getContractInfo')
    expect(contract).toHaveProperty('signDeploy')
    expect(contract).toHaveProperty('deploy')
  })

  describe('getContractInfo()', () => {
    it('should be able to get the contract info', () => {
      const info = contract.getContractInfo()

      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('description')
      expect(info).toHaveProperty('symbol')
      expect(info).toHaveProperty('royaltiesPercentage')
      expect(info).toHaveProperty('salt')
      expect(info).toHaveProperty('ipfsUrl')
      expect(info).toHaveProperty('ipfsImageCid')
      expect(info).toHaveProperty('maxSalePurchasePerAddress')
      expect(info).toHaveProperty('publicSaleStart')
      expect(info).toHaveProperty('publicSaleEnd')
      expect(info).toHaveProperty('publicSalePrice')
      expect(info.name).toBe('NFTs Without Boundaries')
      expect(info.description).toBe('Probably nothing.')
      expect(info.symbol).toBe('HOLO')
      expect(info.royaltiesPercentage).toBe(2000)
      expect(info.ipfsUrl).toBe(
        'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
      )
      expect(info.ipfsImageCid).toBe('QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93')
      expect(info.maxSalePurchasePerAddress).toBe(10)
      expect(info.publicSaleStart).toBe('2025-01-01T00:00:00Z')
      expect(info.publicSaleEnd).toBe('2025-01-02T00:00:00Z')
      expect(info.publicSalePrice).toBe(25)
    })
  })

  describe('_getRegistryAddress()', () => {
    it('should be able to get the correct registry address', async () => {
      const registryAddress = await contract['_getRegistryAddress']()
      expect(registryAddress).toBe(localhostContractAddresses.holographRegistry)
    })
  })

  describe('_getMetadataRendererAddress()', () => {
    it('should be able to get the correct metadata renderer address', async () => {
      const metadataRendererAddress = contract['_getMetadataRendererAddress']()

      expect(metadataRendererAddress).toBe(localhostContractAddresses.editionsMetadataRenderer.toLowerCase())
    })
  })

  describe('_getEventConfig()', () => {
    it('should be able to get the correct event config', async () => {
      const eventConfig = contract['_getEventConfig']()

      expect(eventConfig).toBe(enableOpenEditionEventsV2())
    })
  })

  describe('_generateMetadataRendererInitCode()', () => {
    it('should be able to generate the correct metadata renderer init code', async () => {
      const imageFileName = contract.nftIpfsUrl.split('/').at(-1)
      const metadataRendererInitCode = contract['_generateMetadataRendererInitCode'](
        JSON.stringify(contract.description).slice(1, -1),
        `ipfs://${contract.nftIpfsImageCid}/${imageFileName}`,
      )

      expect(metadataRendererInitCode).not.toBeUndefined()
      expect(metadataRendererInitCode).to.be.an('string')
      expect(metadataRendererInitCode.startsWith('0x')).to.be.true
    })
  })

  describe('_getContractPayload()', () => {
    it('should be able to get the correct contract payload', async () => {
      const contractPayload = await contract['_getContractPayload'](accountAddress)
      const {byteCode, chainType, configHash, configHashBytes, contractType, initCode, salt} = contractPayload
      const properties = [byteCode, configHash, contractType, initCode, salt]

      expect(contractPayload).toHaveProperty('byteCode')
      expect(contractPayload).toHaveProperty('chainType')
      expect(contractPayload).toHaveProperty('configHash')
      expect(contractPayload).toHaveProperty('configHashBytes')
      expect(contractPayload).toHaveProperty('contractType')
      expect(contractPayload).toHaveProperty('initCode')
      expect(contractPayload).toHaveProperty('salt')
      expect(chainType).to.be.a('string')
      expect(contractPayload.byteCode).toBe(bytecodes.HolographDropERC721)
      expect(configHashBytes).to.be.a('Uint8Array')

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })
    })
  })

  describe('_estimateGasForDeployingContract()', () => {
    it('should be able to estimate the gas for deploying the contract', async () => {
      const signatureData = await contract.signDeploy(wallet)
      const gasEstimation = await contract['_estimateGasForDeployingContract'](signatureData)
      const gasPrice = gasEstimation.gasPrice
      const gasLimit = gasEstimation.gasLimit
      const gas = gasEstimation.gas

      expect(gasEstimation).toHaveProperty('gasPrice')
      expect(gasEstimation).toHaveProperty('gasLimit')
      expect(gasPrice).toBeGreaterThan(0)
      expect(gasLimit).toBeGreaterThan(0)
      expect(gas).toBe(gasPrice * gasLimit)
    })
  })

  describe('signDeploy()', () => {
    it('should be able to sign the contract deployment', async () => {
      const signatureData = await contract.signDeploy(wallet)

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

      const properties = [account, byteCode, contractType, initCode, salt, r, s]

      expect(chainType).to.be.a('string')

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(Number(v)).to.be.greaterThan(0)
    })
  })

  describe('deploy()', () => {
    it('should be able to deploy a contract', async () => {
      const signatureData = await contract.signDeploy(wallet)
      const {contractAddress, txHash} = await contract.deploy(signatureData)

      expect(txHash).to.be.an('string')
      expect(txHash).to.have.length(66)
      expect(txHash.startsWith('0x')).to.be.true
      expect(contractAddress).to.be.an('string')
      expect(contractAddress).to.have.length(42)
      expect(isAddress(contractAddress)).to.be.true
    })

    it('should throw an error if the contract is already deployed', async () => {
      const signatureData = await contract.signDeploy(wallet)
      await contract.deploy(signatureData)

      try {
        await contract.deploy(signatureData)
      } catch (err: unknown) {
        const errorMessage = (err as ContractRevertError).message

        expect(errorMessage).toContain('HOLOGRAPH: already deployed')
      }
    })
  })
})
