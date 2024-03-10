import {Address} from 'abitype'
import {encodeAbiParameters, encodePacked, Hex, keccak256, parseAbiParameters, toBytes} from 'viem'

import {collectionInfoSchema} from './collection.validation'
import {getEnv} from '../config/env.validation'
import {bytecodes} from '../constants/bytecodes'
import {Factory, Registry} from '../contracts'
import {allEventsEnabled, destructSignature, generateRandomSalt, parseBytes} from '../utils/helpers'
import {evm2hlg, remove0x} from '../utils/transformers'
import {CollectionInfo, CreateLegacyCollection, Erc721Config, Signature, SignDeploy} from '../utils/types'
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

  constructor({collectionInfo, primaryChainId}: CreateLegacyCollection) {
    this.collectionInfo = collectionInfoSchema.parse(collectionInfo)
    const config = Config.getInstance({
      environment: getEnv().HOLOGRAPH_ENVIRONMENT,
    })
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
    this.collectionInfo.name = name
  }

  set symbol(symbol: string) {
    this.collectionInfo.symbol = symbol
  }

  set tokenType(tokenType: CollectionInfo['tokenType']) {
    this.collectionInfo.tokenType = tokenType
  }

  set royalties(royalties: number) {
    this.collectionInfo.royaltiesBps = royalties
  }

  set salt(salt: Address) {
    this.collectionInfo.salt = salt
  }

  async _getFactoryAddress() {
    const factoryAddress = await this.factory.getAddress(this.primaryChainId)
    return factoryAddress
  }

  async _getRegistryAddress() {
    const registryAddress = await this.registry.getAddress(this.primaryChainId)
    return registryAddress
  }

  getCollectionInfo() {
    return this.collectionInfo
  }

  _getPredictedCollectionAddress(factoryAddress: Address, erc721ConfigHash: string): Address {
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
    const factoryAddress = await this._getFactoryAddress()
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
    const erc721FutureAddress = this._getPredictedCollectionAddress(factoryAddress, erc721ConfigHash)

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

  async signDeploy(holographWallet: HolographWallet): Promise<SignDeploy> {
    const account = holographWallet.account.address
    this.account = account
    const collectionPayload = await this._getCollectionPayload(account)

    const erc721Config = collectionPayload?.config
    const signedMessage = await holographWallet.onChain(this.primaryChainId).signMessage({
      account: holographWallet.account,
      message: erc721Config?.erc721ConfigHash,
    })
    const signature = destructSignature(signedMessage)
    this.signature = signature

    return {
      account,
      erc721Config,
      signature,
    }
  }

  async deploy(data: SignDeploy): Promise<unknown> {
    const {account, erc721Config, signature} = data
    // const { gasLimit, gasPrice } = await this.estimateGasForDeployingCollection(data)
    const tx = await this.factory.deployHolographableContract(
      this.primaryChainId,
      erc721Config.erc721Config,
      signature,
      account,
    )
    return tx
  }

  // TODO: Do later
  async estimateGasForDeployingCollection(data: SignDeploy) {
    const holographFactory = this.factory
    const chainId = this.primaryChainId
    let gasLimit, gasPrice

    // if (GAS_CONTROLLER.legacyCollectionDeploy[chainId]?.gasPrice) {
    //   gasPrice = BigInt(GAS_CONTROLLER.legacyCollectionDeploy[chainId].gasPrice)
    // } else {
    //   gasPrice = await this.getChainGasPrice()
    // }

    // if (GAS_CONTROLLER.legacyCollectionDeploy[chainId]?.gasLimit) {
    //   gasLimit = BigInt(GAS_CONTROLLER.legacyCollectionDeploy[chainId].gasLimit)
    // } else {
    //   gasLimit = await holographFactory.estimateGas.deployHolographableContract(erc721Config, signature, account)
    // }

    // if (GAS_CONTROLLER.legacyCollectionDeploy[chainId]?.gasLimitMultiplier) {
    //   gasLimit = (BigInt(gasLimit) * GAS_CONTROLLER.legacyCollectionDeploy[chainId].gasLimitMultiplier!) / 100
    // }

    // if (GAS_CONTROLLER.legacyCollectionDeploy[chainId]?.gasPriceMultiplier) {
    //   gasPrice = (BigInt(gasPrice) * GAS_CONTROLLER.legacyCollectionDeploy[chainId].gasPriceMultiplier!) / 100
    // }

    return {
      gasPrice,
      gasLimit,
      gas: gasPrice.mul(gasLimit),
    }
  }

  // TODO: Do later
  deployBatch() {}
}
