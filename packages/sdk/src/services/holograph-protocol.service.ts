import {Address} from 'abitype'
import {getContract, parseAbi} from 'viem'

import {HolographERC721Contract} from '../assets/holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from '../assets/holograph-open-edition-erc721-contract'
import {Config} from './config.service'
import {HOLOGRAPH_EVENTS} from '../constants/events'
import {
  BridgeContract,
  CxipERC721Contract,
  FactoryContract,
  HolographContract,
  OpenEditionERC721Contract,
  InterfacesContract,
  LayerZeroModuleContract,
  OperatorContract,
  OVMGasPriceOracleContract,
  RegistryContract,
  TreasuryContract,
} from '../contracts'
import {HolographLogger} from './logger.service'
import {Providers} from './providers.service'
import {getAddressTypeSchema, parseTimestampSecondsToISODate} from '../utils/helpers'
import {ContractType, EventInfo} from '../utils/types'
import {NFT} from '../assets/nft'
import {OpenEditionNFT} from '../assets/open-edition-nft'
import {
  ContractNotFoundError,
  MetadataFetchError,
  NotHolographedContractError,
  TokenDoesNotExistError,
  UnsupportedContractTypeError,
} from '../errors'

export class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS
  private readonly logger: HolographLogger
  private readonly protocolConfig: Config
  private holographContract!: HolographContract
  private registryContract!: RegistryContract
  private treasuryContract!: TreasuryContract
  private interfacesContract!: InterfacesContract
  private operatorContract!: OperatorContract
  private layerZeroModuleContract!: LayerZeroModuleContract
  private factoryContract!: FactoryContract
  private ovmGasPriceOracleContract!: OVMGasPriceOracleContract
  private bridgeContract!: BridgeContract
  private cxipERC721Contract!: CxipERC721Contract
  private openEditionERC721Contract!: OpenEditionERC721Contract

  private readonly _providers: Providers

  constructor(protocolConfig?: Config, private readonly contractAddress?: Address) {
    this.logger = HolographLogger.createLogger({serviceName: HolographProtocol.name})

    this.protocolConfig = protocolConfig ?? Config.getInstance()

    this.holographContract = new HolographContract()
    this.registryContract = new RegistryContract()
    this.treasuryContract = new TreasuryContract()
    this.interfacesContract = new InterfacesContract()
    this.operatorContract = new OperatorContract()
    this.layerZeroModuleContract = new LayerZeroModuleContract()
    this.factoryContract = new FactoryContract()
    this.ovmGasPriceOracleContract = new OVMGasPriceOracleContract()
    this.bridgeContract = new BridgeContract()

    if (this.contractAddress) {
      this.cxipERC721Contract = new CxipERC721Contract(this.contractAddress)
      this.openEditionERC721Contract = new OpenEditionERC721Contract(this.contractAddress)
    }

    this._providers = new Providers()
  }

  get holograph(): HolographContract {
    return this.holographContract
  }

  get registry(): RegistryContract {
    return this.registryContract
  }

  get treasury(): TreasuryContract {
    return this.treasuryContract
  }

  get interfaces(): InterfacesContract {
    return this.interfacesContract
  }

  get operator(): OperatorContract {
    return this.operatorContract
  }

  get layerZeroModule(): LayerZeroModuleContract {
    return this.layerZeroModuleContract
  }

  get factory(): FactoryContract {
    return this.factoryContract
  }

  get ovmGasPriceOracle(): OVMGasPriceOracleContract {
    return this.ovmGasPriceOracleContract
  }

  get bridge(): BridgeContract {
    return this.bridgeContract
  }

  get cxipERC721(): CxipERC721Contract {
    return this.cxipERC721Contract
  }

  get openEditionERC721(): OpenEditionERC721Contract {
    return this.openEditionERC721Contract
  }

  async hydrateContractFromAddress(hydrateContractInput: {
    chainId: number
    address: Address
    type: ContractType
  }): Promise<HolographERC721Contract | HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2> {
    const {chainId, address, type} = hydrateContractInput

    getAddressTypeSchema('address', true, 'Required Field', 'Invalid address').parse(address)

    const client = {public: this._providers.byChainId(chainId)}

    const isHolographed = await this.registry.isHolographedContract(chainId, address)
    if (!isHolographed) {
      throw new NotHolographedContractError(this.hydrateContractFromAddress.name)
    }

    const abi = parseAbi([
      'function name() external view returns (string memory)',
      'function symbol() external view returns (string memory)',
      'function contractURI() external view returns (string memory)',
      'function config() external view returns (Configuration)',
      'struct Configuration { uint160 metadataRenderer;  uint64 editionSize; uint16 royaltyBPS; address fundsRecipient;}',
      'function salesConfig() external view returns (SalesConfiguration)',
      'struct SalesConfiguration { uint104 publicSalePrice; uint32 maxSalePurchasePerAddress; uint64 publicSaleStart; uint64 publicSaleEnd; uint64 presaleStart; uint64 presaleEnd; bytes32 presaleMerkleRoot; }',
    ])

    const contract = getContract({abi, address, client})

    let name!: string
    try {
      name = await contract.read.name()
    } catch (error: any) {
      if (error?.message.includes('The contract function "name" returned no data ("0x").')) {
        throw new ContractNotFoundError(this.hydrateContractFromAddress.name)
      }
    }

    const symbol = await contract.read.symbol()

    let contractInput = {
      contractInfo: {
        symbol,
        name,
        // salt TODO: Once the new contract version is available, we should update this code to retrieve the salt property.
      },
      chainId,
      address,
    }

    switch (type) {
      case ContractType.CxipERC721: {
        // const encodedRoyaltiesPercentage =  await client.public.getStorageAt({address, slot: '0x'}) // TODO: Awaiting protocol devs to calculate the slot
        // const royaltiesPercentage = decodeAbiParameters(parseAbiParameters('uint256'), encodedRoyaltiesPercentage)

        return HolographERC721Contract.hydrate(contractInput)
      }
      case ContractType.HolographOpenEditionERC721V1:
      case ContractType.HolographOpenEditionERC721V2: {
        const config = await contract.read.config()
        const salesConfig = await contract.read.salesConfig()
        const contractURI = await contract.read.contractURI()

        let metadata
        if (contractURI.includes('data:application/json;base64,')) {
          metadata = JSON.parse(atob(contractURI.substring(29)))
        } else {
          const metadataUrl = `https://holograph.mypinata.cloud/ipfs/${contractURI.replace('ipfs://', '')}`
          const response = await fetch(metadataUrl)

          if (!response.ok) {
            throw new Error('It was not possible to retrieve metadata information')
          }
          metadata = await response.json()
        }

        contractInput.contractInfo['royaltiesPercentage'] = config.royaltyBPS

        const openEditionInput = {
          ...contractInput,
          nftInfo: {
            ipfsUrl: metadata.image,
            ipfsImageCid: metadata.image.split('/')[2],
          },
          salesConfig: {
            presaleMerkleRoot: salesConfig.presaleMerkleRoot,
            maxSalePurchasePerAddress: salesConfig.maxSalePurchasePerAddress,
            publicSalePrice: Number(salesConfig.publicSalePrice),
            publicSaleStart: parseTimestampSecondsToISODate(Number(salesConfig.publicSaleStart)) as string,
            publicSaleEnd: parseTimestampSecondsToISODate(Number(salesConfig.publicSaleEnd)) as string,
            presaleStart:
              Number(salesConfig.presaleStart) === 0
                ? undefined
                : parseTimestampSecondsToISODate(Number(salesConfig.presaleStart)),
            presaleEnd:
              Number(salesConfig.presaleEnd) === 0
                ? undefined
                : parseTimestampSecondsToISODate(Number(salesConfig.presaleEnd)),
          },
        }

        if (type === ContractType.HolographOpenEditionERC721V1) {
          return HolographOpenEditionERC721ContractV1.hydrate(openEditionInput)
        }
        return HolographOpenEditionERC721ContractV2.hydrate(openEditionInput)
      }
      default:
        throw new UnsupportedContractTypeError(this.hydrateContractFromAddress.name)
    }
  }

  async hydrateNFT(hydrateNftInput: {
    chainId: number
    contractAddress: Address
    tokenId: string
    type: ContractType
  }): Promise<NFT | OpenEditionNFT> {
    const {chainId, contractAddress, tokenId, type} = hydrateNftInput

    const nftContract = await this.hydrateContractFromAddress({chainId, address: contractAddress, type})

    const abi = parseAbi([
      'function tokenURI(uint256 _tokenId) external view returns (string memory)',
      'function ownerOf(uint256 tokenId) external view returns (address)',
    ])

    const client = {public: this._providers.byChainId(chainId)}
    const contract = getContract({abi, address: contractAddress, client})

    try {
      await contract.read.ownerOf([BigInt(tokenId)])
    } catch (error: any) {
      if (error?.message.includes('ERC721: token does not exist')) {
        throw new TokenDoesNotExistError(this.hydrateNFT.name)
      }
    }

    const tokenUri = await contract.read.tokenURI([BigInt(tokenId)])

    let rawMetadata
    if (tokenUri.includes('data:application/json;base64,')) {
      rawMetadata = JSON.parse(atob(tokenUri.substring(29)))
    } else if (tokenUri.startsWith('ipfs://')) {
      const metadataUrl = `https://holograph.mypinata.cloud/ipfs/${tokenUri.replace('ipfs://', '')}`
      const response = await fetch(metadataUrl)

      if (!response.ok) {
        throw new MetadataFetchError(this.hydrateNFT.name)
      }
      rawMetadata = await response.json()
    } else {
      throw new MetadataFetchError(this.hydrateNFT.name)
    }

    let metadata = {
      name: rawMetadata.name,
      description: rawMetadata.description,
      creator: rawMetadata.creator,
      image: rawMetadata.image,
    }

    let nft: NFT | OpenEditionNFT
    switch (type) {
      case ContractType.CxipERC721: {
        nft = new NFT({
          contract: nftContract as HolographERC721Contract,
          // metadata, // TODO: Remove comment once uploading to IPFS feature is available
          ipfsMetadataCid: tokenUri,
        })
        break
      }
      case ContractType.HolographOpenEditionERC721V1:
      case ContractType.HolographOpenEditionERC721V2: {
        nft = new OpenEditionNFT({
          contract: nftContract as HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2,
        })
        // nft['_metadata'] = rawMetadata as unknown as HolographOpenEditionNFTMetadata // TODO: Remove comment once uploading to IPFS feature is available
        break
      }
      default:
        throw new UnsupportedContractTypeError(this.hydrateNFT.name)
    }

    nft.isMinted = true
    nft['_tokenId'] = tokenId
    return nft
  }
}
