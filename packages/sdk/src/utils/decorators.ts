import {HolographERC721Contract} from '../assets/holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from '../assets/holograph-open-edition-erc721-contract'
import {NFT} from '../assets/nft'
import {OpenEditionNFT} from '../assets/open-edition-nft'
import {HydratedAssetPropertyNotFound, NotMintedNFTError, UpdateDeployedContract, UpdateMintedNFTError} from '../errors'

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
      this: HolographERC721Contract | HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2,
      ...args: any[]
    ) {
      if (Number(this.chainIds?.length) > 0) {
        throw new UpdateDeployedContract(propertyKey)
      } else {
        originalMethod.apply(this, args)
      }
    }
  }
}

export function EnforceHydrateCheck() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function (
      this: HolographERC721Contract | HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2,
      ...args: any[]
    ) {
      if (this.isHydrated) {
        if (this.salt === '0x0' || !this.royaltiesPercentage) {
          throw new HydratedAssetPropertyNotFound(['salt', 'royaltiesPercentage'], propertyKey)
        }
      }
      return originalMethod.apply(this, args)
    }
  }
}

export function RequireMintedToken() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor[descriptor.get ? 'get' : 'value']
    descriptor[descriptor.get ? 'get' : 'value'] = function (this: OpenEditionNFT, ...args: any[]) {
      if (!this.isMinted) {
        throw new NotMintedNFTError(propertyKey)
      }
      return originalMethod.apply(this, args)
    }
  }
}
