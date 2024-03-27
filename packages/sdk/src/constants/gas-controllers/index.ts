import {LEGACY_COLLECTION_DEPLOY_GAS} from './legacy-collection-deploy'
import {MOE_COLLECTION_DEPLOY_GAS} from './moe-collection-deploy'
import {MOE_NFT_MINT_GAS} from './moe-nft-mint'
import {NFT_MINT_GAS} from './nft-mint'

export type GasParams = {
  gasPrice?: bigint // in wei
  gasLimit?: bigint // in wei
  gasLimitMultiplier?: number // 1.2x = 120, 2x = 200
  gasPriceMultiplier?: number // 1.5x = 150, 3x = 300
}

type GasController = {
  legacyCollectionDeploy: Record<number, GasParams>
  moeCollectionDeploy: Record<number, GasParams>
  moeNftMint: Record<number, GasParams>
  nftMint: Record<number, GasParams>
}

export const GAS_CONTROLLER = {
  legacyCollectionDeploy: LEGACY_COLLECTION_DEPLOY_GAS,
  moeCollectionDeploy: MOE_COLLECTION_DEPLOY_GAS,
  moeNftMint: MOE_NFT_MINT_GAS,
  nftMint: NFT_MINT_GAS,
} as GasController
