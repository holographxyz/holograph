import {getNetworkByChainId} from '@holographxyz/networks'
import {Address, Hex, TransactionReceipt, encodeFunctionData, hexToBigInt} from 'viem'

import {Bridge, Operator} from '../contracts'
import {HolographBridgeABI} from '../constants/abi/develop'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Config, HolographWallet, Providers} from '../services'
import {EstimateBridgeOutResult, GasPricing, HolographConfig} from '../utils/types'
import {initializeGasPricing, getGasEstimationAddress, getTestGasLimit} from '../utils/gas'

export class BridgeAsset {
  private readonly _providers: Providers
  private readonly _bridge: Bridge
  private readonly _operator: Operator

  constructor(configObject: HolographConfig, private gasSettings?: {sourceGasPrice?: bigint; sourceGasLimit?: bigint}) {
    const config = Config.getInstance(configObject)
    this._providers = new Providers(config)
    this._bridge = new Bridge(config)
    this._operator = new Operator(config)
  }

  static createUnsignedBridgeOutTx(
    holographChainId: number,
    holographableContract: Address,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
  ) {
    return encodeFunctionData({
      abi: HolographBridgeABI,
      functionName: 'bridgeOutRequest',
      args: [holographChainId, holographableContract, gasLimit, gasPrice, bridgeOutPayload],
    })
  }

  protected async _createBridgeOutPayload(
    chainId: number,
    holographChainId: number,
    holographableContract: Address,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
  ) {
    return this._bridge.simulateContractFunction({
      chainId,
      functionName: 'getBridgeOutRequestPayload',
      args: [holographChainId, holographableContract, gasLimit, gasPrice, bridgeOutPayload],
    })
  }

  protected async _getMessageFee(
    chainId: number,
    holographChainId: number,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
  ) {
    return (
      await this._bridge.simulateContractFunction({
        chainId,
        functionName: 'getMessageFee',
        args: [holographChainId, gasLimit, gasPrice, bridgeOutPayload],
      })
    ).result as bigint[] //TODO: fix the type return
  }

  protected async _getValue(
    chainId: number,
    holographToChainId: number,
    destinationGasLimit: bigint,
    destinationGasPrice: bigint,
    bridgeRequestPayload: Hex,
  ) {
    const fees = await this._getMessageFee(
      chainId,
      holographToChainId,
      destinationGasLimit,
      destinationGasPrice,
      bridgeRequestPayload,
    )

    // fees consist of two parts: HToken fee and lz fee
    // fees[0] = Htoken fee is the amount that we charge user for making sure operators can get the job done
    // fees[1] = lz fee is what LayerZero charge for sending the message cross-chain
    // we add the two fees together into one number
    let feeValue: bigint = fees[0] + fees[1]

    // for now, to accommodate us time to properly estimate and calculate fees, we add 25% to give us margin for error
    return feeValue + feeValue * BigInt(1.25)
  }

