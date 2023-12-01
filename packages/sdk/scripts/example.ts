import {Config} from '../src/services/config.service'
import {Holograph} from '../src/contracts/holograph.contract'

import {HolographProtocol, Providers} from '../src/services'

require('dotenv').config()

async function main() {
  const networks = {
    5: process.env.ETHEREUM_TESTNET_RPC ?? '',
    80001: process.env.POLYGON_TESTNET_RPC ?? '',
  }

  const config = Config.getInstance(networks)

  /// Holograph protocol usage:

  const protocol = new HolographProtocol(config)

  const bridgeByNetworks = await protocol.holograph.getBridgeByNetworks()
  console.log('bridgeByNetworks: ', bridgeByNetworks)

  const bridge = await protocol.holograph.getBridge(5)
  console.log('bridge on chain: ', bridge)

  // /// Multi-providers usage:

  const multiProviders = new Providers(config)
  console.log('providers: ', multiProviders.providers)

  // /// stand alone contract usage:

  const holograph = new Holograph(config, multiProviders)
  console.log(await holograph.getRegistryByNetworks())

  // registry
  console.log(await protocol.registry.getContractTypeAddressByNetworks('0xee33bd1045208107547f351e8235e81f9a5baccd'))
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
