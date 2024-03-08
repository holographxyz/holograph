import {NFT} from '../assets/nft'
import {UpdateMintedNftError} from '../errors/assets/update-minted-nft.error'

export function IsNotMinted() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: NFT, ...args: any[]) {
      if (this.isMinted) {
        throw new UpdateMintedNftError(propertyKey)
      } else {
        originalMethod.apply(this, args)
      }
    }
  }
}
