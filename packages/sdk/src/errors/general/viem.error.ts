import {HolographError, HolographErrorCode} from '../holograph-error'

export class ViemError extends HolographError {
  constructor(cause: Error, triggerFunction?: string) {
    super({
      name: ViemError.name,
      code: HolographErrorCode.HOLO_SDK_10001,
      options: {cause},
      message: !!cause?.message?.match(/rejected|denied/gi) ? 'Transaction rejected.' : `Viem error.`,
      description: `Holograph Error wrap around an viem error.`,
      triggerFunction,
    })
  }
}
