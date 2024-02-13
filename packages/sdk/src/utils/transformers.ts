import {Hex, keccak256} from 'viem'

export enum ContractName {
  Holograph = 'Holograph',
  HolographRegistry = 'HolographRegistry',
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

export const REGEX = {
  WALLET_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
}
