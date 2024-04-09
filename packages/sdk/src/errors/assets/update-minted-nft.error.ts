import {HolographError, HolographErrorCode} from '../holograph-error'

export const UPDATE_MINTED_NFT_ERROR_MESSAGE = 'HOLOGRAPH: cannot update an NFT that is already minted'

export class UpdateMintedNFTError extends HolographError {
  constructor(triggerFunction?: string, cause?: Error) {
    super({
      name: UpdateMintedNFTError.name,
      code: HolographErrorCode.HOLO_SDK_10009,
      options: cause ? {cause} : undefined,
      message: UPDATE_MINTED_NFT_ERROR_MESSAGE,
      triggerFunction,
    })
  }
}
