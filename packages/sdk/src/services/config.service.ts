import {Environment, setEnvironment} from '@holographxyz/environment'
import {Network, getNetworkByChainId} from '@holographxyz/networks'

import {UnavailableNetworkError, UnknownError, normalizeException} from '../errors'
import {HolographLogger} from './logger.service'
import {getChainIdsByNetworksConfig, getEnvRpcConfig, isFrontEnd} from '../utils/helpers'
import {AccountsConfig, HolographConfig, NetworkRpc} from '../utils/types'

export class Config {
  private static _instance?: Config

  private readonly _logger: HolographLogger
  private readonly _environment: Environment
  private readonly _networks: Network[] = []
  private readonly _accounts?: AccountsConfig

  private constructor(private holographConfig: HolographConfig) {
    this._logger = HolographLogger.createLogger({serviceName: Config.name})
    this._environment = setEnvironment(holographConfig.environment)
    this._accounts = holographConfig.accounts

    if (holographConfig?.networks) {
      this.setNetworks(holographConfig.networks)
    } else {
      if (isFrontEnd()) throw new Error('Networks object required for Front-end application')
      const networksConfig = getEnvRpcConfig()
      this.setNetworks(networksConfig!)
    }
  }

  static getInstance(holographConfig: HolographConfig): Config {
    if (!Config._instance) {
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

  get networks() {
    return this._networks
  }

  get environment() {
    return this._environment
  }

  get accounts() {
    return this._accounts
  }
}
