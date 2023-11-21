import {BigNumberish} from 'ethers'
import {Environment, getEnvironment} from '@holographxyz/environment'
import {getNetworkByChainId, Network} from '@holographxyz/networks'
import {getHandlerLogger} from './logger'

export type ChainsRpc = Record<number, string>

export class Config {
  private static _instance?: Config

  private readonly logger //TODO: improve logger
  private readonly _environment: Environment
  private readonly _networks: Network[] = []

  private constructor(private chainsRpc: ChainsRpc) {
    this._environment = getEnvironment()
    this.logger = getHandlerLogger().child({service: Config.name})

    this.setNetworks(Object.keys(chainsRpc))
  }

  private setNetworks(chainIds: BigNumberish[]) {
    for (let chainId of chainIds) {
      try {
        const network = getNetworkByChainId(chainId)
        network.rpc = this.chainsRpc[Number(chainId)]
        this._networks.push(network)
      } catch (e) {
        // TODO: map error from getNetworkByChainId to new Error
        throw e
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
