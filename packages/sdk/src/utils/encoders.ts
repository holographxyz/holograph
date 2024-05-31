import {Address, Hex, encodePacked, keccak256} from 'viem'

import {bytecodes} from '../constants/bytecodes'
import {remove0x} from './transformers'
import {DeploymentConfig, DeploymentConfigSettings} from './types'

export function create2address(deploymentConfig: DeploymentConfigSettings, factoryAddress: Address): Address {
  const configHash: Hex = getERC721DeploymentConfigHash(deploymentConfig.config, deploymentConfig.signer)

  return create2AddressFromDeploymentHash(configHash, factoryAddress)
}

export function create2AddressFromDeploymentHash(configHash: Hex, factoryAddress: Address): Address {
  return `0x${keccak256(
    `0xff${remove0x(factoryAddress)}${remove0x(configHash)}${remove0x(keccak256(bytecodes.Holographer))}`,
  ).slice(26)}`
}

export function getERC721DeploymentConfigHash(erc721DeploymentConfig: DeploymentConfig, signerAddress: Address): Hex {
  return keccak256(
    encodePacked(
      ['bytes32', 'uint32', 'bytes32', 'bytes32', 'bytes32', 'address'],
      [
        erc721DeploymentConfig.contractType,
        Number(erc721DeploymentConfig.chainType),
        erc721DeploymentConfig.salt,
        keccak256(erc721DeploymentConfig.byteCode),
        keccak256(erc721DeploymentConfig.initCode),
        signerAddress,
      ],
    ),
  )
}

export function getERC721DropDeploymentConfigHash(erc721DeploymentConfig: DeploymentConfig, signerAddress: Address) {
  return keccak256(
    ('0x' +
      remove0x(erc721DeploymentConfig.contractType) +
      remove0x(String(erc721DeploymentConfig.chainType)) +
      remove0x(erc721DeploymentConfig.salt) +
      remove0x(keccak256(erc721DeploymentConfig.byteCode)) +
      remove0x(keccak256(erc721DeploymentConfig.initCode)) +
      remove0x(signerAddress)) as Hex,
  )
}

export function storageSlot(input: Hex): string {
  return '0x' + remove0x((BigInt(keccak256(input)) - BigInt(1)).toString(16)).padStart(64, '0')
  //TODO: validate
  // return (
  //   '0x' +
  //   remove0x(web3.utils.toHex(web3.utils.toBN(web3.utils.keccak256(input)).sub(web3.utils.toBN(1)))).padStart(64, '0')
  // )
}
