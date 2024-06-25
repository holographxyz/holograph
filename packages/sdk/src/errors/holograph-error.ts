import {
  CallExecutionError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  RawContractError,
  TransactionExecutionError,
} from 'viem'

export enum HolographErrorCode {
  HOLO_SDK_10000 = 'HOLO_SDK_10000',
  HOLO_SDK_10001 = 'HOLO_SDK_10001',
  HOLO_SDK_10002 = 'HOLO_SDK_10002',
  HOLO_SDK_10003 = 'HOLO_SDK_10003',
  HOLO_SDK_10004 = 'HOLO_SDK_10004',
  HOLO_SDK_10005 = 'HOLO_SDK_10005',
  HOLO_SDK_10006 = 'HOLO_SDK_10006',
  HOLO_SDK_10007 = 'HOLO_SDK_10007',
  HOLO_SDK_10008 = 'HOLO_SDK_10008',
  HOLO_SDK_10009 = 'HOLO_SDK_10009',
  HOLO_SDK_10010 = 'HOLO_SDK_10010',
  HOLO_SDK_10011 = 'HOLO_SDK_10011',
  HOLO_SDK_10012 = 'HOLO_SDK_10012',
  HOLO_SDK_10013 = 'HOLO_SDK_10013',
  HOLO_SDK_10014 = 'HOLO_SDK_10014',
  HOLO_SDK_10015 = 'HOLO_SDK_10015',
  HOLO_SDK_10016 = 'HOLO_SDK_10016',
  HOLO_SDK_10017 = 'HOLO_SDK_10017',
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
    (err.name === TransactionExecutionError.name ||
      err.name === CallExecutionError.name ||
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
