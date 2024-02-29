declare var global: any;
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { NetworkKeys, networks } from '@holographxyz/networks';
import { Block, BlockWithTransactions, TransactionResponse } from '@ethersproject/abstract-provider';
import { WebSocketProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { GasPricing, initializeGasPricing, updateGasPricing } from './gas';

const ZERO = BigNumber.from('0');
const TWO = BigNumber.from('2');

export type BlockParams = {
  network: string;
  blockNumber: number;
  tags?: (string | number)[];
  attempts?: number;
  canFail?: boolean;
  interval?: number;
};

export class GasService {
  network!: string;
  gasPrice!: GasPricing;
  provider!: JsonRpcProvider | WebSocketProvider | Web3Provider;
  ready: boolean = false;
  lastBlockNumber: number = 0;
  verbose: boolean = false;

  constructor(network: string, provider: JsonRpcProvider | WebSocketProvider | Web3Provider, verbose: boolean = false) {
    this.network = network;
    this.provider = provider;
    this.verbose = verbose;
  }

  structuredLog(network: string, msg: string, tags: undefined | string | (string | number)[]): void {
    if (this.verbose) {
      process.stdout.write(`${JSON.stringify({ network, msg, tags })}\n`);
    }
  }

  wait = async (seconds: number): Promise<void> => {
    process.stdout.write('.');
    return new Promise<void>(async (resolve, reject) => {
      setTimeout(resolve, seconds * 1000);
    });
  };

  async init(): Promise<void> {
    this.gasPrice = await initializeGasPricing(this.network, this.provider);
    global.__gasPrice = this.gasPrice;
    global.__gasService = this;
    this.provider.on('block', async (blockNumber: string) => {
      const block = Number.parseInt(blockNumber, 10);
      this.structuredLog(this.network, `New block mined ${block}`, undefined);
      await this.processBlock(this.network, block);
      global.__gasPrice = this.gasPrice;
      if (this.lastBlockNumber != 0) {
        this.ready = true;
      }
      this.lastBlockNumber = block;
    });
    /*
    if (this.network == 'localhost' || this.network == 'localhost2') {
      this.ready = true;
    }
    while (!this.ready) {
      await this.wait(1);
    }
*/
  }

  extractGasData(network: string, block: Block | BlockWithTransactions, tx: TransactionResponse): void {
    if (this.gasPrice.isEip1559) {
      // set current tx priority fee
      let priorityFee: BigNumber = ZERO;
      let remainder: BigNumber;
      if (tx.maxFeePerGas === undefined || tx.maxPriorityFeePerGas === undefined) {
        // we have a legacy transaction here, so need to calculate priority fee out
        priorityFee = tx.gasPrice!.sub(block.baseFeePerGas!);
      } else {
        // we have EIP-1559 transaction here, get priority fee
        // check first that base block fee is less than maxFeePerGas
        remainder = tx.maxFeePerGas!.sub(block.baseFeePerGas!);
        priorityFee = remainder.gt(tx.maxPriorityFeePerGas!) ? tx.maxPriorityFeePerGas! : remainder;
      }

      if (this.gasPrice.nextPriorityFee === null) {
        this.gasPrice.nextPriorityFee = priorityFee;
      } else {
        this.gasPrice.nextPriorityFee = this.gasPrice.nextPriorityFee!.add(priorityFee).div(TWO);
      }
      if (this.gasPrice.nextPriorityFee.lt(ZERO)) {
        this.gasPrice.nextPriorityFee = ZERO;
      }
    }
    // for legacy networks (non EIP-1559), get average rolling gasPrice
    // it's important to skip this calculation if gas price is 0, which happens in some instances like on BSC
    // we check first that gasPrice variable is actually set, and we check that it is greater than zero
    else if (tx.gasPrice !== undefined && tx.gasPrice !== null && tx.gasPrice!.gt(ZERO)) {
      // if current network gas pricing is null, then this means it's the first time that gas price data is being set
      if (this.gasPrice.gasPrice === null) {
        this.gasPrice.gasPrice = tx.gasPrice!;
      }
      // otherwise we already have gas price data set, we just add new value to it and divide by two to get the floating average
      else {
        this.gasPrice.gasPrice = this.gasPrice.gasPrice!.add(tx.gasPrice!).div(TWO);
      }
    }
    if (network === networks['localhost' as NetworkKeys].key || network === networks['localhost2' as NetworkKeys].key) {
      this.gasPrice.nextBlockFee = ZERO;
      this.gasPrice.maxFeePerGas = ZERO;
      this.gasPrice.nextPriorityFee = ZERO;
      this.gasPrice.gasPrice = ZERO;
    }
  }

  async getBlockWithTransactions({
    blockNumber,
    network,
    tags = [] as (string | number)[],
    attempts = 10,
    canFail = false,
    interval = 5000,
  }: BlockParams): Promise<BlockWithTransactions | null> {
    return new Promise<BlockWithTransactions | null>((topResolve, _topReject) => {
      let counter = 0;
      let sent = false;
      let blockInterval: NodeJS.Timeout | null = null;
      const getBlock = async (): Promise<void> => {
        try {
          const block: BlockWithTransactions | null = await this.provider.getBlockWithTransactions(blockNumber);
          if (block === null) {
            counter++;
            if (canFail && counter > attempts) {
              if (blockInterval) clearInterval(blockInterval);
              if (!sent) {
                sent = true;
                topResolve(null);
              }
            }
          } else {
            if (blockInterval) clearInterval(blockInterval);
            if (!sent) {
              sent = true;
              topResolve(block as BlockWithTransactions);
            }
          }
        } catch (error: any) {
          if (error.message !== 'cannot query unfinalized data') {
            counter++;
            if (canFail && counter > attempts) {
              this.structuredLog(network, `Failed retrieving block ${blockNumber}`, tags);
              if (blockInterval) clearInterval(blockInterval);
              if (!sent) {
                sent = true;
                _topReject(error);
              }
            }
          }
        }
      };

      blockInterval = setInterval(getBlock, interval);
      getBlock();
    });
  }

  async processBlock(network: string, blockNumber: number): Promise<void> {
    const block: BlockWithTransactions | null = await this.getBlockWithTransactions({
      network: network,
      blockNumber,
      attempts: 10,
      canFail: false,
    });
    if (block !== undefined && block !== null && 'transactions' in block) {
      this.structuredLog(network, `Block retrieved`, blockNumber);
      this.structuredLog(network, `Calculating block gas`, blockNumber);
      if (this.gasPrice.isEip1559) {
        this.structuredLog(
          network,
          `Calculated block gas price was ${formatUnits(
            this.gasPrice.nextBlockFee!,
            'gwei'
          )} GWEI, and actual block gas price is ${formatUnits(block.baseFeePerGas!, 'gwei')} GWEI`,
          blockNumber
        );
      }

      this.gasPrice = updateGasPricing(network, block, this.gasPrice);

      const priorityFees: BigNumber = this.gasPrice.nextPriorityFee!;
      if (block.transactions.length === 0) {
        this.structuredLog(network, `Zero transactions in block`, blockNumber);
      }
      for (let i = 0, l = block.transactions.length; i < l; i++) {
        this.extractGasData(network, block, block.transactions[i]);
      }
      this.gasPrice = updateGasPricing(network, block, this.gasPrice);
      if (this.gasPrice.isEip1559 && priorityFees !== null) {
        this.structuredLog(
          network,
          `Calculated block priority fees was ${formatUnits(
            priorityFees,
            'gwei'
          )} GWEI, and actual block priority fees is ${formatUnits(this.gasPrice.nextPriorityFee!, 'gwei')} GWEI`,
          blockNumber
        );
      }
    } else {
      this.structuredLog(network, 'Dropped block', blockNumber);
    }
  }
}
