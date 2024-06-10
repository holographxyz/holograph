import {HolographError, HolographErrorCode} from '../holograph-error'

export const UPDATE_DEPLOYED_CONTRACT_ERROR_MESSAGE = 'HOLOGRAPH: cannot update a contract that is already deployed'

export class UpdateDeployedContract extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: UpdateDeployedContract.name,
      code: HolographErrorCode.HOLO_SDK_10011,
      options: cause ? {cause} : undefined,
      message: UPDATE_DEPLOYED_CONTRACT_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
