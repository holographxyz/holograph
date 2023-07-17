import {
  HolographInterfaces__factory,
  HolographInterfaces,
} from './typechain-types/factories/HolographInterfaces__factory'
import {ChainIdType, InterfaceType, TokenUriType} from 'src/typechain-types' // import the necessary types
import {Signer} from 'ethers'

class HolographInterfacesService {
  private contract: HolographInterfaces

  constructor(private signer: Signer, private contractAddress: string) {
    this.contract = HolographInterfaces__factory.connect(contractAddress, signer)
  }

  async init(initPayload: Uint8Array): Promise<void> {
    await this.contract.init(initPayload)
  }

  async contractURI(
    name: string,
    imageURL: string,
    externalLink: string,
    bps: number,
    contractAddress: string,
  ): Promise<string> {
    return await this.contract.contractURI(name, imageURL, externalLink, bps, contractAddress)
  }

  async getUriPrepend(uriType: TokenUriType): Promise<string> {
    return await this.contract.getUriPrepend(uriType)
  }

  async updateUriPrepend(uriType: TokenUriType, prepend: string): Promise<void> {
    await this.contract.updateUriPrepend(uriType, prepend)
  }

  async updateUriPrepends(uriTypes: TokenUriType[], prepends: string[]): Promise<void> {
    await this.contract.updateUriPrepends(uriTypes, prepends)
  }

  async getChainId(fromChainType: ChainIdType, fromChainId: number, toChainType: ChainIdType): Promise<number> {
    return await this.contract.getChainId(fromChainType, fromChainId, toChainType)
  }

  async updateChainIdMap(
    fromChainType: ChainIdType,
    fromChainId: number,
    toChainType: ChainIdType,
    toChainId: number,
  ): Promise<void> {
    await this.contract.updateChainIdMap(fromChainType, fromChainId, toChainType, toChainId)
  }

  async updateChainIdMaps(
    fromChainType: ChainIdType[],
    fromChainId: number[],
    toChainType: ChainIdType[],
    toChainId: number[],
  ): Promise<void> {
    await this.contract.updateChainIdMaps(fromChainType, fromChainId, toChainType, toChainId)
  }

  async supportsInterface(interfaceType: InterfaceType, interfaceId: string): Promise<boolean> {
    return await this.contract.supportsInterface(interfaceType, interfaceId)
  }

  async updateInterface(interfaceType: InterfaceType, interfaceId: string, supported: boolean): Promise<void> {
    await this.contract.updateInterface(interfaceType, interfaceId, supported)
  }

  async updateInterfaces(interfaceType: InterfaceType, interfaceIds: string[], supported: boolean): Promise<void> {
    await this.contract.updateInterfaces(interfaceType, interfaceIds, supported)
  }
}

export default HolographInterfacesService
