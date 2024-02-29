declare var global: any;
import { Contract } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, Deployment } from '@holographxyz/hardhat-deploy-holographed/types';
import { getDeployer, txParams, zeroAddress } from '../scripts/utils/helpers';
import { NetworkType, networks } from '@holographxyz/networks';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import path from 'path';

// TODO: Approve a testnet deployer for the develop environment
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // console.log(`Starting deploy script: ${path.basename(__filename)}`);
  // const deployer = await getDeployer(hre);
  // const deployerAddress = await deployer.signer.getAddress();
  // let holographGenesis: Contract = await hre.ethers.getContract('HolographGenesis', deployer.signer);
  // let getSignedRawTx = async (approveDeployer: string, nonce: number): Promise<string> => {
  //   let txRequest: TransactionRequest = {
  //     to: holographGenesis.address,
  //     from: deployerAddress,
  //     nonce,
  //     gasLimit: 100000,
  //     gasPrice: 0,
  //     data: (await holographGenesis.populateTransaction.approveDeployer(approveDeployer, true)).data,
  //     value: 0,
  //     chainId: networks[hre.network.name].chain,
  //   } as TransactionRequest;
  //   txRequest = await deployer.signer.populateTransaction(txRequest);
  //   let sig = await deployer.signer.signTransaction(txRequest);
  //   process.stdout.write('\n\n' + JSON.stringify(sig, undefined, 2) + '\n\n');
  //   await hre.ethers.provider.sendTransaction(sig);
  //   process.exit();
  //   return sig as string;
  // };
  // console.log(`Currently on ${process.env.HOLOGRAPH_ENVIRONMENT} enviroment`);
  // if (hre.network.name == networks.localhost.key) {
  //   // await getSignedRawTx('0x05439df4fde744533f006815d79418c8f9c18c24', 1);
  //   // enable 0x05439df4fde744533f006815d79418c8f9c18c24 on localhost
  //   await hre.ethers.provider.sendTransaction(
  //     [
  //       '0x',
  //       'f8a70180830186a0940c8af56f7650a6e3685188d212044338c21d3f7380b844',
  //       'a07d731600000000000000000000000005439df4fde744533f006815d79418c8',
  //       'f9c18c2400000000000000000000000000000000000000000000000000000000',
  //       '00000001820a98a0b368d7739967c121cba8f37dfe889d8abc92c00fc9911266',
  //       '2a3a317965b37ecca07a4339634975930a18521ffe3d2eb2913cd9bb08858c72',
  //       'a558d9df7429a937c8',
  //     ].join('')
  //   );
  //   // await getSignedRawTx('0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d', 2);
  //   // enable 0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d on localhost
  //   await hre.ethers.provider.sendTransaction(
  //     [
  //       '0x',
  //       'f8a70280830186a0940c8af56f7650a6e3685188d212044338c21d3f7380b844',
  //       'a07d731600000000000000000000000021Ab3Aa7053A3615E02d4aC517B7075b',
  //       '45BF524f00000000000000000000000000000000000000000000000000000000',
  //       '00000001820a98a0f0e433a1a287674ce73e27843cd73dd4ee59e862bf675a51',
  //       '381a4172796ee98aa03382f39928b8be21ce8e2583428d5b920e83936c3255c5',
  //       'a77910b91fe796f0d8',
  //     ].join('')
  //   );
  //   // await getSignedRawTx('0xd078E391cBAEAa6C5785124a7207ff57d64604b7', 3);
  //   // enable 0xd078E391cBAEAa6C5785124a7207ff57d64604b7 on localhost
  //   await hre.ethers.provider.sendTransaction(
  //     [
  //       '0x',
  //       'f8a70380830186a0940c8af56f7650a6e3685188d212044338c21d3f7380b844',
  //       'a07d7316000000000000000000000000d078e391cbaeaa6c5785124a7207ff57',
  //       'd64604b700000000000000000000000000000000000000000000000000000000',
  //       '00000001820a98a0ee563a7a4ea3c8cc81250c00dfc839bfe76c41e42e6c7f9c',
  //       'dda08f5556d21103a05b0c66a1c57fcd151abd3955b74cb8835d5ac2fd054584',
  //       '3e6c78d663e7d60f63',
  //     ].join('')
  //   );
  // } else if (hre.network.name == networks.localhost2.key) {
  //   // await getSignedRawTx('0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1', 1);
  //   // enable 0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1 on localhost2
  //   await hre.ethers.provider.sendTransaction(
  //     [
  //       '0x',
  //       'f8a70180830186a0940c8af56f7650a6e3685188d212044338c21d3f7380b844',
  //       'a07d7316000000000000000000000000BB566182f35B9E5Ae04dB02a5450CC15',
  //       '6d2f89c100000000000000000000000000000000000000000000000000000000',
  //       '00000001820a9aa0fdad2831e1ead5069c2c6e28e62afe0b1d563bc4242312bb',
  //       '555b0388003f89d8a01aa43771970f8bc0bf421a3bbbe76f43df751844cad394',
  //       'e80a8eb2d8b7cf1acc',
  //     ].join('')
  //   );
  //   // await getSignedRawTx('0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d', 2);
  //   // enable 0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d on localhost2
  //   await hre.ethers.provider.sendTransaction(
  //     [
  //       '0x',
  //       'f8a70280830186a0940c8af56f7650a6e3685188d212044338c21d3f7380b844',
  //       'a07d731600000000000000000000000021Ab3Aa7053A3615E02d4aC517B7075b',
  //       '45BF524f00000000000000000000000000000000000000000000000000000000',
  //       '00000001820a99a0da75a4092b76b4061ddaad5166e0630fe20881abadc46496',
  //       'c614d9a9bc6f40c7a0056fcda9c2608868b7aee809f24f017077a974000ea8fb',
  //       '002ccb3e8cf98d4749',
  //     ].join('')
  //   );
  // } else {
  //   if (!(await holographGenesis.isApprovedDeployer('0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1'))) {
  //     console.log(
  //       `Network type is ${
  //         networks[hre.network.name].type
  //       }. Approving deployer 0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1 on ${process.env.HOLOGRAPH_ENVIRONMENT} at ${
  //         hre.network.name
  //       }`
  //     );
  //     let tx = await holographGenesis.approveDeployer('0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1', true, {
  //       ...(await txParams({
  //         hre,
  //         from: deployerAddress,
  //         to: holographGenesis,
  //         data: holographGenesis.populateTransaction.approveDeployer(
  //           '0xBB566182f35B9E5Ae04dB02a5450CC156d2f89c1',
  //           true
  //         ),
  //       })),
  //     });
  //     let receipt = await tx.wait();
  //   }
  //   if (networks[hre.network.name].type == NetworkType.testnet) {
  //     if (!(await holographGenesis.isApprovedDeployer(zeroAddress))) {
  //       console.log(
  //         `Network type is testnet. Approving deployer 0x2b553be1bC6a8DaA751DFB71Ff6558482cF49698 on ${process.env.HOLOGRAPH_ENVIRONMENT} at ${hre.network.name}`
  //       );
  //       let tx = await holographGenesis.approveDeployer('0x2b553be1bC6a8DaA751DFB71Ff6558482cF49698', true, {
  //         ...(await txParams({
  //           hre,
  //           from: deployerAddress,
  //           to: holographGenesis,
  //           data: holographGenesis.populateTransaction.approveDeployer(
  //             '0x2b553be1bC6a8DaA751DFB71Ff6558482cF49698',
  //             true
  //           ),
  //         })),
  //       });
  //       let receipt = await tx.wait();
  //     }
  //   }
  // }
};

export default func;
func.tags = ['GenesisDeployers'];
func.dependencies = ['HolographGenesis'];
