import {Abi, AbiFunction, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames} from 'abitype'

declare function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<TAbi, TFunctionName>,
>(config: {
  abi: TAbi
  functionName: TFunctionName | ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
  args: AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'>
}): AbiParametersToPrimitiveTypes<TAbiFunction['outputs'], 'outputs'>
