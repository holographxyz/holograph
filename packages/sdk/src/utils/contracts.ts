import {Network, getNetworkByChainId} from '@holographxyz/networks'
import {Abi, AbiFunction} from 'viem'

export type HolographByNetworksResponse = {
  [chainId: number]: string | string[]
  /**
   * @ignore
   * TODO:
    We need to better define the return type for our functions. It's my understanding that we want to create our own type instead of the type returned when making the raw call.
 */
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
    if (typeof returnValue === 'object') {
      return returnValue
    }

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

export function isReadFunction(abi: Abi, fnName: string) {
  const readFnNames = new Set(
    abi
      .filter(item => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure'))
      .map(readFunction => (readFunction as AbiFunction).name),
  )

  return readFnNames.has(fnName)
}
