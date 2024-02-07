import {HolographError, HolographErrorCode} from '../holograph-error'

export class InvalidHolographEnvironmentError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: InvalidHolographEnvironmentError.name,
      code: HolographErrorCode.HOLO_SDK_10004,
      options: cause ? {cause} : undefined,
      message: `Not a valid Holograph Environment!`,
      description: 'The provided holograph environment is not valid.',
      triggerFunction,
    })
  }
}
