import { NetworkType } from './network-type';
import { Network, Networks, NetworkKeys, NetworkHelper } from '../types';
import { networks } from './networks';
import {
  getSupportedNetworks,
  getNetworkByKey,
  getNetworkByShortKey,
  getNetworkByChainId,
  getNetworkByHolographId,
  getNetworkByLzId,
  supportedNetworks,
  supportedShortNetworks,
} from './utils';

export type { NetworkType, Network, Networks, NetworkKeys, NetworkHelper };

export {
  networks,
  getSupportedNetworks,
  getNetworkByKey,
  getNetworkByShortKey,
  getNetworkByChainId,
  getNetworkByHolographId,
  getNetworkByLzId,
  supportedNetworks,
  supportedShortNetworks,
};
