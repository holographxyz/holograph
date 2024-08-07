import {Address} from 'abitype'
import {Hex} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {Addresses} from '../../constants/addresses'
import {RegistryContract} from '../../contracts'
import {Providers} from '../../services'
import {testConfigObject, localhostContractAddresses} from '../setup'
import {getChainIdsByNetworksConfig} from '../../utils/helpers'

// TODO: localhost deployment needs to better configure this contract and create an example
const expectedValues = {
  contractAddress: localhostContractAddresses.holographRegistry,
  holographAddress: localhostContractAddresses.holograph,
  hToken: Addresses.zero(),
  utilityTokenAddress: localhostContractAddresses.holographUtilityToken,
  holographedContractExample: Addresses.zero(), // deployed to both networks
  notHolographedContractExample: '0x43dff9458D67f49E8F9BE56c7E6a9Fc8FA2640b3',
  deployedContractHash: '0xb70ca02e6ec6da877005687b50ab3d614c6b27a0f1cafc6d13242e6b617c5bda', // deployed to both networks
  deployedContractHashAddress: '0xf84449429F9e0d27cdf0745B7F34EbA0A0Fb00dF',
  notDeployedContractHash: '0x0000000000000000000000000000000000000000000000000000011aa9999999',
  notAcontractType: '0x0000000000000000000000000000000000486f6c6f6772617068455243370000',
  contractType: '0x0000000000000000000000000000000000486f6c6f6772617068455243373231',
  contractTypeAddress: '0x14231223247689deCCf0e4Bd9a9491410B4d7C51',
}

