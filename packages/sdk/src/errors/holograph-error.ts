import {
  CallExecutionError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  RawContractError,
} from 'viem'

export enum HolographErrorCode {
  HOLO_SDK_10000 = 'HOLO_SDK_10000',
  HOLO_SDK_10001 = 'HOLO_SDK_10001',
  HOLO_SDK_10002 = 'HOLO_SDK_10002',
  HOLO_SDK_10003 = 'HOLO_SDK_10003',
  HOLO_SDK_10004 = 'HOLO_SDK_10004',
}

interface HolographErrorParams {
  name: string
  description?: string
  options?: {cause: Error} //original error
  message: string // the human readable error
  code: HolographErrorCode
  triggerFunction?: string // name of the function
}

export abstract class HolographError extends Error {
  public readonly name: string
  public readonly description?: string
  public readonly code: HolographErrorCode
  public readonly triggerFunction?: string

  constructor(holographErrorParams: HolographErrorParams) {
    const {name, description, options, message, code, triggerFunction} = holographErrorParams
    super(message, options)

    this.name = name
    this.description = description
    this.code = code
    this.triggerFunction = triggerFunction
  }
}

export const normalizeException = (err: any): Error => {
  if (!(err instanceof Error)) {
    err = new Error(err)
  }
  return err
}

/**
 * Checks if the error is a result of a contract call
 * @param err
 * @returns true or false
 */
export const isCallException = (err: any): boolean => {
  if (
    err.name &&
    (err.name === CallExecutionError.name ||
      err.name === CallExecutionError.name ||
      err.name === ContractFunctionExecutionError.name ||
      err.name === ContractFunctionRevertedError.name ||
      err.name === ContractFunctionZeroDataError.name ||
      err.name === RawContractError.name)
  ) {
    return true
  }
  return false
}
