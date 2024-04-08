import {HolographError, HolographErrorCode} from '../holograph-error'

export const NOT_MINTED_NFT_ERROR_MESSAGE = 'HOLOGRAPH: NFT has not been minted'

export class NotMintedNFTError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: NotMintedNFTError.name,
      code: HolographErrorCode.HOLO_SDK_10010,
      options: cause ? {cause} : undefined,
      message: NOT_MINTED_NFT_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
