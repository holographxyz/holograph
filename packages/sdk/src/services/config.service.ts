import {Environment, setEnvironment} from '@holographxyz/environment'
import {NETWORK_KEY_BY_RPC_URL, Network, NetworkKey, getNetworkByChainId, networks} from '@holographxyz/networks'

import {HolographLogger} from './logger.service'
import {HolographAccount} from './wallet.service'
import {UnavailableNetworkError, UnknownError, normalizeException} from '../errors'
import {getEnv} from '../config/env.validation'
import {isFrontEnd} from '../utils/helpers'

export type AccountsConfig = {
  default: HolographAccount
  [accountName: string]: HolographAccount
}

export type NetworkRpc = {[key in NetworkKey]?: string}

export type HolographConfig = {
  accounts?: AccountsConfig
  networks?: NetworkRpc
  environment?: Environment
  logLevel?: string
}

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

      const envData = getEnv()
      const rpcUrls = Object.entries(envData).filter(([key, value]) => key.endsWith('RPC_URL') && value)

      if (!rpcUrls.length) throw new Error('No RPC URL environment variables found')

      const chainsRpc = rpcUrls.reduce((acc, [key, value]) => {
        const chainKey = NETWORK_KEY_BY_RPC_URL[key]
        if (chainKey) {
          acc[chainKey] = value
        }
        return acc
      }, {} as NetworkRpc)

      this.setNetworks(chainsRpc)
    }
  }

  static getInstance(holographConfig: HolographConfig): Config {
    if (!Config._instance) {
      Config._instance = new Config(holographConfig)
    }

    return Config._instance
  }

  private setNetworks(networksRpc: NetworkRpc) {
    const logger = this._logger.addContext({functionName: this.setNetworks.name})
    logger.info('settings networks')
    const chainIds = (Object.keys(networksRpc) as NetworkKey[]).map(networkKey => networks[networkKey].chain)
    for (let chainId of chainIds) {
      try {
        const network = getNetworkByChainId(chainId)
        network.rpc = networksRpc[network.key]
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
