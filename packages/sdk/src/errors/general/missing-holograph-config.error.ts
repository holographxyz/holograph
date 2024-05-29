import {HolographError, HolographErrorCode} from '../holograph-error'

export const MISSING_HOLOGRAPH_CONFIG_ERROR_MESSAGE =
  'HOLOGRAPH: No existing instance available. Please provide the holographConfig parameter to initialize the Config.'

export class MissingHolographConfig extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: MissingHolographConfig.name,
      code: HolographErrorCode.HOLO_SDK_10013,
      options: cause ? {cause} : undefined,
      message: MISSING_HOLOGRAPH_CONFIG_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
