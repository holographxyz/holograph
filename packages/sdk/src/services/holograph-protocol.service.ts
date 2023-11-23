import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'
import {Config} from '../config/config.service'
import {Holograph, Registry} from '../contracts'
import {Providers} from './providers.service'

export class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS

  private readonly providers: Providers
  private holographContract!: Holograph
  private registryContract!: Registry
  // private bridgeContract!: Bridge
  // private operatorContract!: Operator
  // private factoryContract!: Factory

  constructor(private readonly protocolConfig: Config) {
    this.providers = new Providers(protocolConfig)

    this.holographContract = new Holograph(this.protocolConfig, this.providers)

    this.registryContract = new Registry(this.protocolConfig, this.providers)
  }

  get holograph() {
    return this.holographContract
  }

  get registry() {
    return this.registryContract
  }
}
