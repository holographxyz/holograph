import {getNetworkByChainId} from '@holographxyz/networks'
import {Address, Hex, Transaction, encodeFunctionData} from 'viem'

import {BridgeContract, OperatorContract} from '../contracts'
import {HolographBridgeABI} from '../constants/abi/develop'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {HolographLogger, HolographWallet, Providers} from '../services'
import {EstimateBridgeOutResult, GasPricing, GasSettings} from '../utils/types'
import {initializeGasPricing, getGasEstimationAddress, getTestGasLimit, MAX_GAS_VALUE} from '../utils/gas'

export class BridgeAsset {
  protected readonly _logger: HolographLogger
  private readonly _providers: Providers
  private readonly _bridge: BridgeContract
  private readonly _operator: OperatorContract

  constructor(private gasSettings?: GasSettings, _logger?: HolographLogger) {
    this._logger = _logger ?? HolographLogger.createLogger({className: BridgeAsset.name})

    this._providers = new Providers()
    this._bridge = new BridgeContract()
    this._operator = new OperatorContract()
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
    contractAddress: Address,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
  ): Promise<Hex> {
    const logger = this._logger.addContext({functionName: this._createBridgeOutPayload.name})

    logger.debug(`staticCall "getBridgeOutRequestPayload" input`, {
      chainId,
      args: {
        holographChainId,
        contractAddress,
        gasLimit,
        gasPrice,
        bridgeOutPayload,
      },
    })

    return (
      await this._bridge.simulateContractFunction({
        chainId,
        functionName: 'getBridgeOutRequestPayload',
        args: [holographChainId, contractAddress, gasLimit, gasPrice, bridgeOutPayload],
      })
    ).result as Hex
  }

  protected async _getMessageFee(
    chainId: number,
    holographChainId: number,
    gasLimit: bigint,
    gasPrice: bigint,
    bridgeOutPayload: Hex,
  ) {
    const logger = this._logger.addContext({functionName: this._getMessageFee.name})

    logger.debug(`staticCall "getMessageFee" input`, {
      chainId,
      args: {
        holographChainId,
        gasLimit,
        gasPrice,
        bridgeOutPayload,
      },
    })

    return (
      await this._bridge.simulateContractFunction({
        chainId,
        functionName: 'getMessageFee',
        args: [holographChainId, gasLimit, gasPrice, bridgeOutPayload],
      })
    ).result as bigint[]
  }

  protected async _getValue(
    chainId: number,
    holographToChainId: number,
    destinationGasLimit: bigint,
    destinationGasPrice: bigint,
    bridgeRequestPayload: Hex,
  ): Promise<bigint> {
    const logger = this._logger.addContext({functionName: this._getValue.name})

    logger.debug(`Requesting message fee...`)

    const fees = await this._getMessageFee(
      chainId,
      holographToChainId,
      destinationGasLimit,
      destinationGasPrice,
      bridgeRequestPayload,
    )

    /**
     * fees[0]: hlgFee the amount (in wei) of native gas token that will cost for finalizing job on destination chain
     * fees[1]: msgFee the amount (in wei) of native gas token that will cost for sending message to destination chain
     * fees[2]: dstGasPrice the amount (in wei) that destination message maximum gas price will be
     */
    const [hTokenFee, lzFee] = fees

    // fees consist of two parts: HToken fee and lz fee
    const feeValue: bigint = hTokenFee + lzFee

    // for now, to accommodate us time to properly estimate and calculate fees, we add 25% to give us margin for error
    const bufferFee: bigint = feeValue / BigInt(4)
    const totalFee: bigint = feeValue + bufferFee

    logger.debug(
      `Total fee breakdown:
        - HToken fee: ${hTokenFee} (job fee)
        - LayerZero fee: ${lzFee} (cross-chain message cost)
        - Buffer (25%): ${bufferFee} (accommodates estimation errors)
       ------------------------
        Total fee: ${totalFee}`,
    )

    return totalFee
  }

