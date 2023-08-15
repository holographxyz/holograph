declare var global: any;
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from '@holographxyz/hardhat-deploy-holographed/types';
import { NetworkType, networks } from '@holographxyz/networks';
import { SuperColdStorageSigner } from 'super-cold-storage-signer';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.ethers.getSigners();
  let deployer: SignerWithAddress | SuperColdStorageSigner = accounts[0];

  if (global.__superColdStorage) {
    // address, domain, authorization, ca
    const coldStorage = global.__superColdStorage;
    deployer = new SuperColdStorageSigner(
      coldStorage.address,
      'https://' + coldStorage.domain,
      coldStorage.authorization,
      deployer.provider,
      coldStorage.ca
    );
  }

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
