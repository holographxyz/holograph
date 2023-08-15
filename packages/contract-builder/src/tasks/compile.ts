import {task} from 'hardhat/config'

const {TASK_COMPILE} = require('hardhat/builtin-tasks/task-names')

task(TASK_COMPILE, async function (args, hre, runSuper) {
  if (hre.config.hardhatHolographContractBuilder.runOnCompile) {
    await hre.run('holograph-build-contracts')
  }

  await runSuper()
})
