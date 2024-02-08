import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'
import {Config} from './config.service'
import {Holograph, Interfaces, Registry, Treasury} from '../contracts'
import {HolographLogger} from './logger.service'

export class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS
  private readonly logger: HolographLogger
  private holographContract!: Holograph
  private registryContract!: Registry
  private treasuryContract!: Treasury
  private interfacesContract!: Interfaces
  // private bridgeContract!: Bridge
  // private factoryContract!: Factory

  constructor(private readonly protocolConfig: Config) {
    this.logger = HolographLogger.createLogger({serviceName: HolographProtocol.name})

    this.holographContract = new Holograph(this.protocolConfig)
    this.registryContract = new Registry(this.protocolConfig)
    this.treasuryContract = new Treasury(this.protocolConfig)
    this.interfacesContract = new Interfaces(this.protocolConfig)
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
}
