import {HolographError, HolographErrorCode} from '../holograph-error'

export const INSTANCE_ALREADY_EXISTS_ERROR_MESSAGE = 'Instance already exists and cannot be instantiated again.'

export class InstanceAlreadyExists extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: InstanceAlreadyExists.name,
      code: HolographErrorCode.HOLO_SDK_10014,
      options: cause ? {cause} : undefined,
      message: INSTANCE_ALREADY_EXISTS_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
