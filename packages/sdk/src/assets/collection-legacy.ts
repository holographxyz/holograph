import {Address, encodeAbiParameters, encodePacked, Hex, keccak256, parseAbiParameters, toBytes} from 'viem'

import {collectionInfoSchema, validate} from './collection.validation'
import {bytecodes} from '../constants/bytecodes'
import {GAS_CONTROLLER} from '../constants/gas-controllers'
import {Factory, Registry} from '../contracts'
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
import {Config, HolographWallet} from '../services'

export class HolographLegacyCollection {
  collectionInfo: CollectionInfo
  primaryChainId: number
  account?: Address
  chainIds?: number[]
  erc721ConfigHash?: Hex
  predictedCollectionAddress?: Address
  signature?: Signature

  private factory: Factory
  private registry: Registry

  constructor(configObject: HolographConfig, {collectionInfo, primaryChainId}: CreateLegacyCollection) {
    this.collectionInfo = collectionInfoSchema.parse(collectionInfo)
    const config = Config.getInstance(configObject)
    const factory = new Factory(config)
    const registry = new Registry(config)
    this.factory = factory
    this.registry = registry
    this.primaryChainId = primaryChainId
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

  // TODO: Make all _* methods private after setting up all tests
  async _getFactoryAddress() {
    const factoryAddress = await this.factory.getAddress(this.primaryChainId)
    return factoryAddress
  }

  async _getRegistryAddress() {
    const registryAddress = await this.registry.getAddress(this.primaryChainId)
    return registryAddress
  }

  async _getPredictedCollectionAddress(erc721ConfigHash: string): Promise<Address> {
    const factoryAddress = await this._getFactoryAddress()
    const futureAddressSuffix = keccak256(
      `0xff${remove0x(factoryAddress)}${remove0x(erc721ConfigHash)}${remove0x(bytecodes.Holographer)}`,
    )
    const erc721FutureAddress = `0x${futureAddressSuffix}`.slice(26) as Hex
    this.predictedCollectionAddress = erc721FutureAddress

    return erc721FutureAddress
  }

  async _generateInitCode(account: Address) {
    const registryAddress = await this._getRegistryAddress()
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

  async _getCollectionPayload(account: Address): Promise<{salt: Hex; config: Erc721Config}> {
    const chainId = BigInt(evm2hlg(this.primaryChainId))
    const erc721Hash = parseBytes('HolographERC721')
    const salt = this.salt || generateRandomSalt()
    const initCode = await this._generateInitCode(account)

    const erc721Config = {
      contractType: erc721Hash,
      chainType: chainId as unknown as number,
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
    const erc721FutureAddress = await this._getPredictedCollectionAddress(erc721ConfigHash)

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

  async _estimateGasForDeployingCollection(data: SignDeploy): Promise<GasFee> {
    const {account, config, signature} = data
    const chainId = this.primaryChainId

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
      gasLimit = await this.factory.estimateGasForDeployingHolographableContract(
        this.primaryChainId,
        config,
        signature,
        account,
      )
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

  async signDeploy(holographWallet: HolographWallet): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account)

    const config = collectionPayload?.config
    const signedMessage = await holographWallet.onChain(this.primaryChainId).signMessage({
      account: holographWallet.account,
      message: config?.erc721ConfigHash,
    })
    const signature = destructSignature(signedMessage)
    this.signature = signature

    return {
      account,
      config: config?.erc721Config,
      signature,
    }
  }

  async deploy(data: SignDeploy): Promise<unknown> {
    const {account, config, signature} = data
    const {gasLimit, gasPrice} = await this._estimateGasForDeployingCollection(data)
    const tx = await this.factory.deployHolographableContract(
      this.primaryChainId,
      config,
      signature,
      account,
      undefined,
      {gasPrice, gas: gasLimit},
    )
    return tx
  }

  // TODO: Do later
  deployBatch() {}
}