describe('Contract class: RegistryContract', () => {
  let providersWrapper: Providers
  let registry: RegistryContract
  const chainIds = getChainIdsByNetworksConfig(testConfigObject.networks)

  beforeAll(() => {
    providersWrapper = new Providers()
    registry = new RegistryContract()
  })

  it('should be able to get the correct providers', () => {
    const multiProviders = providersWrapper.providers

    expect(multiProviders).toHaveProperty(String(chainIds[0]))
    expect(multiProviders).toHaveProperty(String(chainIds[1]))
  })

  it('should be able to get the RegistryContract wrapper class', () => {
    expect(registry).toHaveProperty('getAddress')
    expect(registry).toHaveProperty('isHolographedContract')
    expect(registry).toHaveProperty('isHolographedHashDeployed')
    expect(registry).toHaveProperty('getContractTypeAddress')
  })

  it('should be able to get the correct Registry contract address according to the environment and chainId', async () => {
    const address = await registry.getAddress(Number(chainIds[1]))
    expect(address).toBe(expectedValues.contractAddress)
  })

  describe('isHolographedContract():', () => {
    it.skip('should be able to validate a holographed contract', async () => {
      const chainId = chainIds[0]

      const isHolographedContract = await registry.isHolographedContract(
        chainId,
        expectedValues.holographedContractExample as Address,
      )
      expect(isHolographedContract).toBe(true)
    })

    it('should be able to validate that a contract is not holographed', async () => {
      const chainId = chainIds[0]

      const isHolographedContract = await registry.isHolographedContract(
        chainId,
        expectedValues.notHolographedContractExample as Address,
      )
      expect(isHolographedContract).toBe(false)
    })
  })

  describe('isHolographedContractByNetworks():', () => {
    it.skip('should be able to validate a holographed contract per network', async () => {
      const isHolographedContractByNetworks = await registry.isHolographedContractByNetworks(
        expectedValues.holographedContractExample as Address,
      )

      expect(Object.keys(isHolographedContractByNetworks)).toEqual(chainIds.map(String))

      expect(isHolographedContractByNetworks[chainIds[0]]).toBe(true)
      expect(isHolographedContractByNetworks[chainIds[1]]).toBe(true)
    })

    it('should be able to validate that a contract is not holographed', async () => {
      const isHolographedContractByNetworks = await registry.isHolographedContractByNetworks(
        expectedValues.notHolographedContractExample as Address,
      )

      expect(Object.keys(isHolographedContractByNetworks)).toEqual(chainIds.map(String))

      Object.values(isHolographedContractByNetworks).forEach(isHolographedContract => {
        expect(isHolographedContract).toBe(false)
      })
    })
  })

  describe('isHolographedHashDeployed():', () => {
    it.skip("should be able to validate a deployed contract using it's deployement config hash", async () => {
      const chainId = chainIds[0]

      const isDeployed = await registry.isHolographedHashDeployed(
        chainId,
        expectedValues.deployedContractHash as Address,
      )
      expect(isDeployed).toBe(true)
    })

    it("should be able to validate that a contract is not deployed contract using it's deployement config hash", async () => {
      const chainId = chainIds[0]

      const isDeployed = await registry.isHolographedHashDeployed(
        chainId,
        expectedValues.notDeployedContractHash as Address,
      )
      expect(isDeployed).toBe(false)
    })
  })

  describe('isHolographedHashDeployedByNetworks():', () => {
    it.skip("should be able to validate a deployed contract using it's deployement config hash per network", async () => {
      const isDeployedByNetworks = await registry.isHolographedHashDeployedByNetworks(
        expectedValues.deployedContractHash as Address,
      )

      expect(Object.keys(isDeployedByNetworks)).toEqual(chainIds.map(String))

      expect(isDeployedByNetworks[chainIds[0]]).toBe(true)
      expect(isDeployedByNetworks[chainIds[1]]).toBe(true)
    })

    it("should be able to validate that a contract is not deployed contract using it's deployment config hash per network", async () => {
      const isDeployedByNetworks = await registry.isHolographedHashDeployedByNetworks(
        expectedValues.notDeployedContractHash as Hex,
      )

      expect(Object.keys(isDeployedByNetworks)).toEqual(chainIds.map(String))

      Object.values(isDeployedByNetworks).forEach(isDeployed => {
        expect(isDeployed).toBe(false)
      })
    })
  })

  describe('getHolographedHashAddress():', () => {
    const chainId = chainIds[0]

    it.skip('should return the contract address for a holographed hash', async () => {
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
      expect(isDeployed).toBe(Addresses.zero())
    })
  })

  it.skip('getHolographedHashAddressContractsByNetworks(): should return the contract address for a deployed holographed hash per network ', async () => {
    const contractAddressByNetwork = await registry.getHolographedHashAddressContractsByNetworks(
      expectedValues.deployedContractHash as Address,
    )

    expect(Object.keys(contractAddressByNetwork)).toEqual(chainIds.map(String))

    expect(contractAddressByNetwork[chainIds[0]]).toBe(expectedValues.deployedContractHashAddress)
    expect(contractAddressByNetwork[chainIds[1]]).toBe(expectedValues.deployedContractHashAddress)
  })

  describe('getContractTypeAddress():', () => {
    const chainId = chainIds[0]

    it.skip('should return the correct contract address for the provided contract type', async () => {
      const contractTypeAddress = await registry.getContractTypeAddress(chainId, expectedValues.contractType as Address)
      expect(contractTypeAddress).toBe(expectedValues.contractTypeAddress)
    })

    it('should return the zero address when an invalid contract type is provided', async () => {
      const contractTypeAddress = await registry.getContractTypeAddress(
        chainId,
        expectedValues.notAcontractType as Address,
      )
      expect(contractTypeAddress).toBe(Addresses.zero())
    })
  })

  describe('getContractTypeAddressByNetworks():', () => {
    it.skip('should return the correct contract address for the provided contract type for each network', async () => {
      const contractTypeAddressByNetworks = await registry.getContractTypeAddressByNetworks(
        expectedValues.contractType as Address,
      )

      expect(Object.keys(contractTypeAddressByNetworks)).toEqual(chainIds.map(String))

      Object.values(contractTypeAddressByNetworks).forEach(contractTypeAddress => {
        expect(contractTypeAddress).toBe(expectedValues.contractTypeAddress)
      })
    })

    it('should return the zero address when an invalid contract type is provided for each network', async () => {
      const contractTypeAddressByNetworks = await registry.getContractTypeAddressByNetworks(
        expectedValues.notAcontractType as Address,
      )

      expect(Object.keys(contractTypeAddressByNetworks)).toEqual(chainIds.map(String))

      Object.values(contractTypeAddressByNetworks).forEach(contractTypeAddress => {
        expect(contractTypeAddress).toBe(Addresses.zero())
      })
    })
  })

  it('getHolograph(): should return the correct Holograph contract address', async () => {
    const chainId = chainIds[0]

    const holographAddress = await registry.getHolograph(chainId)
    expect(holographAddress).toBe(expectedValues.holographAddress)
  })

  it('getHolographByNetworks(): should return the correct Holograph contract address per network', async () => {
    const holographAddressByNetworks = await registry.getHolographByNetworks()

    expect(Object.keys(holographAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(holographAddressByNetworks).forEach(holographAddress => {
      expect(holographAddress).toBe(expectedValues.holographAddress)
    })
  })

  it('getHToken(): should return the correct HToken address', async () => {
    const chainId = chainIds[0]

    const hTokenAddress = await registry.getHToken(chainId, chainId)
    expect(hTokenAddress).toBe(expectedValues.hToken)
  })

  it('getHTokenByNetworks(): should return the correct HToken address per network', async () => {
    const hTokenAddressByNetworks = await registry.getHTokenByNetworks(chainIds, chainIds[0])

    expect(Object.keys(hTokenAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(hTokenAddressByNetworks).forEach(hTokenAddress => {
      expect(hTokenAddress).toBe(expectedValues.hToken)
    })
  })

  it('getUtilityToken(): should return the correct Holograph Utility Token address', async () => {
    const chainId = chainIds[0]

    const utilityTokenAddress = await registry.getUtilityToken(chainId)
    expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
  })

  it('getUtilityTokenByNetworks(): should return the correct Holograph Utility Token address per network', async () => {
    const utilityTokenAddressByNetworks = await registry.getUtilityTokenByNetworks()

    expect(Object.keys(utilityTokenAddressByNetworks)).toEqual(chainIds.map(String))

    Object.values(utilityTokenAddressByNetworks).forEach(utilityTokenAddress => {
      expect(utilityTokenAddress).toBe(expectedValues.utilityTokenAddress)
    })
  })

  it('getHolographableContracts(): should be return the correct Holograph contract address', async () => {
    const chainId = chainIds[0]

    const holographableContracts = (await registry.getHolographableContracts(chainId, 0n, 10n)) as string[]
    expectTypeOf(holographableContracts).toBeArray()
    expectTypeOf(holographableContracts).items.toBeString()
  })

  it('getHolographableContractsByNetworks(): should be return the correct Holograph contract address per network', async () => {
    const holographableContractsByNetworks = await registry.getHolographableContractsByNetworks(0n, 10n)

    expect(Object.keys(holographableContractsByNetworks)).toEqual(chainIds.map(String))

    Object.values(holographableContractsByNetworks).forEach(holographableContracts => {
      expectTypeOf(holographableContracts as string[]).toBeArray()
    })
  })

  it('getHolographableContractsLength(): should be return the correct Holograph contract address', async () => {
    const chainId = chainIds[0]

    const deployedHolographableContracts = await registry.getHolographableContractsLength(chainId)
    expect(deployedHolographableContracts).toBeGreaterThan(1)
  })

  it('getHolographableContractsLengthByNetworks(): should be return the correct Holograph contract address per network', async () => {
    const deployedHolographableContractsByNetworks = await registry.getHolographableContractsLengthByNetworks()

    expect(Object.keys(deployedHolographableContractsByNetworks)).toEqual(chainIds.map(String))

    Object.values(deployedHolographableContractsByNetworks).forEach(deployedHolographableContracts => {
      expect(BigInt(deployedHolographableContracts as string)).toBeGreaterThan(1)
    })
  })

  describe.skip('referenceContractTypeAddress():', () => {
    it('Should be able to add a reference to a deployed smart contract.', () => {})
  })

  describe.skip('setHolograph():', () => {
    it('Should allow the admin to update the Holograph module contract address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setHToken():', () => {
    it('Should allow the admin to sets the hToken address for a specific chain id.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setHolographedHashAddress():', () => {
    it('Should allow the admin to register a deployed contract in the Factory module.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setContractTypeAddress():', () => {
    it('Should allow the admin to sets the contract address for a contract type.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setReservedContractTypeAddress():', () => {
    it('Should allow the admin to update or toggle reserved types.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setReservedContractTypeAddresses():', () => {
    it('Should allow the admin to update or toggle multiple reserved types.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })

  describe.skip('setUtilityToken():', () => {
    it('Should allow the admin to update the Holograph Utility Token address.', () => {})
    it('Should revert if it is not the admin who is calling the function.', () => {})
  })
})
