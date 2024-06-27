import {HolographError, HolographErrorCode} from '../holograph-error'

export const NOT_HOLOGRAPHED_CONTRACT_ERROR_MESSAGE = `HOLOGRAPH: Contract is not Holographed.`

export class NotHolographedContractError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: NotHolographedContractError.name,
      code: HolographErrorCode.HOLO_SDK_10018,
      options: cause ? {cause} : undefined,
      message: NOT_HOLOGRAPHED_CONTRACT_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
