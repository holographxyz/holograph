import {Address} from 'viem'
import {Environment} from '@holographxyz/environment'
import {InvalidHolographEnvironmentError} from '../errors/general/invalid-holograph-environment.error'

export class Addresses {
  private constructor() {}

  static zero(): Address {
    return '0x0000000000000000000000000000000000000000'
  }

  /**
   * V2
   */
  static holograph(environment: Environment, chainId?: number): Address {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return '0x17253175f447ca4B560a87a3F39591DFC7A021e3'.toLowerCase() as Address
        }
      }
      case Environment.experimental: {
        switch (chainId) {
          default:
            return '0x199728d88a68856868f50FC259F01Bb4D2672Da9'.toLowerCase() as Address
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97'.toLowerCase() as Address // V1
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x1Ed99DFE7462763eaF6925271D7Cb2232a61854C'.toLowerCase() as Address
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x1Ed99DFE7462763eaF6925271D7Cb2232a61854C'.toLowerCase() as Address
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }

  /**
   * V2
   */
  static layerZeroModule(environment: Environment, chainId?: number): Address {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return '0x306Fc3a660437598Cf231ecA7F3679468d3eF361'.toLowerCase() as Address
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0x422cfa9d656588e55fdd5d34a55c89f711f724cc'.toLowerCase() as Address // V1
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x7969414AA6958a44e276e9C3C5f28C5bC42E0271'.toLowerCase() as Address
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x7969414AA6958a44e276e9C3C5f28C5bC42E0271'.toLowerCase() as Address
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }

  /**
   * V2
   */
  static ovmGasPriceOracle(environment: Environment, chainId?: number): Address {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return '0xca971c5F8B071E0921913d4d167B9Bfaaa9Fd029'.toLowerCase() as Address
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0xd17C85EE12114bE77Ed0451c42c701fb2aE77C6f'.toLowerCase() as Address // V1
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x5230210c2b4995fd5084b0f5fd0d7457aebb5010'.toLowerCase() as Address
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x5230210c2b4995FD5084b0F5FD0D7457aebb5010'.toLowerCase() as Address
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }

  static editionsMetadataRendererV1(): Address {
    return '0x4d393Bd460B6Ba0957818e947364eA358600396b'.toLowerCase() as Address
  }

  static editionsMetadataRenderer(environment: Environment, chainId?: number): Address {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return '0xdF26982B2D5A4904757f6099b939c0eBcFE70668'.toLowerCase() as Address
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0x1564512435fd9B608c86B2349271Bd8793a78A68'.toLowerCase() as Address
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0xc85E6BcfB14B2f7D78EcC90bB28A370862bedc05'.toLowerCase() as Address
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0xc85E6BcfB14B2f7D78EcC90bB28A370862bedc05'.toLowerCase() as Address
        }
      }
      default:
        throw new InvalidHolographEnvironmentError(this.holograph.name)
    }
  }
}