  protected async _estimateBridgeOutDestinationGas(
    chainId: number,
    destinationChainId: number,
    contractAddress: Address,
    bridgeOutPayload: Hex,
  ) {
    let destinationGasPrice: bigint
    let destinationGasLimit: bigint // = BigInt(0)
    const gasController = GAS_CONTROLLER.bridgeNft[chainId]

    if (gasController?.gasLimit) {
      destinationGasLimit = gasController.gasLimit
    } else {
      // we call jobEstimator on destination chain
      // by supplying 10 million gas, we get back result of how much gas is left from simulation
      // subtract leftover gas from 10 million to know exactly how much gas is used for tx

      const destinationHolographChainId = getNetworkByChainId(destinationChainId).holographId
      const gasEstimationHelperAddress: Address = getGasEstimationAddress(destinationChainId)
      const maxGasValue: bigint = hexToBigInt(('0x' + 'ff'.repeat(32)) as Hex)
      const gasLimitStub: bigint = getTestGasLimit(destinationChainId) // this is a very big gas value so we can use to estimate with

      const bridgeRequestPayloadStub = this._createBridgeOutPayload(
        chainId,
        destinationHolographChainId,
        contractAddress,
        maxGasValue,
        maxGasValue,
        bridgeOutPayload,
      )

      const consumedGas = BigInt(
        (
          await this._operator.simulateContractFunction({
            chainId,
            functionName: 'jobEstimator',
            args: [bridgeRequestPayloadStub],
            options: {gas: gasLimitStub}, //{account: gasEstimationHelperAddress , gas: TEST_GAS_LIMIT},
          })
        ).result,
      )

      destinationGasLimit = gasLimitStub - consumedGas //TODO: ver se dá para chamar o gasEstimate ao invés de fazer essa conta
    }

    if (gasController?.gasLimitMultiplier) {
      destinationGasLimit = (destinationGasLimit * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPrice) {
      destinationGasPrice = gasController.gasPrice
    } else {
      // we extract the most recent and most accurate gas prices for destination network
      const provider = this._providers.byChainId(chainId)
      const gasPricing: GasPricing = await initializeGasPricing(provider)

      // get gas price based on eip-1559 support
      destinationGasPrice = gasPricing.isEip1559 ? gasPricing.maxFeePerGas! : gasPricing.gasPrice!
    }

    if (gasController?.gasPriceMultiplier) {
      destinationGasPrice = (destinationGasPrice * BigInt(gasController.gasPriceMultiplier!)) / BigInt(100)
    }

    return {
      destinationGasPrice,
      destinationGasLimit,
    }
  }

  async estimateBridgeOut(
    chainId: number,
    destinationChainId: number,
    contractAddress: Address,
    bridgeOutPayload: Hex,
  ): Promise<EstimateBridgeOutResult> {
    const {destinationGasPrice, destinationGasLimit} = await this._estimateBridgeOutDestinationGas(
      chainId,
      destinationChainId,
      contractAddress,
      bridgeOutPayload,
    )

    const destinationHolographChainId = getNetworkByChainId(destinationChainId).holographId

    // now that we have gasLimit and gasPrice, we update the payload to include the proper data needed for estimating fees
    const bridgeRequestPayload = (
      await this._createBridgeOutPayload(
        chainId,
        destinationHolographChainId,
        contractAddress,
        destinationGasLimit,
        destinationGasPrice,
        bridgeOutPayload,
      )
    ).result

    // we are now ready to get fees for transaction
    const feeValue = await this._getValue(
      chainId,
      destinationHolographChainId,
      destinationGasLimit,
      destinationGasPrice,
      bridgeRequestPayload,
    )

    const unsignedBridgeOutTx = BridgeAsset.createUnsignedBridgeOutTx(
      destinationHolographChainId,
      contractAddress,
      destinationGasLimit,
      destinationGasPrice,
      bridgeOutPayload,
      //{value: feeValue},// TODO: do we need to pass the value here?
    )

    // Source transaction parameters

    const sourceGasPrice = this.gasSettings?.sourceGasPrice ?? (await this._providers.byChainId(chainId).getGasPrice())

    const sourceGasLimit = this.gasSettings?.sourceGasLimit ?? BigInt(450000) // NOTE: Only to test user balance
    /**
     * TODO: put this in another place, this does not make part of the function scope
      const userBalance = await this.getSignerBalance()
      const sourceTxGas = sourceGasPrice.mul(sourceGasLimit)
      const totalValueNeeded = sourceTxGas.add(feeValue)
      const error = checkBalanceBeforeTX(userBalance, totalValueNeeded) // TODO: throw error for balance check
     */

    return {
      gasSource: {
        chainId,
        gasPrice: sourceGasPrice,
        gasLimit: sourceGasLimit,
      },
      gasDestination: {
        chainId: destinationChainId,
        gasPrice: destinationGasPrice,
        gasLimit: destinationGasLimit,
      },
      value: feeValue,
      unsignedTx: unsignedBridgeOutTx,
    }
  }

  protected async _bridgeOut(
    chainId: number,
    destinationChainId: number,
    wallet: HolographWallet,
    contractAddress: Address,
    bridgeOutPayload: Hex,
    options?: {sourceGasPrice?: bigint; sourceGasLimit?: bigint},
  ): Promise<TransactionReceipt> {
    const {unsignedTx, gasSource, value} = await this.estimateBridgeOut(
      chainId,
      destinationChainId,
      contractAddress,
      bridgeOutPayload,
    )

    const walletClient = wallet.onChain(chainId)

    const tx = await walletClient.sendTransaction({
      chain: walletClient.chain,
      account: wallet.account,
      data: unsignedTx,
      gasPrice: options?.sourceGasPrice ?? gasSource.gasPrice,
      gas: options?.sourceGasLimit ?? gasSource.gasLimit,
      value,
    })

    //@ts-ignore TODO: need to fix the holographWallet _multiChainWalletClient type, since the created WalletClient extend publicActions
    const receipt = await wallet.waitForTransactionReceipt({hash: tx}) // TODO: should we wait for the transaction to be processed?
    return receipt
  }
}
