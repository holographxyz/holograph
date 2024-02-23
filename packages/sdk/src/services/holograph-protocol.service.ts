import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'
import {Config} from './config.service'
import {
  Bridge,
  Factory,
  Holograph,
  Interfaces,
  LayerZeroModule,
  Operator,
  OVMGasPriceOracle,
  Registry,
  Treasury,
} from '../contracts'
import {HolographLogger} from './logger.service'

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

  constructor(private readonly protocolConfig: Config) {
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
}
