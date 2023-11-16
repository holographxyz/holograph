import {BaseContract as BaseContractEthers} from 'ethers'
import {Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames} from 'abitype'

type ReadFunctionNames<TAbi extends Abi> = ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>

type FunctionArgsTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['inputs'],
  'inputs'
>

type FunctionReturnTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['outputs'],
  'outputs'
>

type ContractMethods<TAbi extends Abi> = {
  [name in ReadFunctionNames<TAbi>]: (...args: Array<FunctionArgsTypes<TAbi>>) => Promise<FunctionReturnTypes<TAbi>>
}

class BaseContract extends BaseContractEthers {}

interface BaseContact extends ContractMethods {}
