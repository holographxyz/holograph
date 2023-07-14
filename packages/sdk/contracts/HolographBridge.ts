import {ethers, Signer} from 'ethers'
import {HolographBridge__factory} from 'src/typechain-types/factories/HolographBridge__factory'

class HolographBridge {
  contract: HolographBridge__factory

  constructor(provider: ethers.providers.JsonRpcProvider, contractAddress: string) {
    this.contract = HolographBridge__factory.connect(contractAddress, provider)
  }

  async init(signer: Signer, initPayload: ethers.utils.BytesLike): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.init(initPayload)
  }

  async bridgeInRequest(
    signer: Signer,
    nonce: number,
    fromChain: number,
    holographableContract: string,
    hToken: string,
    hTokenRecipient: string,
    hTokenValue: ethers.BigNumber,
    doNotRevert: boolean,
    bridgeInPayload: ethers.utils.BytesLike,
  ): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.bridgeInRequest(
      nonce,
      fromChain,
      holographableContract,
      hToken,
      hTokenRecipient,
      hTokenValue,
      doNotRevert,
      bridgeInPayload,
      {value: ethers.utils.parseEther('1')},
    )
  }

  async bridgeOutRequest(
    signer: Signer,
    toChain: number,
    holographableContract: string,
    gasLimit: ethers.BigNumber,
    gasPrice: ethers.BigNumber,
    bridgeOutPayload: ethers.utils.BytesLike,
  ): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.bridgeOutRequest(toChain, holographableContract, gasLimit, gasPrice, bridgeOutPayload, {
      value: ethers.utils.parseEther('1'),
    })
  }

  async revertedBridgeOutRequest(
    signer: Signer,
    sender: string,
    toChain: number,
    holographableContract: string,
    bridgeOutPayload: ethers.utils.BytesLike,
  ): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.revertedBridgeOutRequest(sender, toChain, holographableContract, bridgeOutPayload)
  }

  async getBridgeOutRequestPayload(
    signer: ethers.Signer,
    toChain: number,
    holographableContract: string,
    gasLimit: ethers.BigNumber,
    gasPrice: ethers.BigNumber,
    bridgeOutPayload: ethers.utils.BytesLike,
  ): Promise<ethers.utils.Result> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.getBridgeOutRequestPayload(
      toChain,
      holographableContract,
      gasLimit,
      gasPrice,
      bridgeOutPayload,
    )
  }

  async getMessageFee(
    toChain: number,
    gasLimit: ethers.BigNumber,
    gasPrice: ethers.BigNumber,
    crossChainPayload: ethers.utils.BytesLike,
  ): Promise<[ethers.BigNumber, ethers.BigNumber, ethers.BigNumber]> {
    return this.contract.getMessageFee(toChain, gasLimit, gasPrice, crossChainPayload)
  }

  async getFactory(): Promise<string> {
    return this.contract.getFactory()
  }

  async setFactory(signer: ethers.Signer, factory: string): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.setFactory(factory)
  }

  async getHolograph(): Promise<string> {
    return this.contract.getHolograph()
  }

  async setHolograph(signer: ethers.Signer, holograph: string): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.setHolograph(holograph)
  }

  async getJobNonce(): Promise<ethers.BigNumber> {
    return this.contract.getJobNonce()
  }

  async getOperator(): Promise<string> {
    return this.contract.getOperator()
  }

  async setOperator(signer: ethers.Signer, operator: string): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.setOperator(operator)
  }

  async getRegistry(): Promise<string> {
    return this.contract.getRegistry()
  }

  async setRegistry(signer: ethers.Signer, registry: string): Promise<ethers.ContractTransaction> {
    const contractWithSigner = this.contract.connect(signer)
    return contractWithSigner.setRegistry(registry)
  }
}

export default HolographBridge
