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
import {EventInfo} from '../utils/types'

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
}
