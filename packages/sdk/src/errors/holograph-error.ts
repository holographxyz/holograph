import {HolographErrorCode} from './error-info'

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
