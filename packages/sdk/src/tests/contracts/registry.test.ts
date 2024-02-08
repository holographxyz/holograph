import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {Config} from '../../services/config.service'
import {Registry} from '../../contracts'
import {Providers} from '../../services'
import {Address} from 'abitype'
import {ZeroAddress} from 'ethers'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

//NOTICE: the expected values are for the development env -> 0x8dd0A4D129f03F1251574E545ad258dE26cD5e97
const expectedValues = {
  contractAddress: '0xae27815bcf7cca7191cb55a6b86576aedc462bbb',
  holographAddress: '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97',
  hToken: '0x0000000000000000000000000000000000000000',
  utilityTokenAddress: '0x01F3f1Ce33592a548a2EdF047Fe331f8A5Eb4389',
  holographedContractExample: '0xf84449429f9e0d27cdf0745b7f34eba0a0fb00df', // deployed to both networks
  notHolographedContractExample: '0x43dff9458D67f49E8F9BE56c7E6a9Fc8FA2640b3',
  deployedContractHash: '0xb70ca02e6ec6da877005687b50ab3d614c6b27a0f1cafc6d13242e6b617c5bda', // deployed to both networks
  deployedContractHashAddress: '0xf84449429F9e0d27cdf0745B7F34EbA0A0Fb00dF',
  notDeployedContractHash: '0x0000000000000000000000000000000000000000000000000000011aa9999999',
  notAcontractType: '0x0000000000000000000000000000000000486f6c6f6772617068455243370000',
  contractType: '0x0000000000000000000000000000000000486f6c6f6772617068455243373231',
  contractTypeAddress: '0x14231223247689deCCf0e4Bd9a9491410B4d7C51',
}

