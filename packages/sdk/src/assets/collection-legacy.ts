import {Address, encodeAbiParameters, encodePacked, Hex, keccak256, parseAbiParameters, toBytes} from 'viem'

import {collectionInfoSchema, primaryChainIdSchema, validate} from './collection.validation'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Factory, Registry} from '../contracts'
import {Config, HolographWallet} from '../services'
import {allEventsEnabled, destructSignature, generateRandomSalt, parseBytes} from '../utils/helpers'
import {evm2hlg, remove0x} from '../utils/transformers'
import {
  CollectionInfo,
  CreateLegacyCollection,
  Erc721Config,
  GasFee,
  HolographConfig,
  Signature,
  SignDeploy,
} from '../utils/types'

export class HolographLegacyCollection {
  collectionInfo: CollectionInfo
  primaryChainId: number
  account?: Address
  chainIds?: number[]
  erc721ConfigHash?: Hex
  predictedCollectionAddress?: Address
  signature?: Signature
  txHash?: string

  private factory: Factory
  private registry: Registry

  constructor(configObject: HolographConfig, {collectionInfo, primaryChainId}: CreateLegacyCollection) {
    this.collectionInfo = collectionInfoSchema.parse(collectionInfo)
    this.primaryChainId = primaryChainIdSchema.parse(primaryChainId)
    const config = Config.getInstance(configObject)
    const factory = new Factory(config)
    const registry = new Registry(config)
    this.factory = factory
    this.registry = registry
    this.chainIds = []
  }

  get name() {
    return this.collectionInfo.name
  }

  get description(): string | undefined {
    return this.collectionInfo.description
  }

  get symbol() {
    return this.collectionInfo.symbol
  }

  get tokenType() {
    return this.collectionInfo.tokenType
  }

  get royaltiesBps() {
    return this.collectionInfo.royaltiesBps
  }

  get salt() {
    return this.collectionInfo.salt
  }

  set name(name: string) {
    validate.name.parse(name)
    this.collectionInfo.name = name
  }

  set description(description: string) {
    validate.description.parse(description)
    this.collectionInfo.description = description
  }

  set symbol(symbol: string) {
    validate.symbol.parse(symbol)
    this.collectionInfo.symbol = symbol
  }

  set tokenType(tokenType: CollectionInfo['tokenType']) {
    validate.tokenType.parse(tokenType)
    this.collectionInfo.tokenType = tokenType
  }

  set royalties(royalties: number) {
    validate.royaltiesBps.parse(royalties)
    this.collectionInfo.royaltiesBps = royalties
  }

  set salt(salt: Hex) {
    validate.salt.parse(salt)
    this.collectionInfo.salt = salt
  }

  getCollectionInfo() {
    return this.collectionInfo
  }

  async _getFactoryAddress(chainId = this.primaryChainId) {
    return this.factory.getAddress(chainId)
  }

  async _getRegistryAddress(chainId = this.primaryChainId) {
    return this.registry.getAddress(chainId)
  }

  async _getPredictedCollectionAddress(erc721ConfigHash: string, chainId = this.primaryChainId): Promise<Address> {
    const factoryAddress = await this._getFactoryAddress(chainId)
    const futureAddressSuffix = keccak256(
      `0xff${remove0x(factoryAddress)}${remove0x(erc721ConfigHash)}${keccak256(
        remove0x(bytecodes.Holographer) as Hex,
      )}`,
    )
    const erc721FutureAddress = `0x${futureAddressSuffix.slice(26)}` as Hex
    this.predictedCollectionAddress = erc721FutureAddress

    return erc721FutureAddress
  }

  async _generateInitCode(account: Address, chainId = this.primaryChainId) {
    const registryAddress = await this._getRegistryAddress(chainId)
    const creatorEncoded = encodeAbiParameters(parseAbiParameters('address'), [account])
    const initCodeEncoded = encodeAbiParameters(parseAbiParameters('bytes32, address, bytes'), [
      parseBytes('CxipERC721'),
      registryAddress,
      creatorEncoded,
    ])

    return encodeAbiParameters(parseAbiParameters('string, string, uint16, uint256, bool, bytes'), [
      this.name,
      this.symbol,
      this.royaltiesBps,
      // @ts-ignore
      allEventsEnabled(), // eventConfig
      false, // skipInit
      initCodeEncoded,
    ])
  }

