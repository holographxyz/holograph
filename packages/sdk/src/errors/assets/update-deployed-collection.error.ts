import {HolographError, HolographErrorCode} from '../holograph-error'

export const UPDATE_DEPLOYED_COLLECTION_ERROR_MESSAGE = 'HOLOGRAPH: cannot update a collection that is already deployed'

export class UpdateDeployedCollection extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: UpdateDeployedCollection.name,
      code: HolographErrorCode.HOLO_SDK_10011,
      options: cause ? {cause} : undefined,
      message: UPDATE_DEPLOYED_COLLECTION_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
