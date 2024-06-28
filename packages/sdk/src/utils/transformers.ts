import {Chain, Hex, defineChain, keccak256, numberToHex} from 'viem'
import {getNetworkByChainId, getNetworkByHolographId} from '@holographxyz/networks'

export const REGEX = {
  WALLET_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
}

export function sha3(input: string | undefined): string {
  // handle empty bytes issue
  if (input === undefined || input === '' || input === '0x') {
    return '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
  }

  return keccak256(input as Hex)
}

export function remove0x(input: string): string {
  if (input.startsWith('0x')) {
    return input.slice(2)
  }

  return input
}

export function toAscii(input: string): string {
  input = remove0x(input.trim().toLowerCase())
  if (input.length % 2 !== 0) {
    input = '0' + input
  }

  // const arr = [...input]
  let output = ''
  for (let i = 0, l = input.length; i < l; i += 2) {
    const chunk = input[i] + input[i + 1] // TODO: validate ->  const chunk = arr[i] + arr[i + 1]
    if (chunk !== '00') {
      output += String.fromCharCode(Number.parseInt(chunk, 16))
    }
  }

  return output
}

export function lowerCaseAllStrings(input: any[], add?: string): any[] {
  const output = [...input]
  if (add !== undefined) {
    output.push(add)
  }

  for (let i = 0, l = output.length; i < l; i++) {
    if (typeof output[i] === 'string') {
      output[i] = (output[i] as string).toLowerCase()
    }
  }

  return output
}

export function baseClassSimulacrum<T>(): new () => Pick<T, keyof T> {
  return class {} as any
}

export function evm2hlg(evmChainId: number): number {
  return getNetworkByChainId(evmChainId).holographId
}

export function hlg2evm(hlgChainId: number): number {
  return getNetworkByHolographId(hlgChainId).chain
}

export function holographToViemChain(chainId: number): Chain {
  const network = getNetworkByChainId(chainId)
  const chain = defineChain({
    id: network.chain,
    name: network.name,
    nativeCurrency: {
      decimals: 18, // TODO:  add this info to the networks package
      name: network.tokenName,
      symbol: network.tokenSymbol,
    },
    rpcUrls: {
      default: {
        http: [network.rpc],
      },
    },
  })
  return chain
}

export function getParsedTokenId(tokenId: string) {
  const tokenIdHex = numberToHex(BigInt(tokenId), {size: 32})
  const chainIdHex = tokenIdHex.slice(0, 10)
  const tokenNumberHex = tokenIdHex.slice(10)

  return {
    decimal: tokenId,
    hex: tokenIdHex,
    part: {
      chainId: parseInt(chainIdHex, 16).toString(),
      tokenNumber: parseInt(tokenNumberHex, 16).toString(),
    },
  }
}
