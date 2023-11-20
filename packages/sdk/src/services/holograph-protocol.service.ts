import {EventInfo, HOLOGRAPH_EVENTS} from '../constants/events'

import {Providers} from './providers.service'
import {Config} from '../config/config.service'
import {Holograph} from '../contracts/Holograph'

class HolographProtocol {
  public static readonly targetEvents: Record<string, EventInfo> = HOLOGRAPH_EVENTS

  private readonly providers: Providers
  private holographContract!: Holograph
  // private registryContract!: Contract
  // private bridgeContract!: Contract
  // private operatorContract!: Contract
  // private factoryContract!: Contract

  constructor(private readonly protocolConfig: Config) {
    this.providers = new Providers(protocolConfig)

    this.holographContract = new Holograph(this.protocolConfig, this.providers)
  }

  get holograph() {
    return this.holographContract
  }

  // async initContracts2(): Promise<void> {}

  // async initContracts(): Promise<void> {
  //   if (this.holographContract !== undefined) {
  //     this.logger.info('Contracts are already initialized')
  //     return
  //   }

  //   const usedChains = getUsedChainIds()
  //   const provider = this.providers[usedChains[0]]
  //   const holographContractAddress = Addresses.holograph(this.environment)

  //   this.holographContract = new Contract(
  //     holographContractAddress,
  //     await getAbi(this.environment, 'Holograph'),
  //     provider,
  //   )

  //   const registryAddress: string = (await this.holographContract.getRegistry()).toLowerCase()
  //   const bridgeContractAddress: string = (await this.holographContract.getBridge()).toLowerCase()
  //   const operatorContractAddress: string = (await this.holographContract.getOperator()).toLowerCase()
  //   const factoryContractAddress: string = (await this.holographContract.getFactory()).toLowerCase()

  //   this.logger.info(``)
  //   this.logger.info(`📄 Holograph address: ${holographContractAddress}`)
  //   this.logger.info(`📄 Bridge address: ${bridgeContractAddress}`)
  //   this.logger.info(`📄 Factory address: ${factoryContractAddress}`)
  //   this.logger.info(`📄 Operator address: ${operatorContractAddress}`)
  //   this.logger.info(`📄 Registry address: ${registryAddress}`)
  //   this.logger.info(``)

  //   this.registryContract = new Contract(registryAddress, await getAbi(this.environment, 'HolographRegistry'), provider)
  //   this.bridgeContract = new Contract(
  //     bridgeContractAddress,
  //     await getAbi(this.environment, 'HolographBridge'),
  //     provider,
  //   )
  //   this.operatorContract = new Contract(
  //     operatorContractAddress,
  //     await getAbi(this.environment, 'HolographOperator'),
  //     provider,
  //   )
  //   this.factoryContract = new Contract(
  //     factoryContractAddress,
  //     await getAbi(this.environment, 'HolographFactory'),
  //     provider,
  //   )
  // }

  // async getHolographContract(chainId: number): Promise<Contract> {
  //   if (this.holographContract === undefined) {
  //     await this.initContracts()
  //   }

  //   const provider = this.providers[chainId]
  //   return this.holographContract.connect(provider)
  // }

  // async getRegistryContract(chainId: number): Promise<Contract> {
  //   if (this.holographContract === undefined) {
  //     await this.initContracts()
  //   }

  //   const provider = this.providers[chainId]
  //   return this.registryContract.connect(provider)
  // }

  // async getBridgeContract(chainId: number): Promise<Contract> {
  //   if (this.holographContract === undefined) {
  //     await this.initContracts()
  //   }

  //   const provider = this.providers[chainId]
  //   return this.bridgeContract.connect(provider)
  // }

  // async getOperatorContract(chainId: number): Promise<Contract> {
  //   if (this.holographContract === undefined) {
  //     await this.initContracts()
  //   }

  //   const provider = this.providers[chainId]
  //   return this.operatorContract.connect(provider)
  // }

  // async getFactoryContract(chainId: number): Promise<Contract> {
  //   if (this.holographContract === undefined) {
  //     await this.initContracts()
  //   }

  //   const provider = this.providers[chainId]
  //   return this.factoryContract.connect(provider)
  // }

  // async getCxipERC721ContractAt(chainId: number, address: string): Promise<Contract> {
  //   return new Contract(address, await getAbi(this.environment, 'CxipERC721'), this.providers[chainId])
  // }

  // async getContractType(contractAddress: string, chainId: number): Promise<ContractType> {
  //   const provider = this.providers[chainId]

  //   const holographDropERC721Proxy = new Contract(
  //     contractAddress,
  //     await getAbi(this.environment, 'HolographDropERC721Proxy'),
  //     provider,
  //   )

  //   const cxipCollectionResponse = '0x0000000000000000000000000000000000000001'

  //   try {
  //     const holographDropERC721Source = await holographDropERC721Proxy.getHolographDropERC721Source()

  //     if (holographDropERC721Source === cxipCollectionResponse) {
  //       return ContractType.Collection
  //     } else {
  //       return ContractType.Drop
  //     }
  //   } catch (error) {
  //     return ContractType.Unknown
  //   }
  // }
}

export default HolographProtocol
