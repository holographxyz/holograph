import {JsonRpcProvider} from 'ethers'
import {Network} from '@holographxyz/networks'

import {Config} from '../config/config.service'

export class Providers {
  // private readonly logger //TODO: improve Logger
  private readonly _providers: Record<number, JsonRpcProvider>
  private readonly _networks: Network[]

  constructor(private readonly protocolConfig: Config) {
    // this.logger = getHandlerLogger().child({service: Providers.name})
    this._networks = this.protocolConfig.networks
    this._providers = {}

    this._networks.forEach((network: Network) => {
      this._providers[network.chain] = new JsonRpcProvider(network.rpc)
    })
  }

  get providers() {
    return this._providers
  }

  byChainId(chainId: number) {
    // this.logger.debug(`provider accessing chainId = ${chainId}`)
    return this._providers[chainId]
  }
}
