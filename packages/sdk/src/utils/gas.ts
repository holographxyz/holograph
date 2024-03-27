import {getNetworkByChainId, networks} from '@holographxyz/networks'
import {Address, Block, PublicClient, Transaction} from 'viem'
import {GasPricing} from './types'

export function getTestGasLimit(chainId: number) {
  let testGasLimit: bigint

  switch (chainId) {
    case networks.mantle.chain:
    case networks.mantleTestnet.chain:
      testGasLimit = BigInt(1000000000)
      break
    default:
      testGasLimit = BigInt(10000000)
      break
  }

  return testGasLimit
}

export function getGasEstimationAddress(chainId: number): Address {
  // Optimism and zora uses a different address for the zero address so we use that instead to simulate the tx while estimating gas
  // NOTE: The different address is the address of the Wrapped ETH contract
  let destinationFrom: Address

  switch (chainId) {
    case networks.optimism.chain:
    case networks.optimismTestnetGoerli.chain:
    case networks.optimismTestnetSepolia.chain:
    case networks.zora.chain:
    case networks.zoraTestnetGoerli.chain:
    case networks.zoraTestnetSepolia.chain:
    case networks.base.chain:
    case networks.baseTestnetGoerli.chain:
    case networks.baseTestnetSepolia.chain:
      destinationFrom = '0x4200000000000000000000000000000000000006'
      break

    case networks.arbitrumOne.chain:
      destinationFrom = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
      break

    case networks.arbitrumTestnetGoerli.chain:
      destinationFrom = '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f'
      break

    case networks.arbitrumTestnetSepolia.chain:
      destinationFrom = '0x0b39384cd4680A0287b03F1D6e60dD5cfAF4e473'
      break

    default:
      destinationFrom = '0x0000000000000000000000000000000000000000'
      break
  }

  return destinationFrom
}

// This function is here to accomodate instances where a network has a minimum BaseBlockFee
export function adjustBaseBlockFee(chainId: number, baseBlockFee: bigint): bigint {
  const network: string = getNetworkByChainId(chainId).key
  // Avalanche has a minimum BaseBlockFee of 25 GWEI
  // https://docs.avax.network/quickstart/transaction-fees#base-fee
  if (
    (network === networks.avalanche.key || network === networks.avalancheTestnet.key) &&
    baseBlockFee < BigInt(25000000000)
  ) {
    return BigInt(25000000000)
  }

  if (
    (network === networks.binanceSmartChain.key || network === networks.binanceSmartChainTestnet.key) &&
    baseBlockFee < BigInt(3000000000)
  ) {
    return BigInt(3000000000)
  }

  return baseBlockFee
}

// Implemented from https://eips.ethereum.org/EIPS/eip-1559
export function calculateNextBlockFee(parent: Block): bigint {
  const zero: bigint = BigInt(0)
  if (parent.baseFeePerGas === undefined) {
    return zero
  }

  const one: bigint = BigInt(1)
  const elasticityMultiplier: bigint = BigInt(2)
  const baseFeeMaxChangeDenominator: bigint = BigInt(8)
  const baseFeePerGas: bigint = parent.baseFeePerGas!
  const parentGasTarget: bigint = parent.gasLimit / elasticityMultiplier
  if (parent.gasUsed === parentGasTarget) {
    return baseFeePerGas
  }

  let gasUsedDelta: bigint
  let baseFeeDelta: bigint
  if (parent.gasUsed > parentGasTarget) {
    // If the parent block used more gas than its target, the baseFee should increase.
    gasUsedDelta = parent.gasUsed - parentGasTarget
    baseFeeDelta = (baseFeePerGas * gasUsedDelta) / parentGasTarget / baseFeeMaxChangeDenominator
    if (one > baseFeeDelta) {
      baseFeeDelta = one
    }

    return baseFeePerGas + baseFeeDelta
  }

  // Otherwise if the parent block used less gas than its target, the baseFee should decrease.
  gasUsedDelta = parentGasTarget - parent.gasUsed
  baseFeeDelta = (baseFeePerGas * gasUsedDelta) / parentGasTarget / baseFeeMaxChangeDenominator
  return baseFeePerGas - baseFeeDelta
}

export function updateGasPricing(chainId: number, block: Block, gasPricing: GasPricing): GasPricing {
  if (block.baseFeePerGas) {
    gasPricing.isEip1559 = true
    gasPricing.nextBlockFee = adjustBaseBlockFee(chainId, calculateNextBlockFee(block))
    gasPricing.maxFeePerGas = gasPricing.nextBlockFee

    if (gasPricing.nextPriorityFee === null) {
      gasPricing.gasPrice = gasPricing.nextBlockFee
    } else {
      gasPricing.maxFeePerGas = gasPricing.nextBlockFee! + gasPricing.nextPriorityFee!
      gasPricing.gasPrice = gasPricing.maxFeePerGas
    }

    if (block.transactions.length > 0) {
      if (typeof block.transactions[0] !== 'string') {
        // we have a Block with transactions
        for (let i = 0, l = block.transactions.length; i < l; i++) {
          const tx = block.transactions[i] as Transaction
          if (gasPricing.isEip1559) {
            // set current tx priority fee
            let priorityFee: bigint = BigInt(0)
            let remainder: bigint

            if (tx.maxFeePerGas === undefined || tx.maxPriorityFeePerGas === undefined) {
              // we have a legacy transaction here, so need to calculate priority fee out
              priorityFee = tx.gasPrice! - block.baseFeePerGas!
            } else {
              // we have EIP-1559 transaction here, get priority fee
              // check first that base block fee is less than maxFeePerGas
              remainder = tx.maxFeePerGas! - block.baseFeePerGas!
              priorityFee = remainder > tx.maxPriorityFeePerGas! ? tx.maxPriorityFeePerGas! : remainder
            }

            if (gasPricing.nextPriorityFee === null) {
              gasPricing.nextPriorityFee = priorityFee
            } else {
              gasPricing.nextPriorityFee = (gasPricing.nextPriorityFee! + priorityFee) / BigInt(2)
            }
          }
          // for legacy networks, get average gasPrice
          else if (gasPricing.gasPrice === null) {
            gasPricing.gasPrice = tx.gasPrice!
          } else {
            gasPricing.gasPrice = (gasPricing.gasPrice! + tx.gasPrice!) / BigInt(2)
          }
        }
      }
    }
  }
  return gasPricing
}

export async function initializeGasPricing(provider: PublicClient): Promise<GasPricing> {
  const chainId = provider.chain?.id!
  const block = await provider.getBlock()

  const gasPricingStub: GasPricing = {
    isEip1559: false,
    gasPrice: null,
    nextBlockFee: null,
    nextPriorityFee: null,
    maxFeePerGas: null,
  }

  const gasPrices: GasPricing = updateGasPricing(chainId, block, gasPricingStub)

  if (!gasPrices.isEip1559) {
    // need to replace this with internal calculations
    gasPrices.gasPrice = await provider.getGasPrice()
  }

  const blockWithTransactions = await provider.getBlock({blockNumber: block.number, includeTransactions: true})
  return updateGasPricing(chainId, blockWithTransactions, gasPrices)
}
