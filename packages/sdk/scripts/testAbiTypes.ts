import {AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames} from 'abitype'
import {BaseContract as BaseContractEthers, ethers} from 'ethers'

import {HolographABI} from '../src/constants/abi/develop'

type ReadFunctionNames = ExtractAbiFunctionNames<typeof HolographABI, 'pure' | 'view'>

type ContractMethods = {
  [name in ReadFunctionNames]: (
    ...args: AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<typeof HolographABI, ReadFunctionNames>['inputs'],
      'inputs'
    >
  ) => Promise<
    AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof HolographABI, ReadFunctionNames>['outputs'], 'outputs'>
  >
}

class BaseContact extends BaseContractEthers {}

interface BaseContact extends ContractMethods {}

async function main() {
  const rpc = 'https://goerli.infura.io/v3/'

  const rpcProvider = new ethers.JsonRpcProvider(rpc)

  const holograph = new BaseContact('0x8dd0A4D129f03F1251574E545ad258dE26cD5e97', HolographABI, rpcProvider)

  console.log(await holograph.getBridge())
}

main().catch(async e => {
  console.error(e)
  process.exit(1)
})
