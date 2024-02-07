declare var global: any;
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, Deployment } from '@holographxyz/hardhat-deploy-holographed/types';
import { networks } from '@holographxyz/networks';
import { getDeployer, txParams } from '../scripts/utils/helpers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getNamedAccounts, ethers } from 'hardhat';
import path from 'path';
import { Contract } from 'ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Starting deploy script: ${path.basename(__filename)}`);
  const deployer = await getDeployer(hre);
  const deployerAddress = await deployer.deployer.getAddress();
  console.log(`Deployer: ${deployerAddress}`);

  let getSignedRawTx = async (): Promise<string> => {
    let txRequest: TransactionRequest = {
      to: null,
      from: deployerAddress,
      nonce: 0,
      gasLimit: 1000000,
      gasPrice: 0,
      data: (await hre.ethers.getContractFactory('HolographGenesis')).getDeployTransaction().data,
      value: 0,
      chainId: networks[hre.network.name].chain,
    } as unknown as TransactionRequest;
    txRequest = await deployer.deployer.populateTransaction(txRequest);
    let sig = await deployer.deployer.signTransaction(txRequest);
    process.stdout.write('\n\n' + JSON.stringify(sig, undefined, 2) + '\n\n');
    await hre.ethers.provider.sendTransaction(sig);
    process.exit();
    return sig as string;
  };

  let holographGenesisContract: Contract | null = await hre.ethers.getContractOrNull('HolographGenesis');
  let holographGenesisDeployment: Deployment | null = null;
  if (holographGenesisContract == null) {
    console.log(`HolographGenesis contract not found`);
    try {
      holographGenesisDeployment = await hre.deployments.get('HolographGenesis');
    } catch (ex: any) {
      console.log(`HolographGenesis deployment not found: ${ex.message}`);
    }
  }
  if (holographGenesisContract != null) {
    console.log(`HolographGenesis contract found at ${holographGenesisContract.address}`);
    let deployedCode: string = await hre.ethers.provider.send('eth_getCode', [
      holographGenesisContract.address,
      'latest',
    ]);
  }
  if (holographGenesisContract == null && holographGenesisDeployment == null) {
    console.log(`Deploying HolographGenesis contract`);
    let holographGenesis = await hre.deployments.deploy('HolographGenesis', {
      ...(await txParams({
        hre,
        from: deployerAddress,
        to: '0x0000000000000000000000000000000000000000',
        nonce: 0,
        gasLimit: await hre.ethers.provider.estimateGas(
          (await hre.ethers.getContractFactory('HolographGenesis')).getDeployTransaction()
        ),
      })),
      args: [],
      log: true,
      waitConfirmations: 1,
    } as any);
  }
  console.log(`Exiting script: ${__filename} ✅\n`);
};

export default func;
func.tags = ['HolographGenesis'];
func.dependencies = [];
