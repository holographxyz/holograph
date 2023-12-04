import {errorInfo, HolographErrorCode} from './error-info'
import {HolographError} from './holograph-error'

export class UnavailableNetworkError extends HolographError {
  constructor(chainId: number, triggerFunction?: string) {
    const {message, description} = errorInfo[HolographErrorCode.HOLO_SDK_10000](chainId)

    super({
      name: UnavailableNetworkError.name,
      code: HolographErrorCode.HOLO_SDK_10000,
      message,
      description,
      triggerFunction,
    })
  }
}
