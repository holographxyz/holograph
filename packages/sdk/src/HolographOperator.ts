import {HolographOperator__factory, HolographOperator} from './typechain-types/factories/HolographOperator__factory'
import {OperatorType} from './typechain-types' // import the necessary types
import {Signer} from 'ethers'

class HolographOperatorService {
  private contract: HolographOperator

  constructor(private signer: Signer, private operatorContractAddress: string) {
    this.contract = HolographOperator__factory.connect(this.operatorContractAddress, this.signer)
  }

  async getOperatorType(operatorId: string): Promise<OperatorType> {
    return await this.contract.getOperatorType(operatorId)
  }
}

export default HolographOperatorService