  async _getCollectionPayload(
    account: Address,
    chainId = this.primaryChainId,
  ): Promise<{salt: Hex; config: Erc721Config}> {
    const chainType = BigInt(evm2hlg(chainId)) as unknown as number
    const erc721Hash = parseBytes('HolographERC721')
    const salt = this.salt || generateRandomSalt()
    const initCode = await this._generateInitCode(account, chainId)

    const erc721Config = {
      contractType: erc721Hash,
      chainType,
      byteCode: bytecodes.CxipERC721,
      initCode,
      salt,
    }

    const erc721ConfigHash = keccak256(
      encodePacked(
        ['bytes32', 'uint32', 'bytes32', 'bytes32', 'bytes32', 'address'],
        [
          erc721Config.contractType,
          erc721Config.chainType,
          erc721Config.salt,
          keccak256(erc721Config.byteCode),
          keccak256(erc721Config.initCode),
          account,
        ],
      ),
    )
    this.erc721ConfigHash = erc721ConfigHash

    const erc721ConfigHashBytes = toBytes(erc721ConfigHash)
    const erc721FutureAddress = await this._getPredictedCollectionAddress(erc721ConfigHash, chainId)

    return {
      config: {
        erc721Hash,
        erc721Config,
        erc721ConfigHash,
        erc721ConfigHashBytes,
        erc721FutureAddress,
      },
      salt,
    }
  }

  async _estimateGasForDeployingCollection(data: SignDeploy, chainId = this.primaryChainId): Promise<GasFee> {
    const {account, config, signature} = data
    let gasLimit: bigint, gasPrice: bigint
    const gasController = GAS_CONTROLLER.legacyCollectionDeploy[chainId]

    if (gasController?.gasPrice) {
      gasPrice = BigInt(gasController.gasPrice!)
    } else {
      gasPrice = await this.factory.getGasPrice(chainId)
    }

    if (gasController?.gasLimit) {
      gasLimit = BigInt(gasController.gasLimit)
    } else {
      gasLimit = await this.factory.estimateContractFunctionGas({
        args: [config, signature, account],
        chainId,
        functionName: 'deployHolographableContract',
      })
    }

    if (gasController?.gasLimitMultiplier) {
      gasLimit = (BigInt(gasLimit) * BigInt(gasController.gasLimitMultiplier)) / BigInt(100)
    }

    if (gasController?.gasPriceMultiplier) {
      gasPrice = (BigInt(gasPrice) * BigInt(gasController.gasPriceMultiplier)) / BigInt(100)
    }

    const gas = BigInt(gasPrice) * BigInt(gasLimit)

    return {
      gasPrice,
      gasLimit,
      gas,
    }
  }

  /**
   * @param holographWallet - The HolographWallet instance to sign the deploy.
   * @param chainId - The chainId to sign the deploy. It's optional and defaults to the primaryChainId.
   * @returns - The signature data with the config and signature to deploy the collection contract.
   */
  async signDeploy(holographWallet: HolographWallet, chainId = this.primaryChainId): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account, chainId)

    const config = collectionPayload?.config
    const signedMessage = await holographWallet.onChain(chainId).signMessage({
      account: holographWallet.account,
      message: config?.erc721ConfigHash,
    })
    const signature = destructSignature(signedMessage)
    this.signature = signature

    return {
      account,
      chainId,
      config: config?.erc721Config,
      signature,
    }
  }

  /**
   * @param signatureData - The signature data returned from signDeploy function.
   * @returns - A transaction hash.
   */
  async deploy(signatureData: SignDeploy): Promise<unknown> {
    const {account, chainId, config, signature} = signatureData
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingCollection(signatureData, chainId)
    const txHash = await this.factory.deployHolographableContract(chainId!, config, signature, account, undefined, {
      gasPrice,
      gas: gasLimit,
    })

    this.chainIds?.push(chainId!)
    this.txHash = String(txHash)
    return txHash
  }

  // TODO: Do later
  deployBatch() {}
}
