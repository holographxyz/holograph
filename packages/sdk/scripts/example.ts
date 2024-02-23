import {config} from 'dotenv'
import {Config, HolographConfig} from '../src/services/config.service'
import {Holograph} from '../src/contracts/holograph.contract'

import {HolographProtocol, Providers, HolographAccountFactory, HolographWalletManager} from '../src/services'
import {Environment} from '@holographxyz/environment'
import {Account} from 'viem'

config()

async function main() {
  const defaultAccount = HolographAccountFactory.createAccountUsingPrivateKey('')

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
  const holographWallet = new HolographWalletManager(config).getWallet('default')

  // const myOwnManagedWallet = new HolographWalletManager({wallet, provider})

  // await protocol.holograph.readFn(5)
  // await protocol.holograph.writeFn(5, {account: 'sam'})
  // await protocol.holograph.writeFn2(5, {account: 'david'})
  // await protocol.holograph.writeFn3(5) //uses default account
  // await protocol.holograph.writeFn3(5, {account: 'default'}) // uses default account
  // await protocol.holograph.writeFn3(5, {account: myOwnManagedWallet})

  /// Holograph protocol usage:

  console.log('testing holographWallet: ')
  console.log('account: ', holographWallet.account)
  console.log(
    'sign: ',
    await holographWallet.onChain(80001).signMessage({
      account: holographWallet.account,
      message: 'hello world',
    }),
  )

  const protocol = new HolographProtocol(config)

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

  /// stand alone contract usage:

  const holograph = new Holograph(config)
  console.log(await holograph.getRegistryByNetworks())
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