describe('Contract class: Registry', () => {
  let config: Config
  let providersWrapper: Providers
  let registry: Registry
  const chainIds = Object.keys(NETWORKS_MOCK)

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    registry = new Registry(config)
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers

    expect(multiProviders).toHaveProperty(chainIds[0])
    expect(multiProviders).toHaveProperty(chainIds[1])
  })

  it('should be able to get the Registry wrapper class', () => {
    expect(registry).toHaveProperty('isHolographedContract')
    expect(registry).toHaveProperty('isHolographedHashDeployed')
    expect(registry).toHaveProperty('getContractTypeAddress')
  })

  it('should be able to get the correct Registry contract address according to the environment and chainId', async () => {
    const address = (await registry.getAddress(Number(chainIds[1]))).toLowerCase()
    expect(address).toBe(expectedValues.contractAddress)
  })

  describe('isHolographedContract():', () => {
    it('should be able to validate a holographed contract', async () => {
      const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
      const isHolographedContract = await registry.isHolographedContract(
        chainId,
        expectedValues.holographedContractExample as Address,
      )
      expect(isHolographedContract).toBe('true')
    })

    it('should be able to validate that a contract is not holographed', async () => {
      const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
      const isHolographedContract = await registry.isHolographedContract(
        chainId,
        expectedValues.notHolographedContractExample as Address,
      )
      expect(isHolographedContract).toBe('false')
    })
  })

  describe('isHolographedContractByNetworks():', () => {
    it('should be able to validate a holographed contract per network', async () => {
      const isHolographedContractByNetworks = await registry.isHolographedContractByNetworks(
        expectedValues.holographedContractExample as Address,
      )
      expect(Object.keys(isHolographedContractByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      expect(isHolographedContractByNetworks[Object.keys(NETWORKS_MOCK)[0]]).toBe('true')
      expect(isHolographedContractByNetworks[Object.keys(NETWORKS_MOCK)[1]]).toBe('true')
    })

    it('should be able to validate that a contract is not holographed', async () => {
      const isHolographedContractByNetworks = await registry.isHolographedContractByNetworks(
        expectedValues.notHolographedContractExample as Address,
      )
      expect(Object.keys(isHolographedContractByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      Object.values(isHolographedContractByNetworks).forEach(isHolographedContract => {
        expect(isHolographedContract).toBe('false')
      })
    })
  })

  describe('isHolographedHashDeployed():', () => {
    it("should be able to validate a deployed contract using it's deployement config hash", async () => {
      const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
      const isDeployed = await registry.isHolographedHashDeployed(
        chainId,
        expectedValues.deployedContractHash as Address,
      )
      expect(isDeployed).toBe('true')
    })

    it("should be able to validate that a contract is not deployed contract using it's deployement config hash", async () => {
      const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
      const isDeployed = await registry.isHolographedHashDeployed(
        chainId,
        expectedValues.notDeployedContractHash as Address,
      )
      expect(isDeployed).toBe('false')
    })
  })

  describe('isHolographedHashDeployedByNetworks():', () => {
    it("should be able to validate a deployed contract using it's deployement config hash per network", async () => {
      const isDeployedByNetworks = await registry.isHolographedHashDeployedByNetworks(
        expectedValues.deployedContractHash as Address,
      )

      expect(Object.keys(isDeployedByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      expect(isDeployedByNetworks[Object.keys(NETWORKS_MOCK)[0]]).toBe('true')
      expect(isDeployedByNetworks[Object.keys(NETWORKS_MOCK)[1]]).toBe('true')
    })

    it("should be able to validate that a contract is not deployed contract using it's deployement config hash per network", async () => {
      const isDeployedByNetworks = await registry.isHolographedHashDeployedByNetworks(
        expectedValues.notDeployedContractHash as Address,
      )

      expect(Object.keys(isDeployedByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      Object.values(isDeployedByNetworks).forEach(isDeployed => {
        expect(isDeployed).toBe('false')
      })
    })
  })

  describe('getHolographedHashAddress():', () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    it('should return the contract address for a holographed hash', async () => {
      const isDeployed = await registry.getHolographedHashAddress(
        chainId,
        expectedValues.deployedContractHash as Address,
      )
      expect(isDeployed).toBe(expectedValues.deployedContractHashAddress)
    })

    it('should return the zero address for a holographed hash that is not deployed', async () => {
      const isDeployed = await registry.getHolographedHashAddress(
        chainId,
        expectedValues.notDeployedContractHash as Address,
      )
      expect(isDeployed).toBe(ZeroAddress)
    })
  })

  it('getHolographedHashAddressContractsByNetworks(): should return the contract address for a deployed holographed hash per network ', async () => {
    const contractAddressByNetwork = await registry.getHolographedHashAddressContractsByNetworks(
      expectedValues.deployedContractHash as Address,
    )

    expect(Object.keys(contractAddressByNetwork)).toEqual(Object.keys(NETWORKS_MOCK))

    expect(contractAddressByNetwork[Object.keys(NETWORKS_MOCK)[0]]).toBe(expectedValues.deployedContractHashAddress)
    expect(contractAddressByNetwork[Object.keys(NETWORKS_MOCK)[1]]).toBe(expectedValues.deployedContractHashAddress)
  })

  describe('getContractTypeAddress():', () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    it('should return the correct contract address for the provided contract type', async () => {
      const contractTypeAddress = await registry.getContractTypeAddress(chainId, expectedValues.contractType as Address)
      expect(contractTypeAddress).toBe(expectedValues.contractTypeAddress)
    })

    it('should return the zero address when an invalid contract type is provided', async () => {
      const contractTypeAddress = await registry.getContractTypeAddress(
        chainId,
        expectedValues.notAcontractType as Address,
      )
      expect(contractTypeAddress).toBe(ZeroAddress)
    })
  })

  describe('getContractTypeAddressByNetworks():', () => {
    it('should return the correct contract address for the provided contract type for each network', async () => {
      const contractTypeAddressByNetworks = await registry.getContractTypeAddressByNetworks(
        expectedValues.contractType as Address,
      )

      expect(Object.keys(contractTypeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      Object.values(contractTypeAddressByNetworks).forEach(contractTypeAddress => {
        expect(contractTypeAddress).toBe(expectedValues.contractTypeAddress)
      })
    })

    it('should return the zero address when an invalid contract type is provided for each network', async () => {
      const contractTypeAddressByNetworks = await registry.getContractTypeAddressByNetworks(
        expectedValues.notAcontractType as Address,
      )

      expect(Object.keys(contractTypeAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

      Object.values(contractTypeAddressByNetworks).forEach(contractTypeAddress => {
        expect(contractTypeAddress).toBe(ZeroAddress)
      })
    })
  })

  it('getHolograph(): should return the correct Holograph contract address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const holographAddress = await registry.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getHolographByNetworks(): should return the correct Holograph contract address per network', async () => {
    const holographAddressByNetworks = await registry.getHolographByNetworks()

    expect(Object.keys(holographAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(holographAddressByNetworks).forEach(holographAddress => {
      expect(holographAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getHToken(): should return the correct HToken address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const hTokenAddress = await registry.getHToken(chainId)
    expect(hTokenAddress).toBe(expectedValues.hToken)
  })

  it('getHTokenByNetworks(): should return the correct HToken address per network', async () => {
    const hTokenAddressByNetworks = await registry.getHTokenByNetworks()

    expect(Object.keys(hTokenAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(hTokenAddressByNetworks).forEach(hTokenAddress => {
      expect(hTokenAddress).toBe(expectedValues.hToken)
    })
  })

  it('getUtilityToken(): should return the correct Holograph Utility Token address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const utilityTokenAddress = await registry.getUtilityToken(chainId)
    expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
  })

  it('getUtilityTokenByNetworks(): should return the correct Holograph Utility Token address per network', async () => {
    const utilityTokenAddressByNetworks = await registry.getUtilityTokenByNetworks()

    expect(Object.keys(utilityTokenAddressByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(utilityTokenAddressByNetworks).forEach(utilityTokenAddress => {
      expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
    })
  })

  it('getHolographableContracts(): should be return the correct Holograph contract address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const holographableContracts = (await registry.getHolographableContracts(chainId, 0n, 10n)) as string[]
    expectTypeOf(holographableContracts).toBeArray()
    expectTypeOf(holographableContracts).items.toBeString()
  })

  it('getHolographableContractsByNetworks(): should be return the correct Holograph contract address per network', async () => {
    const holographableContractsByNetworks = await registry.getHolographableContractsByNetworks(0n, 10n)

    expect(Object.keys(holographableContractsByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(holographableContractsByNetworks).forEach(holographableContracts => {
      expectTypeOf(holographableContracts as string[]).toBeArray()
      expectTypeOf(holographableContracts).items.toBeString()
    })
  })

  it('getHolographableContractsLength(): should be return the correct Holograph contract address', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const deployedHolographableContracts = (await registry.getHolographableContractsLength(chainId)) as string
    expect(BigInt(deployedHolographableContracts)).toBeGreaterThan(1)
  })

  it('getHolographableContractsLengthByNetworks(): should be return the correct Holograph contract address per network', async () => {
    const deployedHolographableContractsByNetworks = await registry.getHolographableContractsLengthByNetworks()

    expect(Object.keys(deployedHolographableContractsByNetworks)).toEqual(Object.keys(NETWORKS_MOCK))

    Object.values(deployedHolographableContractsByNetworks).forEach(deployedHolographableContracts => {
      expect(BigInt(deployedHolographableContracts as string)).toBeGreaterThan(1)
    })
  })
})
