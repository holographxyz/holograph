import {Environment} from '@holographxyz/environment'
import {Address, Hex, createTestClient, http} from 'viem'

import {Config, HolographAccountFactory} from '../services'
import {holographToViemChain} from '../utils/transformers'
import {HolographConfig} from '../utils/types'

console.log('Setting up tests...')

export const ONLY_ADMIN_ERROR_MESSAGE = 'HOLOGRAPH: admin only function'

export const localhostContractAddresses = {
  holograph: '0x17253175f447ca4B560a87a3F39591DFC7A021e3',
  holographBridge: '0x53D2B46b341385bC7e022667Eb1860505073D43a',
  holographFactory: '0xcE2cDFDF0b9D45F8Bd2D3CCa4033527301903FDe',
  holographOperator: '0xABc5a4C81D3033cf920b982E75D1080b91AA0EF9',
  holographRegistry: '0xB47C0E0170306583AA979bF30c0407e2bFE234b2',
  holographTreasury: '0x65115A3Be2Aa1F267ccD7499e720088060c7ccd2',
  holographInterfaces: '0x67F6394693bd2B46BBE87627F0E581faD80C7B57',
  holographRoyalties: '0xbF8f7474D7aCbb87E270FEDA9A5CBB7f766887E3',
  holographUtilityToken: '0x56BA455232a82784F17C33c577124EF208D931ED',
  editionsMetadataRenderer: '0xdF26982B2D5A4904757f6099b939c0eBcFE70668',
  hToken: '0x0533A3bfB526Af481FEA67BDC6dF1E09e91084ec',
  messageModule: '0x350856f758d9A1b8c24540d8E10cd6AB45B1466d',
  ovmGasPriceOracle: '0xca971c5F8B071E0921913d4d167B9Bfaaa9Fd029',
  layerZeroModule: '0x306Fc3a660437598Cf231ecA7F3679468d3eF361',
}

const accounts: {[name: string]: {address: Address; privateKey: Hex}} = {
  default: {
    address: '0xdf5295149f367b1fbfd595bda578bad22e59f504',
    privateKey: '0xff22437ccbedfffafa93a9f1da2e8c19c1711052799acf3b58ae5bebb5c6bd7b',
  },
  account1: {
    address: '0x17175d67e2fccb97588ed06e512cbe36ebf52326',
    privateKey: '0x2315c2a66e6b3af2dca804fe89ce6b51fc6041f5486d9f4acd43921112c18891',
  },
  account2: {
    address: '0x2f13d416da85f8d39271d15e6570792dee6709db',
    privateKey: '0x0223ee02bf483df57329ea337954be6bf39c107fd2e1f40c2a5059d3ed197f96',
  },
}

export const LOCALHOST_CHAIN_ID = 1338
export const LOCALHOST2_CHAIN_ID = 1339

const localhost = holographToViemChain(LOCALHOST_CHAIN_ID)
const localhost2 = holographToViemChain(LOCALHOST2_CHAIN_ID)

export const configObject: HolographConfig = {
  networks: {
    localhost: localhost.rpcUrls.default.http[0],
    localhost2: localhost2.rpcUrls.default.http[0],
  },
  accounts: {
    default: HolographAccountFactory.createAccountUsingPrivateKey(accounts.default.privateKey),
    account1: HolographAccountFactory.createAccountUsingPrivateKey(accounts.account1.privateKey),
    account2: HolographAccountFactory.createAccountUsingPrivateKey(accounts.account2.privateKey),
  },
  environment: Environment.localhost,
}

export const config = Config.getInstance(configObject)

export const testClient = createTestClient({
  chain: localhost,
  mode: 'anvil',
  transport: http(localhost.rpcUrls.default.http[0]),
})

export const testClient2 = createTestClient({
  chain: localhost2,
  mode: 'anvil',
  transport: http(localhost2.rpcUrls.default.http[0]),
})
