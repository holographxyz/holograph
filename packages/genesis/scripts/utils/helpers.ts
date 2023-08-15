declare var global: any;
import Web3 from 'web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { BigNumberish, Contract, BigNumber } from 'ethers';
import { BytesLike, isBytesLike } from '@ethersproject/bytes';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { UnsignedTransaction } from '@ethersproject/transactions';
import { SuperColdStorageSigner } from 'super-cold-storage-signer';
import { GasService } from './gas-service';
import { GasPricing } from './gas';

const web3 = new Web3();

const generateInitCode = function (vars: string[], vals: any[]): string {
  return web3.eth.abi.encodeParameters(vars, vals);
};

const zeroAddress: string = '0x' + '00'.repeat(20);

const getGasLimit = async function (
  hre: HardhatRuntimeEnvironment,
  from: string | SignerWithAddress | SuperColdStorageSigner,
  to: string,
  data: Promise<UnsignedTransaction> | BytesLike = '',
  value: BigNumberish = 0
): Promise<BigNumber> {
  if (typeof from !== 'string') {
    from = (from as SignerWithAddress).address;
  }
  if (isBytesLike(data) === false) {
    data = (await data).data;
  }
  const gasLimit = BigNumber.from(
    await hre.ethers.provider.estimateGas({
      from: from as string,
      to,
      data: data as BytesLike,
      value,
    })
  );
  if ('__gasLimitMultiplier' in global) {
    return gasLimit.mul(global.__gasLimitMultiplier).div(BigNumber.from('10000'));
  } else {
    return gasLimit;
  }
};

type GasParams = {
  gasPrice: BigNumber | null;
  type: number;
  maxPriorityFeePerGas: BigNumber | null;
  maxFeePerGas: BigNumber | null;
};

type TransactionParams = {
  hre: HardhatRuntimeEnvironment;
  from: string | SignerWithAddress | SuperColdStorageSigner;
  to: string | Contract;
  data?: Promise<UnsignedTransaction> | BytesLike;
  value?: BigNumberish;
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  nonce?: number;
};

type TransactionParamsOutput = {
  from: string;
  value: BigNumberish;
  gasLimit: BigNumberish | null;
  nonce: number;
} & GasParams;

const getGasPrice = async function (customGasPrice?: BigNumber): Promise<GasParams> {
  if (customGasPrice) {
    return {
      gasPrice: customGasPrice,
      type: 0,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    };
  }
  if ('__gasPrice' in global) {
    const gasPricing: GasPricing = global.__gasPrice as GasPricing;
    const gasService: GasService = global.__gasService as GasService;
    let gasPrice: BigNumber = gasPricing.gasPrice!.mul(global.__gasPriceMultiplier).div(BigNumber.from('10000'));
    let bribe: BigNumber = gasPricing.isEip1559 ? gasPrice.sub(gasPricing.nextBlockFee!) : BigNumber.from('0');
    // loop and wait until gas price stabilizes
    while (gasPrice.gt(global.__maxGasPrice) || bribe.gt(global.__maxGasBribe)) {
      await gasService.wait(1);
      gasPrice = gasPricing.gasPrice!.mul(global.__gasPriceMultiplier).div(BigNumber.from('10000'));
      bribe = gasPricing.isEip1559 ? gasPrice.sub(gasPricing.nextBlockFee!) : BigNumber.from('0');
    }

    if (gasPricing.isEip1559) {
      return {
        gasPrice: null,
        type: 2,
        //maxPriorityFeePerGas: gasPrice.sub(gasPricing.nextBlockFee!),
        maxPriorityFeePerGas: gasPrice,
        maxFeePerGas: gasPrice,
      };
    } else {
      return {
        gasPrice,
        type: 0,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      };
    }
  } else {
    return {
      gasPrice: BigNumber.from('0'),
      type: 0,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    };
  }
};

const txParams = async function ({
  hre,
  from,
  to,
  data = null,
  value = 0,
  gasLimit,
  nonce,
  gasPrice = undefined,
}: TransactionParams): Promise<TransactionParamsOutput> {
  if (typeof from !== 'string') {
    from = (from as SignerWithAddress).address;
  }
  if (nonce === undefined && !('__txNonce' in global)) {
    global.__txNonce = {} as { [key: string]: number };
  }
  if (nonce === undefined && !(hre.network.name in global.__txNonce)) {
    global.__txNonce[hre.network.name] = await hre.ethers.provider.getTransactionCount(from as string);
  }
  if (typeof to !== 'string') {
    to = (to as Contract).address;
  }
  let output: TransactionParamsOutput = {
    from: from as string,
    value: BigNumber.from(value),
    gasLimit: gasLimit
      ? '__gasLimitMultiplier' in global
        ? gasLimit.mul(global.__gasLimitMultiplier).div(BigNumber.from('10000'))
        : gasLimit
      : await getGasLimit(hre, from as string, to as string, data, BigNumber.from(value)),
    ...(await getGasPrice(gasPrice)),
    nonce: nonce === undefined ? global.__txNonce[hre.network.name] : nonce,
  };
  if (nonce === undefined) {
    global.__txNonce[hre.network.name] += 1;
  }
  return output;
};

const remove0x = function (input: string): string {
  if (input.startsWith('0x')) {
    return input.substring(2);
  } else {
    return input;
  }
};

export {
  getGasLimit,
  GasParams,
  TransactionParams,
  TransactionParamsOutput,
  getGasPrice,
  txParams,
  generateInitCode,
  zeroAddress,
  remove0x,
};
