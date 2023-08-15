import { NetworkType } from './src/network-type';

export interface Network {
  name: string;
  type: NetworkType;
  key: string;
  shortKey: string;
  color: string;
  chain: number;
  rpc: string;
  holographId: number;
  tokenName: string;
  tokenSymbol: string;
  explorer: string | undefined;
  lzEndpoint: string;
  lzId: number;
  active: boolean;
  protocolMultisig: string | undefined;
  deprecated?: boolean;
}

export interface Networks {
  [key: string]: Network;
}

type NetworkKeys = keyof Networks;

export interface NetworkHelper {
  byKey: Networks;
  byShortKey: Networks;
  byChainId: Networks;
  byHolographId: Networks;
  byLzId: Networks;
}

export { NetworkType };

export type { NetworkKeys };
