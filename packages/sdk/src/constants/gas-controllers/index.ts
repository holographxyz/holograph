import {LEGACY_COLLECTION_DEPLOY_GAS} from './legacy-collection-deploy'
import {MOE_COLLECTION_DEPLOY_GAS} from './moe-collection-deploy'

type GasParams = {
  gasPrice?: string // in wei
  gasLimit?: string // in wei
  gasLimitMultiplier?: number // 1.2x = 120, 2x = 200
  gasPriceMultiplier?: number // 1.5x = 150, 3x = 300
}

type GasController = {
  legacyCollectionDeploy: Record<number, GasParams>
  moeCollectionDeploy: Record<number, GasParams>
}

export const GAS_CONTROLLER = {
  legacyCollectionDeploy: LEGACY_COLLECTION_DEPLOY_GAS,
  moeCollectionDeploy: MOE_COLLECTION_DEPLOY_GAS,
} as GasController
