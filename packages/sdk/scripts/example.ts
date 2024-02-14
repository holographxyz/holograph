import {config} from 'dotenv'
import {Config} from '../src/services/config.service'
import {Holograph} from '../src/contracts/holograph.contract'

import {HolographProtocol, Providers} from '../src/services'

config()

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
