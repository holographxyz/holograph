import {HolographError, HolographErrorCode} from '../holograph-error'

export class WalletNotFoundError extends HolographError {
  constructor(account: string, triggerFunction?: string, cause?: Error) {
    super({
      name: WalletNotFoundError.name,
      code: HolographErrorCode.HOLO_SDK_10006,
      options: cause ? {cause} : undefined,
      message: `No wallet was found for ${account}.`,
      description: `The requested wallet with the name or address '${account}' could not be found in the available wallets.`,
      triggerFunction,
    })
  }
}
