import {Environment} from '@holographxyz/environment'
import {InvalidHolographEnvironmentError} from '../errors/general/invalid-holograph-environment.error'
export class Addresses {
  private constructor() {}

  /**
   * V2
   */
  static holograph(environment: Environment, chainId?: number) {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return '0xa3931469C1D058a98dde3b5AEc4dA002B6ca7446'.toLowerCase()
        }
      }
      case Environment.experimental: {
        switch (chainId) {
          default:
            return '0x199728d88a68856868f50FC259F01Bb4D2672Da9'.toLowerCase()
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97'.toLowerCase() // V1
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x1Ed99DFE7462763eaF6925271D7Cb2232a61854C'.toLowerCase()
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x1Ed99DFE7462763eaF6925271D7Cb2232a61854C'.toLowerCase()
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }

  /**
   * V2
   */
  static layerZeroModule(environment: Environment, chainId?: number) {
    switch (environment) {
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0x422cfa9d656588e55fdd5d34a55c89f711f724cc'.toLowerCase() // V1
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x7969414AA6958a44e276e9C3C5f28C5bC42E0271'.toLowerCase()
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x7969414AA6958a44e276e9C3C5f28C5bC42E0271'.toLowerCase()
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }
}
