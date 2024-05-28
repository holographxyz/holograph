import {Environment, setEnvironment} from '@holographxyz/environment'
import {Network, getNetworkByChainId} from '@holographxyz/networks'

import {MissingHolographConfig, UnavailableNetworkError, UnknownError, normalizeException} from '../errors'
import {HolographLogger} from './logger.service'
import {getChainIdsByNetworksConfig, getEnvRpcConfig, isFrontEnd} from '../utils/helpers'
import {AccountsConfig, HolographConfig, NetworkRpc} from '../utils/types'

export class Config {
  private static _instance?: Config

  private readonly _logger: HolographLogger
  private readonly _environment: Environment
  private readonly _networks: Network[] = []
  private readonly _networksRpc: NetworkRpc = {}
  private readonly _accounts?: AccountsConfig
  private readonly _provider?: unknown

  private constructor(private holographConfig: HolographConfig) {
    this._logger = HolographLogger.createLogger({serviceName: Config.name})
    this._environment = setEnvironment(holographConfig.environment)
    this._accounts = holographConfig.accounts
    this._provider = holographConfig.provider

    if (holographConfig?.networks) {
      this.setNetworks(holographConfig.networks)
      this._networksRpc = holographConfig.networks
    }

    if (!holographConfig?.networks && !isFrontEnd()) {
      const networksConfig = getEnvRpcConfig()
      this.setNetworks(networksConfig!)
      this._networksRpc = networksConfig!
    }
  }

  static getInstance(holographConfig?: HolographConfig): Config {
    if (!Config._instance) {
      if (!holographConfig) {
        throw new MissingHolographConfig(Config.getInstance.name)
      }
      Config._instance = new Config(holographConfig)
    }
    return Config._instance
  }

  private setNetworks(networksConfig: NetworkRpc) {
    const logger = this._logger.addContext({functionName: this.setNetworks.name})
    logger.info('settings networks')
    const chainIds = getChainIdsByNetworksConfig(networksConfig)
    for (let chainId of chainIds) {
      try {
        const network = getNetworkByChainId(chainId)
        network.rpc = networksConfig[network.key]
        this._networks.push(network)
      } catch (err: any) {
        err = normalizeException(err)
        if (err.message === 'ChainId does not exist in Networks') {
          throw new UnavailableNetworkError(chainId, this.setNetworks.name, err)
        }
        throw new UnknownError(err, this.setNetworks.name)
      }
    }
  }

  get accounts() {
    return this._accounts
  }

  get environment() {
    return this._environment
  }

  get networks() {
    return this._networks
  }

  get networksRpc() {
    return this._networksRpc
  }

  get provider() {
    return this._provider
  }
}
