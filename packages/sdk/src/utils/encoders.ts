import {Hex, keccak256} from 'viem'
import {bytecodes, BytecodeType} from '../constants/bytecodes'

import {remove0x, sha3} from './transformers'
import {DeploymentConfig} from './decoders'

export function create2address(deploymentConfig: DeploymentConfig, factoryAddress: string): string {
  const configHash: string = deploymentConfigHash(deploymentConfig)
  const futureAddress: string =
    '0x' +
    sha3(
      '0xff' + remove0x(factoryAddress) + remove0x(configHash) + remove0x(sha3(bytecodes[BytecodeType.Holographer])),
    ).slice(26)
  return futureAddress
}

export function deploymentConfigHash(deploymentConfig: DeploymentConfig): string {
  const configHash: string = sha3(
    (
      '0x' +
      remove0x(BigInt(deploymentConfig.config.contractType).toString(16)).padStart(64, '0') +
      remove0x(BigInt(deploymentConfig.config.chainType).toString(16)).padStart(8, '0') +
      remove0x(BigInt(deploymentConfig.config.salt).toString(16)).padStart(64, '0') +
      remove0x(sha3(deploymentConfig.config.byteCode)) +
      remove0x(sha3(deploymentConfig.config.initCode)) +
      remove0x(BigInt(deploymentConfig.signer).toString(16)).padStart(40, '0')
    ).toLowerCase(),
  )
  return configHash
} //TODO: validate

// deploymentConfigHash(deploymentConfig: DeploymentConfig): string {
//   const configHash: string = this.sha3(
//     (
//       '0x' +
//       this.remove0x(BigNumber.from(deploymentConfig.config.contractType).toHexString()).padStart(64, '0') +
//       this.remove0x(BigNumber.from(deploymentConfig.config.chainType).toHexString()).padStart(8, '0') +
//       this.remove0x(BigNumber.from(deploymentConfig.config.salt).toHexString()).padStart(64, '0') +
//       this.remove0x(this.sha3(deploymentConfig.config.byteCode)) +
//       this.remove0x(this.sha3(deploymentConfig.config.initCode)) +
//       this.remove0x(BigNumber.from(deploymentConfig.signer).toHexString()).padStart(40, '0')
//     ).toLowerCase(),
//   )
//   return configHash
// }

export function storageSlot(input: Hex): string {
  return '0x' + remove0x((BigInt(keccak256(input)) - BigInt(1)).toString(16)).padStart(64, '0')
  //TODO: validate
  // return (
  //   '0x' +
  //   remove0x(web3.utils.toHex(web3.utils.toBN(web3.utils.keccak256(input)).sub(web3.utils.toBN(1)))).padStart(64, '0')
  // )
}
