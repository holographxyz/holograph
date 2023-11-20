import {ethers} from 'ethers'

import {HolographABI} from '../src/constants/abi/develop'
import {getContract} from '../src/utils/contracts'

async function main() {
  const rpc = 'https://goerli.infura.io/v3/'

  const rpcProvider = new ethers.JsonRpcProvider(rpc)

  const holograph = getContract<typeof HolographABI>(
    '0x8dd0A4D129f03F1251574E545ad258dE26cD5e97',
    HolographABI,
    rpcProvider,
  )

  const address = await holograph.getBridge()

  console.log(address)
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
