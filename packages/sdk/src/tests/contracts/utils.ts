import {Environment} from '@holographxyz/environment'

import {HolographAccountFactory, HolographConfig} from '../../services'

export const configObject: HolographConfig = {
  networks: {
    ethereumTestnetGoerli: process.env.ETHEREUM_TESTNET_GOERLI_RPC_URL ?? '',
    polygonTestnet: process.env.POLYGON_TESTNET_RPC_URL ?? '',
  },
  accounts: {
    default: HolographAccountFactory.createAccountUsingPrivateKey(process.env.PRIVATE_KEY as `0x${string}`),
  },
  environment: Environment.develop,
}

export const ONLY_ADMIN_ERROR_MESSAGE = 'HOLOGRAPH: admin only function'
