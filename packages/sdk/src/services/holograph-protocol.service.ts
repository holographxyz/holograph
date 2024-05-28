import {Address} from 'abitype'

import {HOLOGRAPH_EVENTS} from '../constants/events'
import {Config} from './config.service'
import {
  Bridge,
  CxipERC721,
  Factory,
  Holograph,
  HolographDropERC721,
  Interfaces,
  LayerZeroModule,
  Operator,
  OVMGasPriceOracle,
  Registry,
  Treasury,
} from '../contracts'
import {HolographLogger} from './logger.service'
import {CollectionType, EventInfo, TokenType} from '../utils/types'
import {getReservedNamespaceFromHash, ReservedNamespaces, ReservedNamespacesHash} from '../utils/reserved-namespaces'
import {decodeAbiParameters, getContract, Hex, parseAbi, parseAbiParameters} from 'viem'
import {Providers} from './providers.service'
import {CreateLegacyCollection, HolographMoeSalesConfig} from '../assets/collection.validation'
import {HolographLegacyCollection} from '../assets/collection-legacy'
import {HolographMoeERC721DropV1, HolographMoeERC721DropV2} from '../assets/collection-moe'
import {parseTimestampSecondsToISODate} from '../utils/helpers'

export class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS
  private readonly logger: HolographLogger
  private holographContract!: Holograph
  private registryContract!: Registry
  private treasuryContract!: Treasury
  private interfacesContract!: Interfaces
  private operatorContract!: Operator
  private layerZeroModuleContract!: LayerZeroModule
  private factoryContract!: Factory
  private ovmGasPriceOracleContract!: OVMGasPriceOracle
  private bridgeContract!: Bridge
  private cxipERC721Contract!: CxipERC721
  private holographDropERC721Contract!: HolographDropERC721

  private readonly _providers: Providers

  constructor(private readonly protocolConfig: Config, private readonly collectionAddress?: Address) {
    this.logger = HolographLogger.createLogger({serviceName: HolographProtocol.name})

    this.holographContract = new Holograph(this.protocolConfig)
    this.registryContract = new Registry(this.protocolConfig)
    this.treasuryContract = new Treasury(this.protocolConfig)
    this.interfacesContract = new Interfaces(this.protocolConfig)
    this.operatorContract = new Operator(this.protocolConfig)
    this.layerZeroModuleContract = new LayerZeroModule(this.protocolConfig)
    this.factoryContract = new Factory(this.protocolConfig)
    this.ovmGasPriceOracleContract = new OVMGasPriceOracle(this.protocolConfig)
    this.bridgeContract = new Bridge(this.protocolConfig)
    this.cxipERC721Contract = new CxipERC721(this.protocolConfig, this.collectionAddress!)
    this.holographDropERC721Contract = new HolographDropERC721(this.protocolConfig, this.collectionAddress!)

    this._providers = new Providers(this.protocolConfig)
  }

  get holograph(): Holograph {
    return this.holographContract
  }

  get registry(): Registry {
    return this.registryContract
  }

  get treasury(): Treasury {
    return this.treasuryContract
  }

  get interfaces(): Interfaces {
    return this.interfacesContract
  }

  get operator(): Operator {
    return this.operatorContract
  }

  get layerZeroModule(): LayerZeroModule {
    return this.layerZeroModuleContract
  }

  get factory(): Factory {
    return this.factoryContract
  }

  get ovmGasPriceOracle(): OVMGasPriceOracle {
    return this.ovmGasPriceOracleContract
  }

  get bridge(): Bridge {
    return this.bridgeContract
  }

  get cxipERC721(): CxipERC721 {
    return this.cxipERC721Contract
  }

  get holographDropERC721(): HolographDropERC721 {
    return this.holographDropERC721Contract
  }

  async hydrateContractFromAddress(hydrateContractInput: {
    chainId: number
    address: Address
    type: CollectionType
  }): Promise<HolographLegacyCollection | HolographMoeERC721DropV1 | HolographMoeERC721DropV2> {
    const {chainId, address, type} = hydrateContractInput

    const abi = parseAbi([
      'function name() external view returns (string memory)',
      'function symbol() external view returns (string memory)',
      'function contractURI() external view returns (string memory)',
      'function config() external view returns (Configuration)',
      'struct Configuration { uint160 metadataRenderer;  uint64 editionSize; uint16 royaltyBPS; address fundsRecipient;}',
      'function salesConfig() external view returns (SalesConfiguration)',
      'struct SalesConfiguration { uint104 publicSalePrice; uint32 maxSalePurchasePerAddress; uint64 publicSaleStart; uint64 publicSaleEnd; uint64 presaleStart; uint64 presaleEnd; bytes32 presaleMerkleRoot; }',
    ])

    const client = {public: this._providers.byChainId(chainId)}
    const contract = getContract({abi, address, client})

    const name = await contract.read.name()
    const symbol = await contract.read.symbol()

    let collectionInput = {
      collectionInfo: {
        symbol,
        name,
        // salt TODO: Once the new contract version is available, we should update this code to retrieve the salt property.
      },
      chainId,
      address,
    }

    switch (type) {
      case CollectionType.CxipERC721: {
        // const encodedRoyaltiesBps =  await client.public.getStorageAt({address, slot: '0x'}) // TODO: Awaiting protocol devs to calculate the slot
        // const royaltiesBps = decodeAbiParameters(parseAbiParameters('uint256'), encodedRoyaltiesBps)

        return HolographLegacyCollection.hydrate(collectionInput)
      }
      case CollectionType.HolographDropERC721:
      case CollectionType.HolographDropERC721V2: {
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

        collectionInput.collectionInfo['royaltiesBps'] = config.royaltyBPS

        const moeInput = {
          ...collectionInput,
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

        if (type === CollectionType.HolographDropERC721) {
          return HolographMoeERC721DropV1.hydrate(moeInput)
        }
        return HolographMoeERC721DropV2.hydrate(moeInput)
      }
      default:
        throw new Error('This type of contract is not currently supported.')
    }
  }
}
