// import {BridgeCollection} from './assets/bridge-collection'
// import {BridgeNFT} from './assets/bridge-nft'
import {HolographLegacyCollection} from './assets/collection-legacy'
import {HolographMoeERC721DropV1, HolographMoeERC721DropV2} from './assets/collection-moe'
import {NFT} from './assets/nft'
import {MoeNFT} from './assets/nft-moe'
import {HolographAccountFactory, HolographWallet} from './services'
import {DeploymentConfig, ERC721Config, HolographConfig, Signature, SignDeploy} from './utils/types'

// TODO: Uncomment Bridge class imports after resolving the dependency issue for the FE integration

export {
  HolographLegacyCollection,
  HolographMoeERC721DropV1,
  HolographMoeERC721DropV2,
  NFT,
  MoeNFT,
  // BridgeNFT,
  // BridgeCollection,
  HolographAccountFactory,
  HolographWallet,
}

export type {DeploymentConfig, ERC721Config, HolographConfig, Signature, SignDeploy}
