import {EIP1193Provider, PublicClient, createPublicClient, custom, http} from 'viem'
import {Network} from '@holographxyz/networks'

import {Config} from './config.service'
import {UnavailableNetworkError} from '../errors/general/unavailable-network.error'
import {HolographLogger} from './logger.service'
import {holographToViemChain} from '../utils/transformers'

export class Providers {
  private readonly logger: HolographLogger
  private readonly _clientProvider?: unknown
  private readonly _providers: Record<number, PublicClient>
  private readonly _networks: Network[]

  constructor(private readonly protocolConfig: Config) {
    this.logger = HolographLogger.createLogger({serviceName: Providers.name})
    this._networks = this.protocolConfig.networks
    this._clientProvider = this.protocolConfig.provider
    this._providers = {}

    if (this._networks.length > 0) {
      this._networks.forEach((network: Network) => {
        this._providers[network.chain] = createPublicClient({
          transport: http(network.rpc),
          chain: holographToViemChain(network.chain),
        })
      })
    }
  }

  get providers(): Record<number, PublicClient> {
    return this._providers
  }

  getClientProviderByChaindId(chainId: number): PublicClient | undefined {
    return createPublicClient({
      chain: holographToViemChain(chainId),
      transport: custom(this._clientProvider as EIP1193Provider),
    })
  }

  byChainId(chainId: number): PublicClient {
    const logger = this.logger.addContext({functionName: this.byChainId.name})
    logger.info(`provider accessing chainId = ${chainId}`)

    const provider = this._providers[chainId]
    const clientProvider = this._clientProvider

    if (!provider && !clientProvider) throw new UnavailableNetworkError(chainId, this.byChainId.name)

    return provider || this.getClientProviderByChaindId(chainId)
  }
}
