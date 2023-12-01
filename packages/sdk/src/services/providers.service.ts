import {JsonRpcProvider} from 'ethers'
import {Network} from '@holographxyz/networks'

import {Config} from './config.service'
import {HolographLogger} from './logger.service'

export class Providers {
  private readonly logger: HolographLogger
  private readonly _providers: Record<number, JsonRpcProvider>
  private readonly _networks: Network[]

  constructor(private readonly protocolConfig: Config) {
    this.logger = HolographLogger.createLogger({serviceName: Providers.name})
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
    const logger = this.logger.addContext({functionName: this.byChainId.name})
    logger.info(`provider accessing chainId = ${chainId}`)
    return this._providers[chainId]
  }
}
