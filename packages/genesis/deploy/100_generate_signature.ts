declare var global: any;
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from '@holographxyz/hardhat-deploy-holographed/types';
import { getDeployer } from '../scripts/utils/helpers';
import { ethers } from 'hardhat';
import path from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Starting deploy script: ${path.basename(__filename)} 👇`);
  const deployer = await getDeployer(hre);
  const deployerAddress = await deployer.signer.getAddress();
  console.log(`Deployer address: ${deployerAddress}`);
  const nonce = parseInt(process.env.DEPLOYER_APPROVAL_NONCE as string, 10); // This should be the next nonce expected by the contract
  if (!nonce) {
    throw new Error(`Nonce is required`);
  }
  console.log(`Nonce: ${nonce}`);
  const newDeployer = ''; // The address to approve or disapprove
  const approve = true; // true to approve, false to disapprove
  console.log(`Generating signature to approve ${newDeployer} with nonce ${nonce} and approval ${approve}...`);
  // Generate the message hash (solidityKeccack256 is the function that is compatible with solidity's keccak256(abi.encodePacked(a, b, c));
  const messageHash = ethers.utils.solidityKeccak256(['uint256', 'address', 'bool'], [nonce, newDeployer, approve]);
  console.log(`Message hash: ${messageHash}`);
  console.log(`Ready to sign message hash with deployer address ${deployerAddress}...`);
  // Sign the message hash directly (signMessage implicity inlcudes the prefix "\x19Ethereum Signed Message:\n32")
  const signature = await deployer.signer.signMessage(ethers.utils.arrayify(messageHash));
  console.log('Signature:', signature);
  console.log(`Exiting script: ${__filename} ✅\n`);
};

export default func;
func.tags = ['GenerateSignature'];
func.dependencies = [];
