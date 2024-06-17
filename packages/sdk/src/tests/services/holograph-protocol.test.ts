import {beforeAll, describe, expect, it} from 'vitest'

import {HolographProtocol, HolographWallet} from '../../services'
import {generateRandomSalt, sleep} from '../../utils/helpers'
import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {ContractType, HolographAccount} from '../../utils/types'
import {LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID, testConfigObject} from '../setup'
import {HolographOpenEditionERC721ContractV2} from '../../assets/holograph-open-edition-erc721-contract'
import {NFT} from '../../assets/nft'
import {OpenEditionNFT} from '../../assets/open-edition-nft'
import {Address} from 'viem'

describe('Service: Holograph Protocol', () => {
  let holographProtocol: HolographProtocol

  let chainId: number
  let nft: NFT
  let nftTokenId: string
  let openEditionNFT: OpenEditionNFT
  let openEditionNFTtokenId: string
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
    expect(holographProtocol).toHaveProperty('holographOpenEditionERC721')
    expect(holographProtocol).toHaveProperty('hydrateContractFromAddress')
    expect(holographProtocol).toHaveProperty('hydrateNFT')
  })

  describe('hydrateContractFromAddress', () => {
    it('should correctly hydrate an ERC721 contract using its address and chain ID', () => {})

    it('should correctly hydrate an Open Edition ERC721 contract using its address and chain ID', () => {})

    it('should throw an error when attempting to hydrate a non-existent contract on the specified chain ID', () => {})

    it('should throw an error when attempting to hydrate a contract with an invalid address', () => {})

    it('should throw an error when attempting to hydrate a contract from an unsupported chain ID', () => {})

    it('should throw an error when attempting to hydrate a contract from a chain ID without an associated provider', () => {})

    it('should throw an error when attempting to hydrate a non-holographable contract', () => {})
  })

  describe('hydrateNFT', () => {
    it('should correctly hydrate an NFT using its contract address, token ID, and chain ID', async () => {
      const hydratedNft = await holographProtocol.hydrateNFT({
        chainId,
        contractAddress: erc721ContractAddress,
        tokenId: nftTokenId,
        type: ContractType.CxipERC721,
      })

      expect(hydratedNft).toBeInstanceOf(NFT)
      expect(hydratedNft.isMinted).toBe(true)
      expect(hydratedNft.name).toBe(nft.name)
      expect(hydratedNft.description).toBe(nft.description)
      expect(hydratedNft.ipfsImageCid).toBe(nft.ipfsImageCid)
      expect(hydratedNft.ipfsMetadataCid).toBe(nft.ipfsMetadataCid)
      expect(hydratedNft.tokenId).toBe(nft.tokenId)
    })

    it('should correctly hydrate an Open Edition NFT using its contract address, token ID, and chain ID', async () => {
      const hydratedNft = await holographProtocol.hydrateNFT({
        chainId,
        contractAddress: openEditionErc721ContractAddress,
        tokenId: openEditionNFTtokenId,
        type: ContractType.HolographOpenEditionERC721V2,
      })

      expect(hydratedNft).toBeInstanceOf(OpenEditionNFT)
      expect(hydratedNft.isMinted).toBe(true)
      expect(hydratedNft.name).toBe(openEditionNFT.name)
      expect(hydratedNft.description).toBe(openEditionNFT.description)
      expect(hydratedNft.ipfsImageCid).toBe(openEditionNFT.ipfsImageCid)
      //expect(hydratedNft.ipfsMetadataCid).toBe(nft.ipfsMetadataCid)
      expect(hydratedNft.tokenId).toBe(openEditionNFT.tokenId)
    })

    it('should throw an error when attempting to hydrate an NFT with a non-existent token ID', () => {})
  })

  async function deployTestERC721Contract() {
    erc721Contract = new HolographERC721Contract({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        description: 'Probably nothing',
        symbol: 'HOLO',
        royaltiesBps: 2000,
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
        royaltiesBps: 2000,
        salt: generateRandomSalt(),
      },
      nftInfo: {
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
        ipfsImageCid: 'QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93',
        // TODO: why we don't have the ipfsMetadataCid ?
      },
      salesConfig: {
        maxSalePurchasePerAddress: 10,
        publicSaleStart: '2025-01-01T00:00:00Z',
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
      metadata: {
        name: 'My First NFT',
        description: 'Nothing.',
      },
      ipfsInfo: {
        ipfsImageCid: 'QmR9VoYXafUYLh4eJyoUmMkD1mzAhrb2JddX1quctEUo93',
        ipfsMetadataCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32',
        ipfsUrl: 'https://holograph.mypinata.cloud/ipfs/QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32/metadata.json',
      },
    })

    await sleep(1500) // Sleep to avoid nonce issues
    const mintData = await nft.mint({chainId})
    nftTokenId = mintData.tokenId
  }

  async function mintNFTFromOpenEditionERC721Contract() {
    openEditionNFT = new OpenEditionNFT({
      contract: openEditionErc721Contract,
      metadata: {
        name: 'My First NFT',
        description: 'Nothing.',
      },
    })
    await sleep(1500) // Sleep to avoid nonce issues
    const mintData = await nft.mint({chainId})
    openEditionNFTtokenId = mintData.tokenId
  }
})
