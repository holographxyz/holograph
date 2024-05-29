import {HolographError, HolographErrorCode} from '../holograph-error'

export const HYDRATED_ASSET_PROPERTY_NOT_FOUND_ERROR_MESSAGE = (properties: any[]) =>
  `HOLOGRAPH: The following properties are required to deploy a collection but were not found: ${properties.join(
    ', ',
  )}.`

export class HydratedAssetPropertyNotFound extends HolographError {
  constructor(properties: any[], triggerFunction?: string, cause?: Error) {
    super({
      name: HydratedAssetPropertyNotFound.name,
      code: HolographErrorCode.HOLO_SDK_10012,
      options: cause ? {cause} : undefined,
      message: HYDRATED_ASSET_PROPERTY_NOT_FOUND_ERROR_MESSAGE(properties),
      triggerFunction,
    })
  }
}
