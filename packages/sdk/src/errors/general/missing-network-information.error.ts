import {HolographError, HolographErrorCode} from '../holograph-error'

export class MissingNetworkInformationError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: MissingNetworkInformationError.name,
      code: HolographErrorCode.HOLO_SDK_10008,
      options: cause ? {cause} : undefined,
      message:
        'Missing network information. Please provide either "networks" or "chainsRpc" in the constructor arguments.',
      description: `Creating a HolographWallet instance requires either a "networks" object or a "chainsRpc" object to be provided as arguments. 
                    Neither were found in the provided constructor arguments.`,
      triggerFunction,
    })
  }
}
