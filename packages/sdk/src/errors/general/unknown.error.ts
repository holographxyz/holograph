import {HolographError, HolographErrorCode} from '../holograph-error'

export class UnknownError extends HolographError {
  constructor(cause: Error, triggerFunction?: string) {
    super({
      name: UnknownError.name,
      code: HolographErrorCode.HOLO_SDK_10001,
      options: {cause},
      message: `Unknown error.`,
      description: 'An error of unknown source was identified',
      triggerFunction,
    })
  }
}
