import {BRIDGE_NFT_GAS} from './bridge-nft'
import {CONTRACT_DEPLOYMENT_GAS} from './contract-deployment'
import {NFT_MINT_GAS} from './nft-mint'
import {OPEN_EDITION_CONTRACT_DEPLOYMENT_GAS} from './open-edition-contract-deployment'
import {OPEN_EDITION_NFT_MINT_GAS} from './open-edition-nft-mint'

export type GasParams = {
  gasPrice?: bigint // in wei
  gasLimit?: bigint // in wei
  gasLimitMultiplier?: number // 1.2x = 120, 2x = 200
  gasPriceMultiplier?: number // 1.5x = 150, 3x = 300
}

type GasController = {
  contractDeployment: Record<number, GasParams>
  openEditionContractDeployment: Record<number, GasParams>
  openEditionNftMint: Record<number, GasParams>
  nftMint: Record<number, GasParams>
  bridgeNft: Record<number, GasParams>
}

export const GAS_CONTROLLER = {
  contractDeployment: CONTRACT_DEPLOYMENT_GAS,
  openEditionContractDeployment: OPEN_EDITION_CONTRACT_DEPLOYMENT_GAS,
  openEditionNftMint: OPEN_EDITION_NFT_MINT_GAS,
  nftMint: NFT_MINT_GAS,
  bridgeNft: BRIDGE_NFT_GAS,
} as GasController
