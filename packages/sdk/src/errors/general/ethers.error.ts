import {HolographError, HolographErrorCode} from '../holograph-error'

export class EthersError extends HolographError {
  constructor(cause: Error, triggerFunction?: string) {
    super({
      name: EthersError.name,
      code: HolographErrorCode.HOLO_SDK_10001,
      options: {cause},
      message: `Ethers error.`,
      description: `Holograph Error wrap around an ethers error.`,
      triggerFunction,
    })
  }
}
