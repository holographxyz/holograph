import {Environment} from '@holographxyz/environment'

export class Addresses {
  private constructor() {}

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
            return '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97'.toLowerCase()
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x6429b42da2a06aA1C46710509fC96E846F46181e'.toLowerCase()
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x6429b42da2a06aA1C46710509fC96E846F46181e'.toLowerCase()
        }
      }
      default:
        throw new Error('Not a valid Environment!') //TODO: create error
    }
  }

  static registry(environment: Environment, chainId?: number) {
    switch (environment) {
      case Environment.localhost: {
        switch (chainId) {
          default:
            return ''.toLowerCase()
        }
      }
      case Environment.experimental: {
        switch (chainId) {
          default:
            return ''.toLowerCase()
        }
      }
      case Environment.develop: {
        switch (chainId) {
          default:
            return '0xAE27815bCf7ccA7191Cb55a6B86576aeDC462bBB'.toLowerCase()
        }
      }
      case Environment.testnet: {
        switch (chainId) {
          default:
            return '0x9c120F9281308D71C838F8FADB41a82Bfc7ffFEF'.toLowerCase()
        }
      }
      case Environment.mainnet: {
        switch (chainId) {
          default:
            return '0x9c120F9281308D71C838F8FADB41a82Bfc7ffFEF'.toLowerCase()
        }
      }
      default:
        throw new Error('Not a valid Environment!') //TODO: create error
    }
  }
}
