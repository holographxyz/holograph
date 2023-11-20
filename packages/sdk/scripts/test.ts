import {Config} from '../src/config/config.service'
import {Holograph} from '../src/contracts/Holograph'

import HolographProtocol from '../src/services/holograph-protocol.service'
import {Providers} from '../src/services/providers.service'

async function main() {
  const networks = {
    5: 'https://goerli.infura.io/v3/', // Include your API key at the end of the URL
    80001: 'https://polygon-mumbai.infura.io/v3/', // Include your API key at the end of the URL
  }

  const config = Config.getInstance(networks)

  /// Holograph protocol usage:

  const protocol = new HolographProtocol(config)

  const bridgeByNetworks = await protocol.holograph.getBridgeByNetworks()
  console.log('bridgeByNetworks: ', bridgeByNetworks)

  const bridge = await protocol.holograph.getBridge(5)
  console.log('bridge on chain: ', bridge)

  /// Multi-providers usage:

  const multiProviders = new Providers(config)
  console.log('providers: ', multiProviders.providers)

  /// stand alone contract usage:

  const holograph = new Holograph(config, multiProviders)
  console.log(await holograph.getRegistryByNetworks())
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
