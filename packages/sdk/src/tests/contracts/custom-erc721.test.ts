import {beforeAll, describe, expect, it} from 'vitest'

import {CustomERC721, Factory} from '../../contracts'
import {Providers, Config, HolographWallet} from '../../services'
import {
  allEventsEnabled,
  destructSignature,
  generateRandomSalt,
  getChainIdsByNetworksConfig,
  parseBytes,
} from '../../utils/helpers'

import {configObject, localhostContractAddresses} from '../setup'
import {getERC721DeploymentConfigHash} from '../../utils/encoders'
import {DeploymentConfig} from '../../utils/types'
import {Address, Hex, encodeAbiParameters, pad, parseAbiParameters} from 'viem'
import {bytecodes} from '../../constants/bytecodes'
import {evm2hlg} from '../../utils/transformers'
import {decodeBridgeableContractDeployedEvent} from '../../utils/decoders'

const CUSTOM_ERC21_ADDRESS = '0xccC70836Bcee9cCFF36a58DE3E1E02F22A73d7aC'

describe('Contract class: HolographDropERC721', () => {
  let config: Config
  let providersWrapper: Providers
  let customERC721: CustomERC721
  let factory: Factory

  const chainIds = getChainIdsByNetworksConfig(configObject.networks)
  const chainId = chainIds[0]

  const deployer = configObject.accounts?.default!

  const holographWallet = new HolographWallet({account: deployer, chainsRpc: configObject.networks})

  let collectionAddress: Address = '0x3ad5535a0efe59c94df33010bf3b3acad7b22964'

  beforeAll(async () => {
    config = Config.getInstance(configObject)
    providersWrapper = new Providers(config)
    factory = new Factory(config)

    // deploy contract
    const saleConfig = {
      presaleStart: 0, // never starts
      presaleEnd: 0, // never ends
      publicSalePrice: 100,
      maxSalePurchasePerAddress: 0, // no limit
      presaleMerkleRoot: pad('0x0', {size: 32}), // no presale
    }

    const lazyMintConfig = [
      [
        5,
        'https://placeholder-uri1.com/',
        '0x00000000000000000000000000000000000000000000000000000000000000406fb73a8c26bf89ea9a8fa8c927042b0c602dc7dffb4614376384cbe15ebc45b40000000000000000000000000000000000000000000000000000000000000014d74bef972bcac96c0d83b64734870bfe84912893000000000000000000000000',
      ],
      [
        5,
        'https://placeholder-uri2.com/',
        '0x00000000000000000000000000000000000000000000000000000000000000406fb73a8c26bf89ea9a8fa8c927042b0c602dc7dffb4614376384cbe15ebc45b40000000000000000000000000000000000000000000000000000000000000014d74bef972bcac96c0d83b64734870bfe84912893000000000000000000000000',
      ],
    ]

    const CustomERC721Initializer = {
      startDate: 1718822400, // Epoch time for June 3, 2024
      initialMaxSupply: 4173120, // Total number of ten-minute intervals until Oct 8, 2103
      mintInterval: 600, // Duration of each interval
      initialOwner: holographWallet.account.address,
      contractURI: 'https://example.com/metadata.json',
      salesConfiguration: Object.values(saleConfig),
      lazyMintsConfigurations: Object.values(lazyMintConfig),
    }

    const encodedInitializer = encodeAbiParameters(
      parseAbiParameters([
        '(uint40,uint32,uint24,address,string,(uint104,uint24,uint64,uint64,bytes32),(uint256,string,bytes)[])',
      ]),
      [
        Object.values(CustomERC721Initializer) as unknown as readonly [
          number,
          number,
          number,
          `0x${string}`,
          string,
          readonly [bigint, number, bigint, bigint, `0x${string}`],
          readonly (readonly [bigint, string, `0x${string}`])[],
        ],
      ],
    )

    const registryAddress = localhostContractAddresses.holographRegistry as Address
    //const creatorEncoded = encodeAbiParameters(parseAbiParameters('address'), [deployer.address])
    const initCodeEncoded: Hex = encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      parseBytes('CustomERC721'),
      registryAddress,
      encodedInitializer,
    ])
    const encodedInitParameters = encodeAbiParameters(
      parseAbiParameters('string, string, uint16, uint256, bool, bytes'),
      [
        'Custom ERC721', // contractName
        'C721', // contractSymbol
        1000, // contractBps
        BigInt(allEventsEnabled()), // eventConfig
        false, // skipInit
        initCodeEncoded,
      ],
    )
    const deploymentConfig: DeploymentConfig = {
      contractType: parseBytes('HolographERC721'),
      chainType: evm2hlg(chainId),
      byteCode: bytecodes.CustomERC721Proxy,
      initCode: encodedInitParameters,
      salt: generateRandomSalt(),
    }

    const deploymentConfigHash = getERC721DeploymentConfigHash(deploymentConfig, holographWallet.account.address)

    const signedMessage = await holographWallet.onChain(chainId).signMessage({
      account: holographWallet.account,
      message: deploymentConfigHash,
    })
    const signature = destructSignature(signedMessage)

    const deployTx = (await factory.deployHolographableContract(
      chainId,
      deploymentConfig,
      signature,
      holographWallet.account.address,
    )) as Hex

    const receipt = await providersWrapper.byChainId(chainId).waitForTransactionReceipt({hash: deployTx})
    collectionAddress = decodeBridgeableContractDeployedEvent(receipt)?.[0]?.values?.[0]

    console.log('address: ', collectionAddress)

    customERC721 = new CustomERC721(config, collectionAddress)
  })

  describe('contractURI()', () => {
    it(`should allow anyone to get the contractURI`, async () => {
      const contractURI = await customERC721.contractURI(chainId)
      expect(contractURI).toBe('https://example.com/metadata.json')
    })
  })

  describe('saleDetails()', () => {
    it(`should allow anyone to get the sale details`, async () => {
      const saleDetails = await customERC721.saleDetails(chainId)
      console.log(saleDetails)
      // Contract function CustomERC721.saleDetails reverted with. Position `351` is out of bounds (`0 < position < 320`)
    })
  })

  describe('setSaleConfiguration()', () => {
    it(`should allow the admin to call the function`, async () => {})
  })

  describe('adminMint()', () => {
    it(`should allow the admin to call the function`, async () => {
      const tx = (await customERC721.adminMint(chainId, deployer.address, 1)) as Hex
      const receipt = await providersWrapper.byChainId(chainId).waitForTransactionReceipt({hash: tx})
      const nftMintedTopic = '0x3a8a89b59a31c39a36febecb987e0657ab7b7c73b60ebacb44dcb9886c2d5c8a'
      const nftMintedLog = receipt.logs.find(log => log.topics[0] === nftMintedTopic)
      expect(nftMintedLog).exist
      expect(nftMintedLog?.topics[1]).toBe(deployer.address)
      //topic[2] -> tokenId
    })
  })

  describe('purchase()', () => {
    it(`should allow anyone to call the function`, async () => {
      const tx = (await customERC721.purchase(chainId, 1)) as Hex
      const receipt = await providersWrapper.byChainId(chainId).waitForTransactionReceipt({hash: tx})
      console.log(tx)
    })
  })

  describe('withdraw()', () => {
    it(`should allow the admin to call the function`, async () => {
      const balanceBefore = await holographWallet.onChain(chainId).getBalance({address: deployer.address})
      console.log('balanceBefore: ', balanceBefore)

      const tx = (await customERC721.withdraw(chainId)) as Hex
      const receipt = await providersWrapper.byChainId(chainId).waitForTransactionReceipt({hash: tx})

      const balance = await holographWallet.onChain(chainId).getBalance({address: deployer.address})
      console.log('balance: ', balance)
    })
  })
})
