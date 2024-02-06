import {BaseContract as BaseContractEthers, InterfaceAbi, JsonRpcProvider} from 'ethers'
import {Abi, AbiParametersToPrimitiveTypes, ExtractAbiFunction, ExtractAbiFunctionNames} from 'abitype'
import {Network, getNetworkByChainId} from '@holographxyz/networks'

/**
 * TODO: Take better look into FunctionReturnType. It appears that it's not returning the correct return type depending on the function, but rather all return types combined
 */

type ReadFunctionNames<TAbi extends Abi> = ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>

type FunctionArgsTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['inputs'],
  'inputs'
>[0]

type FunctionReturnTypes<TAbi extends Abi> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, ReadFunctionNames<TAbi>>['outputs'],
  'outputs'
>[0] // TODO: better unwrap the return type

type ContractMethods<TAbi extends Abi> = {
  [name in ReadFunctionNames<TAbi>]: (...args: Array<FunctionArgsTypes<TAbi>>) => Promise<FunctionReturnTypes<TAbi>>
}

class BaseContract extends BaseContractEthers {}

export type BaseContractType<TAbi extends Abi> = BaseContract & ContractMethods<TAbi>

export type AnyFunction<TArgs extends any[], TReturn extends any> = (...params: TArgs) => TReturn

export type HolographByNetworksResponse = {
  [chainId: number]: string | string[]
  /**
   * @ignore
   * TODO:
    We need to better define the return type for our functions. It's my understanding that we want to create our own type instead of the type returned when making the raw call.
 */
}

export const getContract = <TAbi extends Abi>(
  address: string,
  abi: InterfaceAbi,
  provider: JsonRpcProvider,
): BaseContractType<TAbi> => {
  const contract = new BaseContract(address, abi, provider) as BaseContractType<TAbi>
  return contract
}

export function getSelectedNetworks(networks: Network[], chainIds?: number[]): Network[] {
  if (chainIds && chainIds.length > 0) {
    networks = []

    chainIds.forEach(chainId => {
      try {
        const network = getNetworkByChainId(chainId)
        networks.push(network)
      } catch (e) {
        //TODO: map to a new error
        throw e
      }
    })
  }
  return networks
}

export function mapReturnType(returnValue: any | any[]): string | string[] {
  if (Array.isArray(returnValue) === false) {
    return returnValue.toString()
  }

  /**
   * @ignore
   * TODO:
   * There are two things that need to be dealt with:

    We need to better define the return type for our functions. It's my understanding that we want to create our own type instead of the type returned when making the raw call.

    The raw call return types are not correctly mapped using ABITypes, we need to make some improvements in our type definitions before mapping to our return type.
 */
  return returnValue.map(value => value.toString())
}
