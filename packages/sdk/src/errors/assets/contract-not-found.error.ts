import {HolographError, HolographErrorCode} from '../holograph-error'

export const CONTRACT_NOT_FOUND_ERROR_MESSAGE = `HOLOGRAPH: The specified contract does not exist. Please verify the contract address.`

export class ContractNotFoundError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: ContractNotFoundError.name,
      code: HolographErrorCode.HOLO_SDK_10019,
      options: cause ? {cause} : undefined,
      message: CONTRACT_NOT_FOUND_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
