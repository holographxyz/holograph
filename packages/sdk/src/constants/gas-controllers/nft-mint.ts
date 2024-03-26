import {networks} from '@holographxyz/networks'

import {GasParams} from '.'

export const NFT_MINT_GAS = {
  [networks.ethereum.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.ethereumTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.ethereumTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.polygon.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.polygonTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.binanceSmartChain.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.binanceSmartChainTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.avalanche.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.avalancheTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.optimism.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.optimismTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.optimismTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.arbitrumOne.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.arbitrumTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.arbitrumTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.mantle.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.mantleTestnet.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.zora.chain]: {
    gasPrice: '100000000',
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.zoraTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.zoraTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.base.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.baseTestnetGoerli.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.baseTestnetSepolia.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.localhost.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
  [networks.localhost2.chain]: {
    gasPrice: undefined,
    gasLimit: undefined,
    gasLimitMultiplier: undefined,
    gasPriceMultiplier: 110,
  },
} as const satisfies Record<number, GasParams>
