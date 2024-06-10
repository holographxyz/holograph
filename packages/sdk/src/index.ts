import {BridgeContract} from './assets/bridge-contract'
import {BridgeNFT} from './assets/bridge-nft'
import {HolographERC721Contract} from './assets/holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from './assets/holograph-open-edition-erc721-contract'
import {NFT} from './assets/nft'
import {OpenEditionNFT} from './assets/open-edition-nft'
import {HolographAccountFactory, HolographWallet, Config, HolographProtocol} from './services'
import {ContractType, DeploymentConfig, ERC721Config, HolographConfig, Signature, SignDeploy} from './utils/types'

export * from './contracts'

export {
  ContractType,
  HolographERC721Contract,
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
  NFT,
  OpenEditionNFT,
  BridgeNFT,
  BridgeContract,
  HolographAccountFactory,
  HolographWallet,
  HolographProtocol,
  Config,
}

export type {DeploymentConfig, ERC721Config, HolographConfig, Signature, SignDeploy}
