import {
  EIP1193Provider,
  Hex,
  PublicClient,
  Transaction,
  TransactionReceipt,
  createPublicClient,
  custom,
  http,
} from 'viem'
import {Network} from '@holographxyz/networks'

import {Config} from './config.service'
import {UnavailableNetworkError} from '../errors/general/unavailable-network.error'
import {HolographLogger} from './logger.service'
import {holographToViemChain} from '../utils/transformers'
import {TransportType} from '../utils/types'

export class Providers {
  private readonly logger: HolographLogger
  private readonly _clientProvider?: unknown
  private readonly _providers: Record<number, PublicClient>
  private readonly _networks: Network[]

  constructor() {
    this.logger = HolographLogger.createLogger({serviceName: Providers.name})
    const config = Config.getInstance()
    this._networks = config.networks
    this._clientProvider = config.provider
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

  getClientProviderByChainId(chainId: number, transportType: TransportType = 'custom'): PublicClient | undefined {
    return createPublicClient({
      chain: holographToViemChain(chainId),
      transport: transportType === 'custom' ? custom(this._clientProvider as EIP1193Provider) : http(),
    })
  }

  byChainId(chainId: number, transportType: TransportType = 'custom'): PublicClient {
    const logger = this.logger.addContext({functionName: this.byChainId.name})
    logger.info(`provider accessing chainId = ${chainId}`)

    const provider = this._providers[chainId]
    const clientProvider = this._clientProvider

    if (!provider && !clientProvider) throw new UnavailableNetworkError(chainId, this.byChainId.name)

    return provider || this.getClientProviderByChainId(chainId, transportType)
  }

  async getTransaction(chainId: number, hash: Hex): Promise<Transaction> {
    return this.byChainId(chainId).getTransaction({hash})
  }

  async getTransactionReceipt(chainId: number, hash: Hex): Promise<TransactionReceipt> {
    return this.byChainId(chainId).getTransactionReceipt({hash})
  }

  async getLatestBlockTimestamp(chainId: number): Promise<bigint> {
    return (await this.byChainId(chainId).getBlock()).timestamp
  }
}
