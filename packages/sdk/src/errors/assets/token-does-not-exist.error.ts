import {HolographError, HolographErrorCode} from '../holograph-error'

export const TOKEN_ID_DOES_NOT_EXIST_ERROR_MESSAGE = 'HOLOGRAPH: token ID does not exist'

export class TokenDoesNotExistError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: TokenDoesNotExistError.name,
      code: HolographErrorCode.HOLO_SDK_10015,
      options: cause ? {cause} : undefined,
      message: TOKEN_ID_DOES_NOT_EXIST_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
