import {Address} from 'viem'
import {beforeAll, describe, expect, expectTypeOf, it} from 'vitest'

import {BridgeContract} from '../../assets/bridge-contract'
import {HolographWallet} from '../../services'
import {testConfigObject, LOCALHOST2_CHAIN_ID, LOCALHOST_CHAIN_ID, localhostContractAddresses} from '../setup'
import {HolographAccount} from '../../utils/types'
import {BridgeERC20} from '../../assets/bridge-erc20'

/**
 * TODO:
 * These tests should be executed on a testnet as they are not expected to run successfully locally.
 */
describe('Asset class: BridgeERC20', () => {
  const account: HolographAccount = testConfigObject.accounts?.default!
  const wallet = new HolographWallet({
    account,
    networks: testConfigObject.networks,
  })

  let bridgeERC20: BridgeERC20
  let sourceChainId: number
  let destinationChainId: number
  let contractAddress: Address
  let amount: bigint

  beforeAll(async () => {
    sourceChainId = LOCALHOST_CHAIN_ID
    destinationChainId = LOCALHOST2_CHAIN_ID
    contractAddress = localhostContractAddresses.hlg
    amount = BigInt(1000)

    bridgeERC20 = new BridgeERC20({
      sourceChainId,
      destinationChainId,
      contractAddress,
      amount,
      wallet,
    })
  })

  it('should be able to get the BridgeERC20 wrapper class', () => {
    expect(BridgeContract).toHaveProperty('createInitCode')

    expect(bridgeERC20).toHaveProperty('getInitCode')
    expect(bridgeERC20).toHaveProperty('bridgeOut')
  })

  describe('getInitCode()', () => {
    it('should be able to get the bridge out request init code', async () => {
      const bridgeOutPayload = await bridgeERC20.getInitCode()

      expectTypeOf(bridgeOutPayload).toBeString()
      expect(bridgeOutPayload.startsWith('0x')).toBeTruthy()
    })
  })

  describe.skip('bridgeOut()', () => {
    it('should be able to bridge a ERC20 token', async () => {
      const tx = await bridgeERC20.bridgeOut(wallet)

      console.log('DEBUG| transaction hash: ', tx)

      const receipt = await wallet.onChain(sourceChainId).getTransactionReceipt({hash: tx.hash})
      expect(receipt.status).toBe('success')
    })
  })
})
