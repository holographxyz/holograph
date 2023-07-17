import {ethers} from 'ethers'
import {HolographFactory__factory, HolographFactory} from './typechain-types/factories/HolographFactory__factory'

interface DeploymentConfig {
  contractType: string
  chainType: string
  salt: string
  byteCode: string[]
  initCode: string[]
}

interface Verification {
  r: string
  s: string
  v: number
}

interface BridgeSettings {
  toChain: number
  value: string
  gasLimit: number
  gasPrice: string
}

export class HolographFactoryService {
  private contract: HolographFactory

  constructor(address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    this.contract = HolographFactory__factory.connect(address, signerOrProvider)
  }

  async init(initPayload: string): Promise<void> {
    const result = await this.contract.init(initPayload)
    if (result !== ethers.utils.id('init()')) {
      throw new Error('Initialization failed')
    }
  }

  async deployHolographableContract(config: DeploymentConfig, signature: Verification, signer: string): Promise<void> {
    await this.contract.deployHolographableContract(config, signature, signer)
  }

  async bridgeIn(fromChain: number, payload: string): Promise<void> {
    const result = await this.contract.bridgeIn(fromChain, payload)
    if (result !== ethers.utils.id('bridgeIn(uint32,bytes)')) {
      throw new Error('BridgeIn operation failed')
    }
  }

  async bridgeOut(toChain: number, sender: string, payload: string): Promise<[string, string]> {
    return await this.contract.bridgeOut(toChain, sender, payload)
  }

  async deployHolographableContractMultiChain(
    config: DeploymentConfig,
    signature: Verification,
    signer: string,
    deployOnCurrentChain: boolean,
    bridgeSettings: BridgeSettings[],
  ): Promise<void> {
    await this.contract.deployHolographableContractMultiChain(
      config,
      signature,
      signer,
      deployOnCurrentChain,
      bridgeSettings,
    )
  }

  async getHolograph(): Promise<string> {
    return await this.contract.getHolograph()
  }

  async setHolograph(holograph: string): Promise<void> {
    await this.contract.setHolograph(holograph)
  }

  async getRegistry(): Promise<string> {
    return await this.contract.getRegistry()
  }

  async setRegistry(registry: string): Promise<void> {
    await this.contract.setRegistry(registry)
  }
}

export default HolographFactoryService
