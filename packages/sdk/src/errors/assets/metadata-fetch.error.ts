import {HolographError, HolographErrorCode} from '../holograph-error'

export const METADATA_FETCH_ERROR_MESSAGE = 'HOLOGRAPH: Unable to fetch the metadata.'

export class MetadataFetchError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: MetadataFetchError.name,
      code: HolographErrorCode.HOLO_SDK_10017,
      options: cause ? {cause} : undefined,
      message: METADATA_FETCH_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
