import {networks} from '@holographxyz/networks'

import {RpcUrlEnvironmentVariables} from '../config/env.validation'

export const CHAIN_ID_BY_RPC_URL: Record<RpcUrlEnvironmentVariables, number> = {
  ARBITRUM_TESTNET_SEPOLIA_RPC_URL: networks.arbitrumTestnetSepolia.chain,
  ARBITRUM_ONE_RPC_URL: networks.arbitrumOne.chain,
  AVALANCHE_TESTNET_RPC_URL: networks.avalancheTestnet.chain,
  AVALANCHE_RPC_URL: networks.avalanche.chain,
  BASE_TESTNET_SEPOLIA_RPC_URL: networks.baseTestnetSepolia.chain,
  BASE_RPC_URL: networks.base.chain,
  BINANCE_SMART_CHAIN_TESTNET_RPC_URL: networks.binanceSmartChainTestnet.chain,
  BINANCE_SMART_CHAIN_RPC_URL: networks.binanceSmartChain.chain,
  ETHEREUM_TESTNET_GOERLI_RPC_URL: networks.ethereumTestnetGoerli.chain,
  ETHEREUM_TESTNET_SEPOLIA_RPC_URL: networks.ethereumTestnetSepolia.chain,
  ETHEREUM_RPC_URL: networks.ethereum.chain,
  MANTLE_TESTNET_RPC_URL: networks.mantleTestnet.chain,
  MANTLE_RPC_URL: networks.mantle.chain,
  OPTIMISM_TESTNET_SEPOLIA_RPC_URL: networks.optimismTestnetSepolia.chain,
  OPTIMISM_RPC_URL: networks.optimism.chain,
  POLYGON_TESTNET_RPC_URL: networks.polygonTestnet.chain,
  POLYGON_RPC_URL: networks.polygon.chain,
  ZORA_TESTNET_SEPOLIA_RPC_URL: networks.zoraTestnetSepolia.chain,
  ZORA_RPC_URL: networks.zora.chain,
}
