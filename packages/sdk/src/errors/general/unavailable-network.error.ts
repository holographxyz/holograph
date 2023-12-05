import {BigNumberish} from 'ethers'

import {HolographError, HolographErrorCode} from '../holograph-error'

export class UnavailableNetworkError extends HolographError {
  constructor(chainId: BigNumberish, triggerFunction?: string, cause?: Error) {
    super({
      name: UnavailableNetworkError.name,
      code: HolographErrorCode.HOLO_SDK_10001,
      options: cause ? {cause} : undefined,
      message: `Failed to get network for chainId ${chainId}.`,
      description: 'The provided chainId is not in the scope',
      triggerFunction,
    })
  }
}
