import {BigNumberish} from 'ethers'
import {Environment, getEnvironment} from '@holographxyz/environment'
import {getNetworkByChainId, Network} from '@holographxyz/networks'
import {HolographLogger} from './logger.service'
import {UnavailableNetworkError, UnknownError, normalizeException} from '../errors'

export type ChainsRpc = Record<number, string>

export class Config {
  private static _instance?: Config

  private readonly logger: HolographLogger
  private readonly _environment: Environment
  private readonly _networks: Network[] = []

  private constructor(private chainsRpc: ChainsRpc) {
    this._environment = getEnvironment()
    this.logger = HolographLogger.createLogger({serviceName: Config.name})

    this.setNetworks(Object.keys(chainsRpc))
  }

  private setNetworks(chainIds: BigNumberish[]) {
    const logger = this.logger.addContext({functionName: this.setNetworks.name})
    logger.info('settings networks')
    for (let chainId of chainIds) {
      try {
        const network = getNetworkByChainId(chainId)
        network.rpc = this.chainsRpc[Number(chainId)]
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

  static getInstance(chainIds: ChainsRpc): Config {
    if (!Config._instance) {
      Config._instance = new Config(chainIds)
    }

    return Config._instance
  }

  get networks() {
    return this._networks
  }

  get environment() {
    return this._environment
  }
}
