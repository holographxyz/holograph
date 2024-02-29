declare var global: any;
import Web3 from 'web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { BigNumberish, Contract, BigNumber } from 'ethers';
import { BytesLike, isBytesLike } from '@ethersproject/bytes';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { UnsignedTransaction } from '@ethersproject/transactions';
import { GasService } from './gas-service';
import { GasPricing } from './gas';
import { getNamedAccounts } from 'hardhat';
import { LedgerSigner } from '@anders-t/ethers-ledger';

const web3 = new Web3();

/**
 * Logs a message to the console if the DEBUG environment variable is set to true.
 * @param message - The message to log.
 * @returns void
 */
function logDebug(message: string): void {
  if (process.env.DEBUG === 'true') {
    console.log(message);
  }
}

/**
 * Retrieves the deployer and signer for use in deployment scripts.
 * The deployer is used for deploying contracts, while the signer is
 * used for sending transactions that are not deployments.
 *
 * When HARDWARE_WALLET_ENABLED is true, the deployer is a SignerWithAddress
 * and the signer is a LedgerSigner. This allows for deployments from a
 * standard account and transaction signing via a hardware wallet.
 *
 * When HARDWARE_WALLET_ENABLED is false, both deployer and signer
 * are the same standard account.
 *
 * @param hre - The Hardhat Runtime Environment.
 * @returns An object containing both the deployer and signer.
 */
export async function getDeployer(
  hre: HardhatRuntimeEnvironment
): Promise<{ deployer: SignerWithAddress; signer: SignerWithAddress | LedgerSigner }> {
  logDebug('Starting getDeployer function');

  const hardwareWalletEnabled = process.env.HARDWARE_WALLET_ENABLED === 'true';
  logDebug(`Hardware Wallet Enabled: ${hardwareWalletEnabled}`);

  if (hardwareWalletEnabled) {
    let { deployer } = await getNamedAccounts();
    logDebug(`Deployer (named account): ${deployer}`);

    if (!global.ledgerSigner) {
      logDebug('Initializing LedgerSigner');
      // Initialize and store the LedgerSigner globally if it doesn't exist
      const provider = hre.ethers.provider;
      global.ledgerSigner = new LedgerSigner(provider);
      logDebug('LedgerSigner initialized and stored globally');
    } else {
      logDebug('LedgerSigner already initialized');
    }

    // Create a dummy JsonRpcSigner
    const provider = hre.ethers.provider;
    logDebug('Provider obtained from Hardhat runtime environment');

    // Wrap the dummy signer in SignerWithAddress
    const dummySigner = provider.getSigner(deployer);
    const signerWithAddress = await SignerWithAddress.create(dummySigner);
    logDebug(`Signer with address created: ${signerWithAddress.address}`);

    // Use the global ledgerSigner
    const ledgerSigner = global.ledgerSigner;
    logDebug('Using global LedgerSigner');

    return { deployer: signerWithAddress, signer: ledgerSigner };
  } else {
    logDebug('Hardware wallet not enabled, getting signers from Hardhat environment');
    const accounts = await hre.ethers.getSigners();
    let deployer = accounts[0];
    logDebug(`Deployer (first signer): ${deployer.address}`);

    return { deployer: deployer, signer: deployer };
  }
}

const generateInitCode = function (vars: string[], vals: any[]): string {
  return web3.eth.abi.encodeParameters(vars, vals);
};

const zeroAddress: string = '0x' + '00'.repeat(20);

const getGasLimit = async function (
  hre: HardhatRuntimeEnvironment,
  from: string | SignerWithAddress,
  to: string,
  data: Promise<UnsignedTransaction> | BytesLike = '',
  value: BigNumberish = 0,
  skipError: bool = false
): Promise<BigNumber> {
  if (typeof from !== 'string') {
    from = (from as SignerWithAddress).address;
  }
  if (isBytesLike(data) === false) {
    data = (await data).data;
  }
  let gasLimit: BigNumber = BigNumber.from('0');
  try {
    gasLimit = BigNumber.from(
      await hre.ethers.provider.estimateGas({
        from: from as string,
        to,
        data: data as BytesLike,
        value,
      })
    );
  } catch (ex: any) {
    if (!skipError) {
      throw ex as unknown as Error;
    }
  }
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
  from: string | SignerWithAddress;
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

const getGasPrice = async function (): Promise<GasParams> {
  if ('__gasPrice' in global) {
    const gasPricing: GasPricing = global.__gasPrice as GasPricing;
    const gasService: GasService = global.__gasService as GasService;
    let gasPrice: BigNumber = gasPricing.gasPrice!.mul(global.__gasPriceMultiplier).div(BigNumber.from('10000'));
    let bribe: BigNumber = gasPricing.isEip1559 ? gasPrice.sub(gasPricing.nextBlockFee!) : BigNumber.from('0');
    // loop and wait until gas price stabilizes

    // TODO: Disabled for now because it is causing the tx to never go through
    while (gasPrice.gt(global.__maxGasPrice) || bribe.gt(global.__maxGasBribe)) {
      await gasService.wait(1);
      // gasPrice = gasPricing.gasPrice!.mul(global.__gasPriceMultiplier).div(BigNumber.from('10000'));
      // bribe = gasPricing.isEip1559 ? gasPrice.sub(gasPricing.nextBlockFee!) : BigNumber.from('0');
    }

    if (gasPricing.isEip1559) {
      return {
        gasPrice: null,
        type: 2,
        // maxPriorityFeePerGas: gasPrice.sub(gasPricing.nextBlockFee!),
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
      gasPrice: BigNumber.from('1' + '000000000'), // This can be updated to manually set the gas price. It's in gwei before the + and 9 0's
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
}: TransactionParams): Promise<TransactionParamsOutput> {
  if (typeof from !== 'string') {
    from = (from as SignerWithAddress).address;
  }
  if (nonce === undefined && !('__txNonce' in global)) {
    global.__txNonce = {} as { [key: string]: number };
  }
  if (nonce === undefined && !(hre.networkName in global.__txNonce)) {
    global.__txNonce[hre.networkName] = await hre.ethers.provider.getTransactionCount(from as string);
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
      : await getGasLimit(hre, from as string, to as string, data, BigNumber.from(value), true),
    ...(await getGasPrice()),
    nonce: nonce === undefined ? global.__txNonce[hre.networkName] : nonce,
  };
  if (nonce === undefined) {
    global.__txNonce[hre.networkName] += 1;
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
