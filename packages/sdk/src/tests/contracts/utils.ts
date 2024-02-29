import {Environment} from '@holographxyz/environment'
import {HolographAccountFactory, HolographConfig} from '../../services'

export const configObject: HolographConfig = {
  networks: {
    5: process.env.ETHEREUM_TESTNET_RPC ?? '',
    80001: process.env.POLYGON_TESTNET_RPC ?? '',
  },
  accounts: {
    default: HolographAccountFactory.createAccountUsingPrivateKey(process.env.PRIVATE_KEY as `0x${string}`),
  },
  environment: Environment.develop,
}

export const ONLY_ADMIN_ERROR_MESSAGE = 'HOLOGRAPH: admin only function'
