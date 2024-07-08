import {Address} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {BridgeContract} from '../../assets/bridge-contract'
import {HolographERC721Contract} from '../../assets/holograph-erc721-contract'
import {HolographWallet} from '../../services'
import {testConfigObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID} from '../setup'
import {generateRandomSalt} from '../../utils/helpers'
import {HolographAccount} from '../../utils/types'

/**
 * TODO:
 * These tests should be executed on a testnet as they are not expected to run successfully locally.
 */
describe('Asset class: BridgeContract', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const accountAddress = account?.address
  const wallet = new HolographWallet({account, networks: testConfigObject.networks})

  let contract: HolographERC721Contract
  let bridgeContract: BridgeContract
  let sourceChainId: number
  let destinationChainId: number
  let contractAddress: Address

  beforeAll(async () => {
    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID

    contract = new HolographERC721Contract({
      contractInfo: {
        name: 'NFTs Without Boundaries',
        symbol: 'HOLO',
        royaltiesPercentage: 2000,
        salt: generateRandomSalt(),
      },
      primaryChainId: sourceChainId,
    })

    const signatureData = await contract.signDeploy(wallet)
    const deploymentData = await contract.deploy(signatureData)
    const erc721DeploymentConfig = await contract.createERC721DeploymentConfig(accountAddress)
    contractAddress = deploymentData.contractAddress

    bridgeContract = new BridgeContract({
      sourceChainId,
      contractAddress,
      erc721DeploymentConfig,
      wallet,
    })
  })

  it('should be able to get the BridgeContract wrapper class', () => {
    expect(BridgeContract).toHaveProperty('createInitCode')

    expect(bridgeContract).toHaveProperty('getInitCode')
    expect(bridgeContract).toHaveProperty('bridgeOut')
  })

  describe('getInitCode()', () => {
    it('should be able to get the bridge out request init code', async () => {
      const bridgeOutPayload = await bridgeContract.getInitCode()

      expectTypeOf(bridgeOutPayload).toBeString()
      expect(bridgeOutPayload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('bridgeOut()', () => {
    it('should be able to bridge a contract', async () => {
      const tx = await bridgeContract.bridgeOut(destinationChainId)

      const receipt = await wallet.onChain(sourceChainId).getTransactionReceipt({hash: tx.hash})
      expect(receipt.status).toBe('success')
    })
  })
})
