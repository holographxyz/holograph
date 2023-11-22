import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'

import {Providers} from './providers.service'
import {Config} from '../config/config.service'
import {Holograph} from '../contracts/Holograph'

class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS

  private readonly providers: Providers
  private holographContract!: Holograph
  // private registryContract!: Registry
  // private bridgeContract!: Bridge
  // private operatorContract!: Operator
  // private factoryContract!: Factory

  constructor(private readonly protocolConfig: Config) {
    this.providers = new Providers(protocolConfig)

    this.holographContract = new Holograph(this.protocolConfig, this.providers)
  }

  get holograph() {
    return this.holographContract
  }
}

export default HolographProtocol
