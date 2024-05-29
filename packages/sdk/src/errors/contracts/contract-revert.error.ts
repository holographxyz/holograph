import {HolographError, HolographErrorCode} from '../holograph-error'

export class ContractRevertError extends HolographError {
  constructor(contract: string, contractFunction: string, cause: Error, triggerFunction?: string) {
    super({
      name: ContractRevertError.name,
      code: HolographErrorCode.HOLO_SDK_10002,
      options: {cause},
      message: cause?.message?.includes('User rejected the request')
        ? 'Transaction rejected.'
        : `Contract function ${contract}.${contractFunction} reverted with. ${cause.message}.`,
      description: 'Contract function call reverted.',
      triggerFunction,
    })
  }
}
