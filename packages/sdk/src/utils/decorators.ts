import {HolographLegacyCollection} from '../assets/collection-legacy'
import {HolographMoeERC721DropV1, HolographMoeERC721DropV2} from '../assets/collection-moe'
import {NFT} from '../assets/nft'
import {UpdateDeployedCollection} from '../errors/assets/update-deployed-collection.error'
import {UpdateMintedNFTError} from '../errors/assets/update-minted-nft.error'

export function IsNotMinted() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function (this: NFT, ...args: any[]) {
      if (this.isMinted) {
        throw new UpdateMintedNFTError(propertyKey)
      } else {
        originalMethod.apply(this, args)
      }
    }
  }
}

export function IsNotDeployed() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function (
      this: HolographLegacyCollection | HolographMoeERC721DropV1 | HolographMoeERC721DropV2,
      ...args: any[]
    ) {
      if (Number(this.chainIds?.length) > 0) {
        throw new UpdateDeployedCollection(propertyKey)
      } else {
        originalMethod.apply(this, args)
      }
    }
  }
}
