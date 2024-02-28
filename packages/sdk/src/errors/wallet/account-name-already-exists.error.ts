import {HolographError, HolographErrorCode} from '../holograph-error'

export class AccountNameAlreadyExistsError extends HolographError {
  constructor(accountName: string, triggerFunction?: string, cause?: Error) {
    super({
      name: AccountNameAlreadyExistsError.name,
      code: HolographErrorCode.HOLO_SDK_10007,
      options: cause ? {cause} : undefined,
      message: `The account name "${accountName}" is already in use. Please choose a different name.`,
      description: `Adding a new account with the name "${accountName}" failed because an account with that name already exists. Use the "updateAccount" method to update existing accounts.`,
      triggerFunction,
    })
  }
}
