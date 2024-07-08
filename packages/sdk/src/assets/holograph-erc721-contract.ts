import {Address, Hex, encodeAbiParameters, parseAbiParameters, toBytes} from 'viem'

import {
  ContractInfo,
  CreateHolographERC721Contract,
  HydrateHolographERC721Contract,
  validate,
} from './contract.validation'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {FactoryContract, RegistryContract} from '../contracts'
import {HolographWallet} from '../services'
import {decodeBridgeableContractDeployedEvent} from '../utils/decoders'
import {EnforceHydrateCheck, IsNotDeployed} from '../utils/decorators'
import {create2AddressFromDeploymentHash, getERC721DeploymentConfigHash} from '../utils/encoders'
import {allEventsEnabled, destructSignature, generateRandomSalt, padAndHexify} from '../utils/helpers'
import {evm2hlg} from '../utils/transformers'
import {DeploymentConfig, ERC721Config, GasFee, Signature, SignDeploy, WriteContractOptions} from '../utils/types'

export class HolographERC721Contract {
  private _isHydrated = false
  private _contractInfo: ContractInfo
  public primaryChainId: number
  public account?: Address
  public chainIds?: number[]
  public contractAddress?: Address
  public erc721ConfigHash?: Hex
  public predictedContractAddress?: Address
  public signature?: Signature
  public txHash?: string

  private readonly factory: FactoryContract
  private readonly registry: RegistryContract

  constructor({contractInfo, primaryChainId}: CreateHolographERC721Contract) {
    this._contractInfo = validate.contractInfo.parse(contractInfo)
    this.primaryChainId = validate.primaryChainId.parse(primaryChainId)

    this.factory = new FactoryContract()
    this.registry = new RegistryContract()
    this.chainIds = []
  }

  static hydrate({contractInfo, chainId, address, txHash}: HydrateHolographERC721Contract) {
    const instance = new HolographERC721Contract({
      contractInfo,
      primaryChainId: chainId,
    })

    instance.chainIds = [chainId]
    instance.contractAddress = address
    instance.txHash = txHash
    instance._isHydrated = true

    if (!contractInfo.salt) {
      instance._contractInfo.salt = '0x0' as Hex
    }

    return instance
  }

  get name() {
    return this._contractInfo.name
  }

  get symbol() {
    return this._contractInfo.symbol
  }

  get royaltiesPercentage() {
    return this._contractInfo.royaltiesPercentage
  }

  get salt() {
    return this._contractInfo.salt
  }

  public getContractInfo(): ContractInfo {
    return this._contractInfo
  }

  get isHydrated() {
    return this._isHydrated
  }

  @IsNotDeployed()
  public setName(name: string) {
    validate.name.parse(name)
    this._contractInfo.name = name
  }

  @IsNotDeployed()
  public setSymbol(symbol: string) {
    validate.symbol.parse(symbol)
    this._contractInfo.symbol = symbol
  }

  @IsNotDeployed()
  public setRoyaltiesPercentage(royalties: number) {
    validate.royaltiesPercentage.parse(royalties)
    this._contractInfo.royaltiesPercentage = royalties
  }

  @IsNotDeployed()
  public setSalt(salt: Hex) {
    validate.salt.parse(salt)
    this._contractInfo.salt = salt
  }

  @EnforceHydrateCheck()
  public async createERC721DeploymentConfig(
    account: Address,
    chainId = this.primaryChainId,
  ): Promise<DeploymentConfig> {
    if (!this.salt) this.setSalt(generateRandomSalt())
    const salt = this.salt
    const chainType = evm2hlg(this.primaryChainId)
    const erc721Hash = padAndHexify('HolographERC721')
    const initCode = await this._generateInitCode(account, chainId)

    const erc721Config: DeploymentConfig = {
      contractType: erc721Hash,
      chainType,
      byteCode: bytecodes.CxipERC721,
      initCode,
      salt,
    }

    return erc721Config
  }

  /**
   * @param holographWallet - The HolographWallet instance to sign the deploy.
   * @param chainId - The chainId to sign the deploy. It's optional and defaults to the primaryChainId.
   * @returns - The signature data with the config and signature to deploy the contract.
   */
  @EnforceHydrateCheck()
  public async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const contractPayload = await this._getContractPayload(account, chainId)

