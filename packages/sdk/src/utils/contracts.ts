import {BaseContract as BaseContractEthers, InterfaceAbi, JsonRpcProvider} from 'ethers'
import {Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames} from 'abitype'

/**
 * TODO: Take better look into FunctionReturnType. It appears that it's not returning the correct return type depending on the function, but rather all return types combined
 */

type ReadFunctionNames<TAbi extends Abi> = ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>

type FunctionArgsTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['inputs'],
  'inputs'
>

type FunctionReturnTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['outputs'],
  'outputs'
>[0]

type ContractMethods<TAbi extends Abi> = {
  [name in ReadFunctionNames<TAbi>]: (...args: Array<FunctionArgsTypes<TAbi>>) => Promise<FunctionReturnTypes<TAbi>>
}

class BaseContract extends BaseContractEthers {}

export type BaseContractType<TAbi extends Abi> = BaseContract & ContractMethods<TAbi>

export const getContract = <TAbi extends Abi>(
  address: string,
  abi: InterfaceAbi,
  provider: JsonRpcProvider,
): BaseContractType<TAbi> => {
  const contract = new BaseContract(address, abi, provider) as BaseContractType<TAbi>
  return contract
}
