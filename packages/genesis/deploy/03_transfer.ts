declare var global: any;
import { BigNumber, Contract } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { formatUnits } from '@ethersproject/units';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, Deployment } from '@holographxyz/hardhat-deploy-holographed/types';
import { networks } from '@holographxyz/networks';
import { txParams } from '../scripts/utils/helpers';
import { SuperColdStorageSigner } from 'super-cold-storage-signer';
import { NetworkType, networks } from '@holographxyz/networks';
import { GasParams, getGasPrice } from '../scripts/utils/helpers';

function getTransferGasLimit(network: string): BigNumber {
  if (network === networks['bobaAvalancheTestnet' as NetworkKeys].key) {
    return BigNumber.from('1048317');
  } else if (network === networks['bobaFantomTestnet' as NetworkKeys].key) {
    return BigNumber.from('1050157');
  } else if (network === networks['bobaBinanceChainTestnet' as NetworkKeys].key) {
    return BigNumber.from('83301');
  } else if (network === networks['bobaMoonbeamTestnet' as NetworkKeys].key) {
    return BigNumber.from('612384');
  } else if (network === networks['bobaEthereumTestnetGoerli' as NetworkKeys].key) {
    return BigNumber.from('26757');
  } else if (network === networks['arbitrumOne' as NetworkKeys].key) {
    return BigNumber.from('600000');
  }
  return BigNumber.from('21000');
}

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

  if ('__transferFunds' in global && global.__transferFunds != '') {
    // need to transfer funds
    const gasLimit: BigNumber = getTransferGasLimit(hre.network.name);
    let recipient: string = global.__transferFunds;
    let balance: BigNumber = await hre.ethers.provider.getBalance(deployer.address, 'latest');
    //    // arbitrumOne
    //    balance = balance.sub(BigNumber.from('10000000'));
    //    // optimism
    //    balance = balance.sub(BigNumber.from('50000000000000'));
    //    // mantle
    //    balance = balance.sub(BigNumber.from('3204').mul(BigNumber.from('40000000000000')));
    //    // zora
    //    balance = balance.sub(BigNumber.from('2044').mul(BigNumber.from('25000000000')));
    //    // base
    //    balance = balance.sub(BigNumber.from('40000000000000'));
    hre.deployments.log(`Available balance ${formatUnits(balance, 'ether')}`);
    let txRequest: TransactionRequest = {
      to: recipient,
      from: deployer.address,
      nonce: await hre.ethers.provider.getTransactionCount(deployer.address, 'latest'),
      gasLimit,
      data: '',
      ...(await getGasPrice()),
    } as TransactionRequest;
    let gasAmount: BigNumber;
    if (txRequest.type == 2) {
      gasAmount = txRequest.maxFeePerGas;
    } else {
      gasAmount = txRequest.gasPrice;
    }
    gasAmount = gasAmount.mul(gasLimit);
    txRequest.value = balance.sub(gasAmount);
    //hre.deployments.log(`Transaction Request: ${JSON.stringify(txRequest, undefined, 2)}`);
    if (txRequest.value.gt(BigNumber.from('0'))) {
      const tx = await deployer.sendTransaction(txRequest);
      hre.deployments.log(`Transferring ${formatUnits(txRequest.value, 'ether')} to ${recipient}: ${tx.hash}`);
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        hre.deployments.log(`Funds sent successfully!`);
      } else {
        hre.deployments.log(`Failed sending funds!`);
      }
    } else {
      hre.deployments.log(`Not enough funds to send after gas costs!`);
    }
  }
};

export default func;
func.tags = ['TransferFunds'];
func.dependencies = [];
