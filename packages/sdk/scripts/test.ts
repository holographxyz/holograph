import {Config} from '../src/config/config.service'
import HolographProtocol from '../src/services/holograph-protocol.service'

async function main() {
  const networks = {5: 'jsonRpc'}

  const config = Config.getInstance(networks)

  const protocol = new HolographProtocol(config)

  await protocol.holograph.getBridgeByNetworks()
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
