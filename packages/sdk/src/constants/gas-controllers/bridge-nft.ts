import {networks} from '@holographxyz/networks'

import {GasParams} from '.'

export const BRIDGE_NFT_GAS = {
  [networks.ethereum.chain]: {
    gasPrice: BigInt(40000000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.ethereumTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.ethereumTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.polygon.chain]: {
    gasPrice: BigInt(200000000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.polygonTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.binanceSmartChain.chain]: {
    gasPrice: BigInt(3000000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.binanceSmartChainTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.avalanche.chain]: {
    gasPrice: BigInt(30000000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.avalancheTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.optimism.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.optimismTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.optimismTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.arbitrumOne.chain]: {
    gasPrice: BigInt(100000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.arbitrumTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.arbitrumTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.mantle.chain]: {
    gasPrice: BigInt(20000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.mantleTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.zora.chain]: {
    gasPrice: BigInt(10000005), // NOTE: add 5 wei to prove value is used.
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.zoraTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.zoraTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.base.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.baseTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.baseTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.linea.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.lineaTestnetGoerli.chain]: {
    gasPrice: BigInt(1500000000),
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.lineaTestnetSepolia.chain]: {
    gasPrice: BigInt(1500000000),
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.localhost.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
  [networks.localhost2.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: 125,
    gasPriceMultiplier: 150,
  },
} as const satisfies Record<number, GasParams>
