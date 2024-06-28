import {HolographError, HolographErrorCode} from '../holograph-error'

export const UNSUPPORTED_CONTRACT_TYPE_ERROR_MESSAGE = 'HOLOGRAPH: This contract type is not supported at the moment.'

export class UnsupportedContractTypeError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: UnsupportedContractTypeError.name,
      code: HolographErrorCode.HOLO_SDK_10016,
      options: cause ? {cause} : undefined,
      message: UNSUPPORTED_CONTRACT_TYPE_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
