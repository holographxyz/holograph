import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Environment, getEnvironment } from '@holographxyz/environment';
import { Network, NetworkHelper, NetworkType } from '../types';
import { networks } from './networks';

export function getSupportedNetworks(environment?: Environment): string[] {
  if (environment === undefined) {
    environment = getEnvironment();
  }

  const supportedNetworks: string[] = Object.keys(networks).filter((networkKey: string) => {
    const network: Network = networks[networkKey];

    switch (environment) {
      case Environment.localhost:
        if (network.type === NetworkType.local && network.active) {
          return true;
        }

        break;
      case Environment.experimental:
        if (network.type === NetworkType.testnet && network.active) {
          return true;
        }

        break;
      case Environment.develop:
        if (network.type === NetworkType.testnet && network.active) {
          return true;
        }

        break;
      case Environment.testnet:
        if (network.type === NetworkType.testnet && network.active) {
          return true;
        }

        break;
      case Environment.mainnet:
        if (network.type === NetworkType.mainnet && network.active) {
          return true;
        }

        break;
    }

    return false;
  });
  return supportedNetworks;
}

export const supportedNetworks: string[] = getSupportedNetworks();

function networkHelperConstructor(): NetworkHelper {
  const helper: NetworkHelper = {
    byKey: {},
    byShortKey: {},
    byChainId: {},
    byHolographId: {},
    byLzId: {},
  } as NetworkHelper;
  for (const networkName of supportedNetworks) {
    const network = networks[networkName];
    const key = network.key;
    const shortKey = network.shortKey;
    const chainId: number = network.chain;
    const holographId: number = network.holographId;
    const lzId: number = network.lzId;

    helper.byKey[key] = network;
    helper.byShortKey[shortKey] = network;
    helper.byChainId[chainId] = network;
    helper.byHolographId[holographId] = network;
    if (network.lzId > 0) {
      helper.byLzId[lzId] = network;
    }
  }

  return helper;
}

function createShortNetworkNames(): string[] {
  let shortNetworks: string[] = [];
  for (const key of supportedNetworks) {
    shortNetworks.push(networks[key].shortKey);
  }
  return shortNetworks;
}

export const supportedShortNetworks: string[] = createShortNetworkNames();

function getSupportedNetworkChainIds(): number[] {
  let chainIds: number[] = [];
  for (const key of supportedNetworks) {
    chainIds.push(networks[key].chain);
  }
  return chainIds;
}

export const supportedNetworkChainIds: number[] = getSupportedNetworkChainIds();

const networkHelper: NetworkHelper = networkHelperConstructor();

export function getNetworkByKey(key: string): Network {
  if (!(key in networkHelper.byKey)) {
    throw new Error('Key does not exist in Networks');
  }
  return networkHelper.byKey[key];
}

export function getNetworkByShortKey(shortKey: string): Network {
  if (!(shortKey in networkHelper.byShortKey)) {
    throw new Error('ShortKey does not exist in Networks');
  }
  return networkHelper.byShortKey[shortKey];
}

export function getNetworkByChainId(chainId: BigNumberish | BigNumber | string | number): Network {
  const n: number = BigNumber.from(chainId).toNumber();
  if (!(n in networkHelper.byChainId)) {
    throw new Error('ChainId does not exist in Networks');
  }
  return networkHelper.byChainId[n];
}

export function getNetworkByHolographId(holographId: BigNumberish | BigNumber | string | number): Network {
  const n: number = BigNumber.from(holographId).toNumber();
  if (!(n in networkHelper.byHolographId)) {
    throw new Error('HolographId does not exist in Networks');
  }
  return networkHelper.byHolographId[n];
}

export function getNetworkByLzId(lzId: BigNumberish | BigNumber | string | number): Network {
  const n: number = BigNumber.from(lzId).toNumber();
  if (!(n in networkHelper.byLzId)) {
    throw new Error('LzId does not exist in Networks');
  }
  return networkHelper.byLzId[n];
}
