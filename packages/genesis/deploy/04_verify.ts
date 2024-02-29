declare var global: any;
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from '@holographxyz/hardhat-deploy-holographed/types';
import { NetworkType, networks } from '@holographxyz/networks';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import path from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Starting deploy script: ${path.basename(__filename)}`);
  const accounts = await hre.ethers.getSigners();
  let deployer: SignerWithAddress = accounts[0];

  const currentNetworkType: NetworkType = networks[hre.network.name].type;

  if (currentNetworkType != NetworkType.local) {
    let contracts: string[] = ['HolographGenesis'];
    for (let i: number = 0, l: number = contracts.length; i < l; i++) {
      let contract: string = contracts[i];
      try {
        await hre.run('verify:verify', {
          address: (await hre.ethers.getContract(contract)).address,
          constructorArguments: [],
        });
      } catch (error) {
        hre.deployments.log(`Failed to verify ""${contract}" -> ${error}`);
      }
    }
  } else {
    hre.deployments.log('Not verifying contracts on localhost networks.');
  }
};
export default func;
func.tags = ['Verify'];
func.dependencies = [];
