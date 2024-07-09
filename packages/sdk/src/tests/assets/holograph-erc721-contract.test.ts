import {beforeEach, describe, expect, it} from 'vitest'
import {isAddress} from 'viem'

import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {ContractRevertError} from '../../errors'
import {HolographWallet} from '../../services'
import {testConfigObject, localhostContractAddresses, LOCALHOST2_CHAIN_ID} from '../setup'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

describe('Asset class: HolographERC721Contract', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const accountAddress = account?.address
  let contract: HolographERC721Contract
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})

  beforeEach(() => {
    contract = new HolographERC721Contract({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        symbol: 'HOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: LOCALHOST2_CHAIN_ID,
    })
  })

  it('should be able to get the contract wrapper class', () => {
    expect(contract).toHaveProperty('_getFactoryAddress')
    expect(contract).toHaveProperty('_getRegistryAddress')
    expect(contract).toHaveProperty('_getPredictedContractAddress')
    expect(contract).toHaveProperty('_generateInitCode')
    expect(contract).toHaveProperty('_getContractPayload')
    expect(contract).toHaveProperty('_estimateGasForDeployingContract')
    expect(contract).toHaveProperty('getContractInfo')
    expect(contract).toHaveProperty('signDeploy')
    expect(contract).toHaveProperty('deploy')
  })

  describe('getContractInfo()', () => {
    it('should be able to get the contract info', () => {
      const contractInfo = contract.getContractInfo()

      expect(contractInfo).toHaveProperty('name')
      expect(contractInfo).toHaveProperty('symbol')
      expect(contractInfo).toHaveProperty('royaltiesPercentage')
      expect(contractInfo).toHaveProperty('salt')
      expect(contractInfo.name).toBe('NFTs Without Boundaries')
      expect(contractInfo.symbol).toBe('HOLO')
      expect(contractInfo.royaltiesPercentage).toBe(2000)
    })
  })

  describe('_getFactoryAddress()', () => {
    it('should be able to get the correct factory address', async () => {
      const factoryAddress = await contract['_getFactoryAddress']()

      expect(factoryAddress).toBe(localhostContractAddresses.holographFactory)
    })
  })

  describe('_getRegistryAddress()', () => {
    it('should be able to get the correct registry address', async () => {
      const registryAddress = await contract['_getRegistryAddress']()

      expect(registryAddress).toBe(localhostContractAddresses.holographRegistry)
    })
  })

  describe('_getPredictedContractAddress()', () => {
    it('should be able to get the correct predicted contract address', async () => {
      const contractPayload = await contract['_getContractPayload'](accountAddress)
      const predictedContractAddress = await contract['_getPredictedContractAddress'](
        contractPayload.config.erc721ConfigHash,
      )

      expect(predictedContractAddress).toBe(contractPayload.config.erc721FutureAddress)
    })
  })

  describe('_generateInitCode()', () => {
    it('should be able to generate the correct init code', async () => {
      const initCode = await contract['_generateInitCode'](accountAddress)

      expect(typeof initCode).toBe('string')
      expect(initCode.startsWith('0x')).to.be.true
    })
  })

  describe('_getContractPayload()', () => {
    it('should be able to get the correct contract payload', async () => {
      const contractPayload = await contract['_getContractPayload'](accountAddress)
      const {
        config: {
          erc721Config: {byteCode, chainType, contractType, initCode, salt},
          erc721ConfigHash,
          erc721FutureAddress,
          erc721Hash,
        },
      } = contractPayload
      const properties = [byteCode, contractType, erc721Hash, erc721ConfigHash, erc721FutureAddress, initCode, salt]

      expect(contractPayload).toHaveProperty('config')
      expect(contractPayload).toHaveProperty('salt')
      expect(contractPayload.config).toHaveProperty('erc721Hash')
      expect(contractPayload.config).toHaveProperty('erc721Config')
      expect(contractPayload.config).toHaveProperty('erc721ConfigHash')
      expect(contractPayload.config).toHaveProperty('erc721ConfigHashBytes')
      expect(contractPayload.config).toHaveProperty('erc721FutureAddress')

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(chainType).not.toBeUndefined()
      expect(chainType).to.be.a('number')
    })
  })

  describe('_estimateGasForDeployingContract()', () => {
    it('should be able to estimate the gas for deploying the contract', async () => {
      await sleep(500) // Sleep to avoid nonce issues
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

      const properties = [account, byteCode, contractType, initCode, salt, r, s, v]

      properties.forEach(property => {
        expect(property).not.toBeUndefined()
        expect(property).to.be.an('string')
        expect(property.toString().startsWith('0x')).to.be.true
      })

      expect(chainType).not.toBeUndefined()
      expect(chainType).to.be.a('number')
    })
  })

  describe('deploy()', () => {
    it('should be able to deploy a contract', async () => {
      await sleep(500) // Sleep to avoid nonce issues
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