  protected async _estimateBridgeOutDestinationGas(
    chainId: number,
    destinationChainId: number,
    contractAddress: Address,
    bridgeOutPayload: Hex,
  ) {
    const logger = this._logger.addContext({functionName: this._estimateBridgeOutDestinationGas.name})

    let destinationGasPrice: bigint
    let destinationGasLimit: bigint
    const gasController = GAS_CONTROLLER.bridgeNft[destinationChainId]

    if (gasController?.gasLimit) {
      destinationGasLimit = gasController.gasLimit
    } else {
      // we call jobEstimator on destination chain
      // by supplying 10 million gas, we get back result of how much gas is left from simulation
      // subtract leftover gas from 10 million to know exactly how much gas is used for tx

      const destinationHolographChainId: number = getNetworkByChainId(destinationChainId).holographId
      const gasEstimationHelperAddress: Address = getGasEstimationAddress(destinationChainId)
      const gasLimitStub: bigint = getTestGasLimit(destinationChainId) // this is a very big gas value so we can use to estimate with

      const bridgeRequestPayloadStub: Hex = await this._createBridgeOutPayload(
        chainId,
        destinationHolographChainId,
        contractAddress,
        MAX_GAS_VALUE,
        MAX_GAS_VALUE,
        bridgeOutPayload,
      )

      /**
       * TODO: When calling the 'jobEstimator' function statically, the provided 'options.account' did not affect the outcome, suggesting it may be unnecessary. This behavior was observed on localhost. It is recommended to verify if the same occurs on testnet, and if confirmed, consider removing the extra code related to the 'options.account'.
       */
      const consumedGas: bigint = (
        await this._operator.simulateContractFunction({
          chainId: destinationChainId,
          functionName: 'jobEstimator',
          args: [bridgeRequestPayloadStub],
          transportType: 'http',
          // @ts-ignore: TS2322 - For some reason, the type inference is indicating that the account can only be 'account?: undefined'.
          options: {gas: gasLimitStub, account: gasEstimationHelperAddress},
        })
      ).result as bigint

      destinationGasLimit = gasLimitStub - consumedGas
    }

    if (gasController?.gasLimitMultiplier) {
      destinationGasLimit = (destinationGasLimit * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPrice) {
      destinationGasPrice = gasController.gasPrice
    } else {
      // we extract the most recent and most accurate gas prices for destination network
      const provider = this._providers.byChainId(destinationChainId, 'http')
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

  protected async _prepareBridgeOutRequest(
    chainId: number,
    destinationChainId: number,
    contractAddress: Address,
    bridgeOutPayload: Hex,
  ): Promise<EstimateBridgeOutResult> {
    const logger = this._logger.addContext({functionName: this._prepareBridgeOutRequest.name})

    let logObject: any = {}

    logObject = {...logObject, contractAddress}

    const {destinationGasPrice, destinationGasLimit} = await this._estimateBridgeOutDestinationGas(
      chainId,
      destinationChainId,
      contractAddress,
      bridgeOutPayload,
    )

    logObject = {...logObject, destinationGasPrice, destinationGasLimit}

    const destinationHolographChainId = getNetworkByChainId(destinationChainId).holographId

    logObject = {...logObject, destinationHolographChainId}

    // now that we have gasLimit and gasPrice, we update the payload to include the proper data needed for estimating fees
    const bridgeRequestPayload = await this._createBridgeOutPayload(
      chainId,
      destinationHolographChainId,
      contractAddress,
      destinationGasLimit,
      destinationGasPrice,
      bridgeOutPayload,
    )

    // we are now ready to get fees for transaction
    const feeValue = await this._getValue(
      chainId,
      destinationHolographChainId,
      destinationGasLimit,
      destinationGasPrice,
      bridgeRequestPayload,
    )

    logObject = {...logObject, feeValue}

    const unsignedBridgeOutTx = BridgeAsset.createUnsignedBridgeOutTx(
      destinationHolographChainId,
      contractAddress,
      destinationGasLimit,
      destinationGasPrice,
      bridgeOutPayload,
    )

    logger.info(`Getting source transactions parameters...`, logObject)

    const sourceGasPrice = this.gasSettings?.gasPrice ?? (await this._providers.byChainId(chainId).getGasPrice())

    const sourceGasLimit = this.gasSettings?.gasLimit ?? BigInt(650000) // NOTE: Only to test user balance

    const bridgeOutRequestData = {
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

    logObject = {...logObject, returnValue: bridgeOutRequestData}

    logger.info("Done calculating the return value for '_prepareBridgeOutRequest'", logObject)

    return bridgeOutRequestData
  }

  protected async _bridgeOut(
    chainId: number,
    destinationChainId: number,
    contractAddress: Address,
    bridgeOutPayload: Hex,
    wallet: HolographWallet,
    options?: GasSettings,
  ): Promise<Transaction> {
    const logger = this._logger.addContext({functionName: this._bridgeOut.name})

    const {unsignedTx, gasSource, value} = await this._prepareBridgeOutRequest(
      chainId,
      destinationChainId,
      contractAddress,
      bridgeOutPayload,
    )

    const walletClient = wallet.onChain(chainId)
    const bridgeContractAddress = await this._bridge.getAddress(chainId)

    const tx = await walletClient.sendTransaction({
      chain: walletClient.chain,
      account: wallet.account,
      to: bridgeContractAddress,
      data: unsignedTx,
      gasPrice: options?.gasPrice ?? gasSource.gasPrice,
      gas: options?.gasLimit ?? gasSource.gasLimit,
      value,
    })

    return walletClient.getTransaction({hash: tx})
  }
}
