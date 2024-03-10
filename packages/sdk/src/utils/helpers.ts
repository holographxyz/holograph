import {Hex, isAddress, pad, stringToBytes, toHex} from 'viem'
import * as z from 'zod'
import {NETWORK_KEY_BY_RPC_URL, NetworkKey, networks} from '@holographxyz/networks'

import {getEnv} from '../config/env.validation'
import {HolographConfig, NetworkRpc, Signature} from './types'

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

export function allEventsEnabled(): string {
  return '0x' + 'ff'.repeat(32)
}

export function generateRandomSalt(): Hex {
  return ('0x' + Date.now().toString(16).padStart(64, '0')) as Hex
}

export function parseBytes(str: string, size = 32) {
  return toHex(pad(stringToBytes(str), {size}))
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getAddressTypeSchema(
  field: string,
  isRequired = true,
  requiredMessage?: string,
  invalidFormatMessage?: string,
) {
  const invalidFormatMessage_ = invalidFormatMessage || `Invalid ${field.toLowerCase()} address`
  const requiredMessage_ = requiredMessage || `${capitalizeFirstLetter(field)} address is required`
  if (isRequired) {
    return z.string().min(1, {message: requiredMessage_}).refine(isAddress, {message: invalidFormatMessage})
  }
  return z.string().refine(isAddress, {message: invalidFormatMessage_})
}

export function destructSignature(signedMessage: Hex): Signature {
  return {
    r: ('0x' + signedMessage.substring(2, 66)) as Hex,
    s: ('0x' + signedMessage.substring(66, 130)) as Hex,
    v: ('0x' + signedMessage.substring(130, 132)) as Hex,
  }
}
