import {networks} from '@holographxyz/networks'

import {RpcUrlEnvironmentVariables} from '../config/env.validation'

export const CHAIN_ID_BY_CHAIN_NAME = {
  arbitrumTestnetSepolia: networks.arbitrumTestnetSepolia.chain,
  arbitrumOne: networks.arbitrumOne.chain,
  avalancheTestnet: networks.avalancheTestnet.chain,
  avalanche: networks.avalanche.chain,
  baseTestnetSepolia: networks.baseTestnetSepolia.chain,
  base: networks.base.chain,
  binanceSmartChainTestnet: networks.binanceSmartChainTestnet.chain,
  binanceSmartChain: networks.binanceSmartChain.chain,
  ethereumTestnetGoerli: networks.ethereumTestnetGoerli.chain,
  ethereumTestnetSepolia: networks.ethereumTestnetSepolia.chain,
  ethereum: networks.ethereum.chain,
  mantleTestnet: networks.mantleTestnet.chain,
  mantle: networks.mantle.chain,
  optimismTestnetSepolia: networks.optimismTestnetSepolia.chain,
  optimism: networks.optimism.chain,
  polygonTestnet: networks.polygonTestnet.chain,
  polygon: networks.polygon.chain,
  zoraTestnetSepolia: networks.zoraTestnetSepolia.chain,
  zora: networks.zora.chain,
}

export type ChainName = keyof typeof CHAIN_ID_BY_CHAIN_NAME

export const CHAIN_NAME_BY_RPC_URL: Record<RpcUrlEnvironmentVariables, ChainName> = {
  ARBITRUM_TESTNET_SEPOLIA_RPC_URL: 'arbitrumTestnetSepolia',
  ARBITRUM_ONE_RPC_URL: 'arbitrumOne',
  AVALANCHE_TESTNET_RPC_URL: 'avalancheTestnet',
  AVALANCHE_RPC_URL: 'avalanche',
  BASE_TESTNET_SEPOLIA_RPC_URL: 'baseTestnetSepolia',
  BASE_RPC_URL: 'base',
  BINANCE_SMART_CHAIN_TESTNET_RPC_URL: 'binanceSmartChainTestnet',
  BINANCE_SMART_CHAIN_RPC_URL: 'binanceSmartChain',
  ETHEREUM_TESTNET_GOERLI_RPC_URL: 'ethereumTestnetGoerli',
  ETHEREUM_TESTNET_SEPOLIA_RPC_URL: 'ethereumTestnetSepolia',
  ETHEREUM_RPC_URL: 'ethereum',
  MANTLE_TESTNET_RPC_URL: 'mantleTestnet',
  MANTLE_RPC_URL: 'mantle',
  OPTIMISM_TESTNET_SEPOLIA_RPC_URL: 'optimismTestnetSepolia',
  OPTIMISM_RPC_URL: 'optimism',
  POLYGON_TESTNET_RPC_URL: 'polygonTestnet',
  POLYGON_RPC_URL: 'polygon',
  ZORA_TESTNET_SEPOLIA_RPC_URL: 'zoraTestnetSepolia',
  ZORA_RPC_URL: 'zora',
}
