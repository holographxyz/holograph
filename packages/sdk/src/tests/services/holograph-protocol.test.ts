import {beforeAll, describe, expect, it} from 'vitest'

import {HolographProtocol, HolographWallet} from '../../services'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {ContractType, HolographAccount} from '../../utils/types'
import {LOCALHOST_CHAIN_ID, testConfigObject} from '../setup'
import {HolographOpenEditionERC721ContractV2} from '../../assets/holograph-open-edition-erc721-contract'
import {NFT} from '../../assets/nft'
import {OpenEditionNFT} from '../../assets/open-edition-nft'
import {Address} from 'viem'
import {
  ContractNotFoundError,
  NotHolographedContractError,
  TokenDoesNotExistError,
  UnavailableNetworkError,
} from '../../errors'

describe('Service: Holograph Protocol', () => {
  let holographProtocol: HolographProtocol

  let chainId: number
  let nft: NFT
  let openEditionNFT: OpenEditionNFT
  let erc721Contract: HolographERC721Contract
  let erc721ContractAddress: Address
  let openEditionErc721Contract: HolographOpenEditionERC721ContractV2
  let openEditionErc721ContractAddress: Address

  const account: HolographAccount = testConfigObject.accounts?.default!
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})

  beforeAll(async () => {
    chainId = LOCALHOST_CHAIN_ID

    await deployTestERC721Contract()
    await deployTestOpenEditionERC721Contract()
    await mintNFTFromERC721Contract()
    await mintNFTFromOpenEditionERC721Contract()

    holographProtocol = new HolographProtocol()
  })

  it('should validate the Holograph Protocol properties', () => {
    expect(holographProtocol).toHaveProperty('holograph')
    expect(holographProtocol).toHaveProperty('registry')
    expect(holographProtocol).toHaveProperty('treasury')
    expect(holographProtocol).toHaveProperty('interfaces')
    expect(holographProtocol).toHaveProperty('operator')
    expect(holographProtocol).toHaveProperty('layerZeroModule')
    expect(holographProtocol).toHaveProperty('factory')
    expect(holographProtocol).toHaveProperty('ovmGasPriceOracle')
    expect(holographProtocol).toHaveProperty('bridge')
    expect(holographProtocol).toHaveProperty('cxipERC721')
    expect(holographProtocol).toHaveProperty('openEditionERC721')
    expect(holographProtocol).toHaveProperty('hydrateContractFromAddress')
    expect(holographProtocol).toHaveProperty('hydrateNFT')
  })

  describe('hydrateContractFromAddress', () => {
    it('should correctly hydrate an ERC721 contract using its address and chain ID', async () => {
      const collection = await holographProtocol.hydrateContractFromAddress({
        chainId,
        address: erc721Contract.contractAddress!,
        type: ContractType.CxipERC721,
      })

      expect(collection.isHydrated).toBe(true)
      expect(collection).toBeInstanceOf(HolographERC721Contract)
      expect(collection.chainIds).toContain(chainId)
      expect(collection.name).toBe(erc721Contract.name)
      expect(collection.symbol).toBe(erc721Contract.symbol)
    })

    it('should correctly hydrate an Open Edition ERC721 contract using its address and chain ID', async () => {
      const moe = (await holographProtocol.hydrateContractFromAddress({
        chainId,
        address: openEditionErc721Contract.contractAddress!,
        type: ContractType.HolographOpenEditionERC721V2,
      })) as HolographOpenEditionERC721ContractV2

      expect(moe.isHydrated).toBe(true)
      expect(moe).toBeInstanceOf(HolographOpenEditionERC721ContractV2)
      expect(moe.chainIds).toContain(chainId)
      expect(moe.name).toBe(openEditionErc721Contract.name)
      expect(moe.symbol).toBe(openEditionErc721Contract.symbol)
      expect(moe.royaltiesPercentage).toBe(openEditionErc721Contract.royaltiesPercentage)
      expect(moe.nftIpfsImageCid).toBe(openEditionErc721Contract.nftIpfsImageCid)
    })

    it.skip('should throw an error when attempting to hydrate a non-existent contract on the specified chain ID', async () => {
      // NOTE: To test this case, ensure that a holographable address does not exist on the specified chain ID.
      await expect(() =>
        holographProtocol.hydrateContractFromAddress({
          chainId,
          address: '0x0533A3bfB526Af481FEA67BDC6dF1E09e91084ab',
          type: ContractType.HolographOpenEditionERC721V2,
        }),
      ).rejects.toThrow(ContractNotFoundError)
    })

    it('should throw an error when attempting to hydrate a contract with an invalid address', async () => {
      await expect(() =>
        holographProtocol.hydrateContractFromAddress({
          chainId,
          address: '0x00009',
          type: ContractType.HolographOpenEditionERC721V2,
        }),
      ).rejects.toThrow('Invalid address')
    })

    it('should throw an error when attempting to hydrate a contract from an unsupported chain ID', async () => {
      await expect(() =>
        holographProtocol.hydrateContractFromAddress({
          chainId: 1,
          address: openEditionErc721Contract.contractAddress!,
          type: ContractType.HolographOpenEditionERC721V2,
        }),
      ).rejects.toThrow(UnavailableNetworkError)
    })

    it('should throw an error when attempting to hydrate a non-holographable contract', async () => {
      await expect(() =>
        holographProtocol.hydrateContractFromAddress({
          chainId,
          address: '0xB94053201514E26133770eA1351959AffF0DE684',
          type: ContractType.HolographOpenEditionERC721V2,
        }),
      ).rejects.toThrow(NotHolographedContractError)
    })
  })

  describe('hydrateNFT', () => {
    it('should correctly hydrate an NFT using its contract address, token ID, and chain ID', async () => {
      const hydratedNft = (await holographProtocol.hydrateNFT({
        chainId,
        contractAddress: erc721ContractAddress,
        tokenId: nft.tokenId,
        type: ContractType.CxipERC721,
      })) as NFT

      expect(hydratedNft).toBeInstanceOf(NFT)
      expect(hydratedNft.isMinted).toBe(true)
      // TODO: Remove comments once uploading to IPFS feature is available
      // expect(hydratedNft.name).toBe(nft.name)
      // expect(hydratedNft.description).toBe(nft.description)
      expect(hydratedNft.ipfsMetadataCid).toBe(`ipfs://${nft.ipfsMetadataCid}`)
      expect(hydratedNft.tokenId).toBe(nft.tokenId)
    })

    it('should correctly hydrate an Open Edition NFT using its contract address, token ID, and chain ID', async () => {
      const hydratedNft = (await holographProtocol.hydrateNFT({
        chainId,
        contractAddress: openEditionErc721ContractAddress,
        tokenId: openEditionNFT.tokenId!,
        type: ContractType.HolographOpenEditionERC721V2,
      })) as OpenEditionNFT

      expect(hydratedNft).toBeInstanceOf(OpenEditionNFT)
      expect(hydratedNft.isMinted).toBe(true)
      // TODO: Remove comments once uploading to IPFS feature is available
      // expect(hydratedNft.name).toBe(openEditionNFT.name)
      // expect(hydratedNft.description).toBe(openEditionNFT.description)
      // expect(hydratedNft.ipfsImageCid).toBe(openEditionNFT.ipfsImageCid)
      expect(hydratedNft.tokenId).toBe(openEditionNFT.tokenId)
    })

    it('should throw an error when attempting to hydrate an NFT with a non-existent token ID', async () => {
      await expect(() =>
        holographProtocol.hydrateNFT({
          chainId,
          contractAddress: erc721ContractAddress,
          tokenId: '0x0000000000000000000000000000000000000000000000000000000000009999',
          type: ContractType.CxipERC721,
        }),
      ).rejects.toThrow(TokenDoesNotExistError)
    })
  })

  async function deployTestERC721Contract() {
    erc721Contract = new HolographERC721Contract({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        symbol: 'HOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: chainId,
    })

    await sleep(1500) // Sleep to avoid nonce issues
    const signatureData = await erc721Contract.signDeploy(wallet)
    const deploymentData = await erc721Contract.deploy(signatureData)
    erc721ContractAddress = deploymentData.contractAddress
  }

  async function deployTestOpenEditionERC721Contract() {
    openEditionErc721Contract = new HolographOpenEditionERC721ContractV2({
      contractInfo: {
        name: 'Open Edition NFTs Without Boundaries',
        description: 'Probably nothing.',
        symbol: 'OHOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93/nft.jpeg',
        ipfsImageCid: 'QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93',
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSaleStart: '2024-01-01T00:00:00Z',
        publicSaleEnd: '2025-01-02T00:00:00Z',
        publicSalePrice: 25,
      },
      primaryChainId: chainId,
    })

    await sleep(1500) // Sleep to avoid nonce issues
    const signatureData = await openEditionErc721Contract.signDeploy(wallet)
    const deploymentData = await openEditionErc721Contract.deploy(signatureData)
    openEditionErc721ContractAddress = deploymentData.contractAddress
  }

  async function mintNFTFromERC721Contract() {
    nft = new NFT({
      contract: erc721Contract,
      ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
    })

    await sleep(1500) // Sleep to avoid nonce issues
    nft.mint({chainId})
  }

  async function mintNFTFromOpenEditionERC721Contract() {
    openEditionNFT = new OpenEditionNFT({
      contract: openEditionErc721Contract,
    })
    await sleep(1500) // Sleep to avoid nonce issues
    await openEditionNFT.purchase({chainId, quantity: 1})
  }
})
