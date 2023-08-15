import {extendConfig, HardhatUserConfig} from 'hardhat/config'

import './tasks/compile'
import './tasks/build_contracts'

extendConfig((config: any, userConfig: HardhatUserConfig) => {
  config.hardhatHolographContractBuilder = {
    verbose: false,
    runOnCompile: false,
    ...userConfig.hardhatHolographContractBuilder,
  }
})
