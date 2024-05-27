import {Hex, hexToString} from 'viem'
import {padAndHexify} from './helpers'

export enum ReservedNamespaces {
  HolographGeneric = 'HolographGeneric',
  HolographERC20 = 'HolographERC20',
  HolographERC721 = 'HolographERC721',
  HolographDropERC721 = 'HolographDropERC721',
  HolographDropERC721V2 = 'HolographDropERC721V2',
  CustomERC721 = 'CustomERC721',
  CountdownERC721 = 'CountdownERC721',
  HolographDropERC1155 = 'HolographDropERC1155',
  HolographERC1155 = 'HolographERC1155',
  CxipERC721 = 'CxipERC721',
  CxipERC1155 = 'CxipERC1155',
  HolographRoyalties = 'HolographRoyalties',
  DropsPriceOracleProxy = 'DropsPriceOracleProxy',
  EditionsMetadataRendererProxy = 'EditionsMetadataRendererProxy',
  DropsMetadataRendererProxy = 'DropsMetadataRendererProxy',
  hToken = 'hToken',
}

export const ReservedNamespacesHash: {[key in ReservedNamespaces]: Hex} = Object.values(ReservedNamespaces).reduce(
  (acc, namespace) => {
    acc[namespace] = getReservedNamespaceHash(namespace)
    return acc
  },
  {} as {[key in ReservedNamespaces]: Hex},
)

export function getReservedNamespaceHash(reservedNamespace: ReservedNamespaces): Hex {
  return padAndHexify(reservedNamespace)
}

export function getReservedNamespaceFromHash(hash: Hex): ReservedNamespaces {
  // Convert hex string to namespace string and remove padding
  const namespace = hexToString(hash).replace(/\x00/g, '')

  if (namespace in ReservedNamespaces) {
    return namespace as ReservedNamespaces
  }

  throw new Error(`The provided hash "${hash}" does not correspond to any reserved namespace.`)
}
