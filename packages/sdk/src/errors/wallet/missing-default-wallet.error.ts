import {HolographError, HolographErrorCode} from '../holograph-error'

export class MissingDefaultWalletError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: MissingDefaultWalletError.name,
      code: HolographErrorCode.HOLO_SDK_10005,
      options: cause ? {cause} : undefined,
      message: `Missing default wallet configuration.`,
      description: 'The default wallet is a requirement. Make sure to add an account to the the Config instance.',
      triggerFunction,
    })
  }
}
