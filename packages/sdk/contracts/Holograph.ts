import {ethers} from 'ethers'
import {Holograph__factory} from 'src/typechain-types/factories/Holograph__factory'

type Address = string

export class Holograph {
  private readonly contract: ReturnType<typeof Holograph__factory.connect>

  constructor(private readonly address: Address, private readonly provider: ethers.providers.Provider) {
    this.contract = Holograph__factory.connect(address, provider)
  }

  async getBridge(): Promise<Address> {
    return this.contract.getBridge()
  }

  async setBridge(bridge: Address): Promise<void> {
    await this.contract.setBridge(bridge)
  }

  async getChainId(): Promise<number> {
    return this.contract.getChainId()
  }

  async setChainId(chainId: number): Promise<void> {
    await this.contract.setChainId(chainId)
  }

  async getFactory(): Promise<Address> {
    return this.contract.getFactory()
  }

  async setFactory(factory: Address): Promise<void> {
    await this.contract.setFactory(factory)
  }

  async getHolographChainId(): Promise<number> {
    return this.contract.getHolographChainId()
  }

  async setHolographChainId(holographChainId: number): Promise<void> {
    await this.contract.setHolographChainId(holographChainId)
  }

  async getInterfaces(): Promise<Address> {
    return this.contract.getInterfaces()
  }

  async setInterfaces(interfaces: Address): Promise<void> {
    await this.contract.setInterfaces(interfaces)
  }

  async getOperator(): Promise<Address> {
    return this.contract.getOperator()
  }

  async setOperator(operator: Address): Promise<void> {
    await this.contract.setOperator(operator)
  }

  async getRegistry(): Promise<Address> {
    return this.contract.getRegistry()
  }

  async setRegistry(registry: Address): Promise<void> {
    await this.contract.setRegistry(registry)
  }

  async getTreasury(): Promise<Address> {
    return this.contract.getTreasury()
  }

  async setTreasury(treasury: Address): Promise<void> {
    await this.contract.setTreasury(treasury)
  }

  async getUtilityToken(): Promise<Address> {
    return this.contract.getUtilityToken()
  }

  async setUtilityToken(utilityToken: Address): Promise<void> {
    await this.contract.setUtilityToken(utilityToken)
  }
}