    const config = contractPayload?.config
    const signedMessage = await holographWallet
      .onChain(chainId)
      .signMessage({
        account: holographWallet.account,
        message: config?.erc721ConfigHash,
      })
      .catch(() => {
        throw new Error('Signature rejected.')
      })
    const signature = destructSignature(signedMessage)
    this.signature = signature

    return {
      account,
      chainId,
      config: config?.erc721Config,
      signature,
      wallet: {account: holographWallet},
    }
  }

  /**
   * @param signatureData - The signature data returned from signDeploy function.
   * @returns - A transaction hash.
   */
  @EnforceHydrateCheck()
  public async deploy(
    signatureData: SignDeploy,
    options?: WriteContractOptions,
  ): Promise<{
    contractAddress: Address
    txHash: Hex
  }> {
    const {account, chainId, config, signature, wallet} = signatureData
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingContract(signatureData, chainId)
    const txHash = (await this.factory.deployHolographableContract(chainId!, config, signature, account, wallet, {
      ...options,
      gasPrice,
      gas: gasLimit,
    })) as Hex

    const client = await this.factory.getClientByChainId(chainId!)
    const receipt = await client.waitForTransactionReceipt({hash: txHash})
    const contractAddress = decodeBridgeableContractDeployedEvent(receipt)?.[0]?.values?.[0]

    this.contractAddress = contractAddress
    this.chainIds?.push(chainId!)
    this.txHash = txHash

    return {
      contractAddress,
      txHash,
    }
  }

  private async _getFactoryAddress(chainId = this.primaryChainId) {
    return this.factory.getAddress(chainId)
  }

  private async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  private async _getPredictedContractAddress(erc721ConfigHash: Hex, chainId = this.primaryChainId): Promise<Address> {
    const factoryAddress = await this._getFactoryAddress(chainId)

    const erc721FutureAddress = create2AddressFromDeploymentHash(erc721ConfigHash, factoryAddress)
    this.predictedContractAddress = erc721FutureAddress

    return erc721FutureAddress
  }

  @EnforceHydrateCheck()
  private async _generateInitCode(account: Address, chainId = this.primaryChainId) {
    const registryAddress = await this._getRegistryAddress(chainId)
    const creatorEncoded = encodeAbiParameters(parseAbiParameters('address'), [account])
    const initCodeEncoded = encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      padAndHexify('CxipERC721'),
      registryAddress,
      creatorEncoded,
    ])

    return encodeAbiParameters(parseAbiParameters('string, string, uint16, uint256, bool, bytes'), [
      this.name,
      this.symbol,
      this.royaltiesPercentage,
      // @ts-ignore
      allEventsEnabled(), // eventConfig
      false, // skipInit
      initCodeEncoded,
    ])
  }

  private async _getContractPayload(
    account: Address,
    chainId = this.primaryChainId,
  ): Promise<{salt: Hex; config: ERC721Config}> {
    const erc721Config = await this.createERC721DeploymentConfig(account, chainId)

    const erc721ConfigHash = getERC721DeploymentConfigHash(erc721Config, account)
    this.erc721ConfigHash = erc721ConfigHash

    const erc721ConfigHashBytes = toBytes(erc721ConfigHash)
    const erc721FutureAddress = await this._getPredictedContractAddress(erc721ConfigHash, chainId)

    return {
      config: {
        erc721Hash: erc721Config.contractType,
        erc721Config,
        erc721ConfigHash,
        erc721ConfigHashBytes,
        erc721FutureAddress,
      },
      salt: erc721Config.salt,
    }
  }

  private async _estimateGasForDeployingContract(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature, wallet} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.contractDeployment[chainId]

    if (gasController?.gasPrice) {
      gasPrice = gasController.gasPrice
    } else {
      gasPrice = await this.factory.getGasPrice(chainId)
    }

    if (gasController?.gasLimit) {
      gasLimit = gasController.gasLimit
    } else {
      gasLimit = await this.factory.estimateContractFunctionGas({
        args: [config, signature, account],
        chainId,
        functionName: 'deployHolographableContract',
        wallet,
      })
    }

    if (gasController?.gasLimitMultiplier) {
      gasLimit = (gasLimit * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPriceMultiplier) {
      gasPrice = (gasPrice * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    const gas = gasPrice * gasLimit

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }
}
