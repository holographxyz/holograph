import {NETWORK_KEY_BY_RPC_URL, NetworkKey, networks} from '@holographxyz/networks'

import {getEnv} from '../config/env.validation'
import {HolographConfig, NetworkRpc} from '../services'

// The function below is for checking where the code is running at (either front-end or server).
// It is used mainly on the networks setup for the Config service class.
// It is not reliable and should not be used for security checks.
export function isFrontEnd() {
  return typeof window !== 'undefined' && window.document
}

// The function below is used to automatically get the RPC configuration for the networks via environment variables.
// @example: const networksConfig = getEnvRpcConfig() -> { ethereum: 'https://mainnet.infura.io/v3/', polygon: 'https://polygon-rpc.com', ...}
export function getEnvRpcConfig() {
  const envData = getEnv()
  const rpcUrls = Object.entries(envData).filter(([key, value]) => key.endsWith('RPC_URL') && value)

  if (!rpcUrls.length) throw new Error('No RPC URL environment variables found')

  const networksConfig = rpcUrls.reduce((acc, [key, value]) => {
    const chainKey = NETWORK_KEY_BY_RPC_URL[key]
    if (chainKey) {
      acc[chainKey] = value
    }
    return acc
  }, {} as NetworkRpc)

  return networksConfig
}

// The function below is used to get the chain IDs array from the networks config object.
// If no networks config is provided, it will automatically use the environment variables through the getEnvRpcConfig function.
// @example: const chainIds = getChainIdsByNetworksConfig({ ethereum: 'https://mainnet.infura.io/v3/', polygon: 'https://polygon-rpc.com' }) -> [1, 137]
export function getChainIdsByNetworksConfig(networksConfig?: HolographConfig['networks']) {
  const networkKeys = Object.keys(networksConfig || getEnvRpcConfig()) as NetworkKey[]
  return networkKeys.map(networkKey => networks[networkKey].chain)
}

// The function below is used to remove left zeroes from a string with a prefix. The default prefix is '0x'.
// You can also remove the prefix by setting it to an empty string.
// @example: const result = removeLeftZeroes('0x00000000000000000a4f4') -> '0xa4f4'
export function removeLeftZeroes(str: string, prefix = '0x') {
  return prefix + str.replace(/^0+/, '')
}
