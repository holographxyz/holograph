import {config} from 'dotenv'
import {Config, HolographConfig} from '../src/services/config.service'
import {Holograph} from '../src/contracts/holograph.contract'

import {HolographProtocol, HolographAccountFactory, HolographWalletManager, HolographWallet} from '../src/services'
import {Environment} from '@holographxyz/environment'

config()

async function main() {
  const defaultAccount = HolographAccountFactory.createAccountUsingPrivateKey(
    (process.env.PRIVATE_KEY as `0x${string}`) ?? '0x',
  )

  const protocolConfig: HolographConfig = {
    networks: {
      5: process.env.ETHEREUM_TESTNET_RPC ?? '',
      80001: process.env.POLYGON_TESTNET_RPC ?? '',
    },
    environment: Environment.develop,
    accounts: {
      default: defaultAccount,
    },
  }

  const config = Config.getInstance(protocolConfig)

  ///
  /// Protocol usage
  ///

  const protocol = new HolographProtocol(config)

  /// write function call
  try {
    await protocol.factory.setHolograph(5, '0xe713aaa55cea11f7abfbdc894f4945b05c7c5690') //uses default account
    //await protocol.factory.setHolograph(5, '0xe713aaa55cea11f7abfbdc894f4945b05c7c5690', {account: 'default'}) //uses account by name
  } catch (error: any) {
    console.error(error)
  }

  /// read functions call
  const bridgeByNetworks = await protocol.holograph.getBridgeByNetworks()
  console.log('bridgeByNetworks: ', bridgeByNetworks)

  const bridge = await protocol.holograph.getBridge(5)
  console.log('bridge on chain: ', bridge)

  const result = await protocol.interfaces.contractURI(
    5,
    'Test',
    'imageUrl',
    'externalLink.com',
    1,
    '0xe713aaa55cea11f7abfbdc894f4945b05c7c5690',
  )
  console.log(`Interfaces contractURI: ${result}`)

  ///
  /// stand alone contract usage:
  ///

  const holograph = new Holograph(config)
  console.log(await holograph.getRegistryByNetworks())

  ///
  /// stand alone wallet usage
  ///

  const holographWalletManager = new HolographWalletManager(config)
  const holographWallet = new HolographWallet({account: defaultAccount, chainsRpc: protocolConfig.networks})

  console.log('account: ', holographWalletManager.getWallet('default').account)
  console.log(
    'sign: ',
    await holographWallet.onChain(80001).signMessage({
      account: holographWallet.account,
      message: 'hello world',
    }),
  )

  try {
    await protocol.factory.setHolograph(5, '0xe713aaa55cea11f7abfbdc894f4945b05c7c5690', {account: holographWallet}) // using HolographWallet
  } catch (error: any) {
    console.error(error)
  }
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
