import {PublicClient, createPublicClient, http} from 'viem'
import {Network} from '@holographxyz/networks'

import {Config} from './config.service'
import {HolographLogger} from './logger.service'
import {UnavailableNetworkError} from '../errors/general/unavailable-network.error'
import {holographToViemChain} from '../utils/transformers'

export class Providers {
  private readonly logger: HolographLogger
  private readonly _providers: Record<number, PublicClient>
  private readonly _networks: Network[]

  constructor(private readonly protocolConfig: Config) {
    this.logger = HolographLogger.createLogger({serviceName: Providers.name})
    this._networks = this.protocolConfig.networks
    this._providers = {}

    this._networks.forEach((network: Network) => {
      this._providers[network.chain] = createPublicClient({
        transport: http(network.rpc),
        chain: holographToViemChain(network.chain),
      })
    })
  }

  get providers(): Record<number, PublicClient> {
    return this._providers
  }

  byChainId(chainId: number): PublicClient {
    const logger = this.logger.addContext({functionName: this.byChainId.name})
    logger.info(`provider accessing chainId = ${chainId}`)

    const provider = this._providers[chainId]

    if (provider === undefined) {
      throw new UnavailableNetworkError(chainId, this.byChainId.name)
    }

    return provider
  }
}
