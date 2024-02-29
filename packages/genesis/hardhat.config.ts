declare var global: any;
import fs from 'fs';
import '@typechain/hardhat';
import '@holographxyz/hardhat-deploy-holographed';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import { types, task, HardhatUserConfig } from 'hardhat/config';
import '@holographxyz/hardhat-holograph-contract-builder';
import { BigNumber } from 'ethers';
import { Environment, getEnvironment } from '@holographxyz/environment';
import { NetworkType, Network, Networks, networks } from '@holographxyz/networks';
import { GasService } from './scripts/utils/gas-service';
import dotenv from 'dotenv';
dotenv.config();

function hex2buffer(input: string): Uint8Array {
  input = input.toLowerCase().trim();
  if (input.startsWith('0x')) {
    input = input.substring(2).trim();
  }
  if (input.length % 2 !== 0) {
    input = '0' + input;
  }
  let bytes: number[] = [];
  for (let i = 0; i < input.length; i += 2) {
    bytes.push(parseInt(input.substring(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
}

const currentEnvironment = Environment[getEnvironment()];
process.stdout.write(`\n👉 Environment: ${currentEnvironment}\n\n`);

const SOLIDITY_VERSION = process.env.SOLIDITY_VERSION || '0.8.17';

const MNEMONIC = process.env.MNEMONIC || 'test '.repeat(11) + 'junk';
const DEPLOYER = process.env.DEPLOYER || '0x0';

const setDeployerKey = function (fallbackKey: string | number): string | number {
  if (process.env.HARDWARE_WALLET_ENABLED == 'true' && process.env.HARDWARE_WALLET_DEPLOYER != undefined) {
    console.log(`Setting deployer key to ${process.env.HARDWARE_WALLET_DEPLOYER} as hardware wallet`);
    return `ledger://${process.env.HARDWARE_WALLET_DEPLOYER}`;
  }
  console.log(`Setting deployer key to ${fallbackKey} as fallback`);
  return fallbackKey;
};

if (process.env.FUNDS_TRANSFER && process.env.FUNDS_TRANSFER != '') {
  global.__transferFunds = process.env.FUNDS_TRANSFER;
}

const dynamicNetworks = function (): any {
  let output: any = {};
  for (const name of Object.keys(networks)) {
    if (name != 'hardhat' && name != 'localhost' && name != 'localhost2') {
      let envKey = name.replace(/([A-Z]{1})/g, '_$1').toUpperCase();
      output[name] = {
        url: process.env[envKey + '_RPC_URL'] || networks[name].rpc,
        chainId: networks[name].chain,
        accounts: [process.env[envKey + '_PRIVATE_KEY'] || DEPLOYER],
      };
    }
  }
  return output;
};

const DEPLOYMENT_SALT = parseInt(process.env.DEPLOYMENT_SALT || '0');
const DEPLOYMENT_PATH = process.env.DEPLOYMENT_PATH || 'deployments';

global.__DEPLOYMENT_SALT = '0x' + DEPLOYMENT_SALT.toString(16).padStart(64, '0');

// this task runs before the actual hardhat deploy task
task('deploy', 'Deploy contracts').setAction(async (args, hre, runSuper) => {
  // set gas parameters
  global.__gasLimitMultiplier = BigNumber.from(process.env.GAS_LIMIT_MULTIPLIER || '10000');
  global.__gasPriceMultiplier = BigNumber.from(process.env.GAS_PRICE_MULTIPLIER || '10000');
  global.__maxGasPrice = BigNumber.from(process.env.MAXIMUM_GAS_PRICE || '0');
  global.__maxGasBribe = BigNumber.from(process.env.MAXIMUM_GAS_BRIBE || '0');
  // NOTE: Gas price monitor service is disabled for now
  // Please look to utils/helpers.ts and search for "manual" to see how to adjust gas prices manually
  // Start gas price monitoring service
  // process.stdout.write('Loading Gas Price Service\n');
  // const gasService: GasService = new GasService(hre.network.name, hre.ethers.provider, 'DEBUG' in process.env);
  // process.stdout.write('Seeding Gas Price Service\n');
  // await gasService.init();
  // process.stdout.write('\nReady to start deployments\n');
  // run the actual hardhat deploy task
  return runSuper(args);
});

task('abi', 'Create standalone ABI files for all smart contracts')
  .addOptionalParam('silent', 'Provide less details in the output', false, types.boolean)
  .setAction(async (args, hre) => {
    if (!fs.existsSync('./artifacts')) {
      throw new Error('The directory "artifacts" was not found. Make sure you run "yarn compile" first.');
    }
    const recursiveDelete = function (dir: string) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (let i = 0, l = files.length; i < l; i++) {
        if (files[i].isDirectory()) {
          recursiveDelete(dir + '/' + files[i].name);
          fs.rmdirSync(dir + '/' + files[i].name);
        } else {
          fs.unlinkSync(dir + '/' + files[i].name);
        }
      }
    };
    const extractABIs = function (sourceDir: string, deployDir: string) {
      const files = fs.readdirSync(sourceDir, { withFileTypes: true });
      for (let i = 0, l = files.length; i < l; i++) {
        const file = files[i].name;
        if (files[i].isDirectory()) {
          extractABIs(sourceDir + '/' + file, deployDir);
        } else {
          if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
            if (!args.silent) {
              console.log(' -- exporting', file.split('.')[0], 'ABI');
            }
            const data = JSON.parse(fs.readFileSync(sourceDir + '/' + file, 'utf8')).abi;
            fs.writeFileSync(deployDir + '/' + file, JSON.stringify(data, undefined, 2));
          }
        }
      }
    };
    if (!fs.existsSync('./abi')) {
      fs.mkdirSync('./abi');
    }
    if (!fs.existsSync('./abi')) {
      fs.mkdirSync('./abi');
    } else {
      recursiveDelete('./abi');
    }
    extractABIs('./artifacts/contracts', './abi');
  });

/**
 * Go to https://hardhat.org/config/ to learn more
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  paths: {
    sources: 'contracts',
    cache: 'cache',
    deployments: DEPLOYMENT_PATH,
  },
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: networks.localhost.rpc,
      chainId: networks.localhost.chain,
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 11,
        passphrase: '',
      },
      companionNetworks: {
        // https://github.com/wighawag/hardhat-deploy#companionnetworks
        l2: 'localhost2',
      },
      saveDeployments: false,
    },
    localhost2: {
      url: networks.localhost2.rpc,
      chainId: networks.localhost2.chain,
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 11,
        passphrase: '',
      },
      companionNetworks: {
        // https://github.com/wighawag/hardhat-deploy#companionnetworks
        l2: 'localhost',
      },
      saveDeployments: false,
    },
    ...dynamicNetworks(),
  },
  namedAccounts: {
    deployer: setDeployerKey(process.env.DEPLOYER || 0),
  },
  solidity: {
    version: SOLIDITY_VERSION,
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
  mocha: {
    timeout: 1000 * 60 * 60,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || '',
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      bsc: process.env.BSCSCAN_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
      optimisticEthereum: process.env.OPTIMISTIC_API_KEY || process.env.OPTIMISM_API_KEY || '',
      optimisticSepolia: process.env.OPTIMISTIC_API_KEY || process.env.OPTIMISM_API_KEY || '',
      arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || '',
      arbitrumNova: process.env.ARBISCAN_NOVA_API_KEY || '',
      mantle: process.env.MANTLE_API_KEY || '',
      mantleTestnet: process.env.MANTLE_API_KEY || '',
      base: process.env.BASESCAN_API_KEY || '',
      baseTestnetSepolia: process.env.BASESCAN_API_KEY || '',
      zora: process.env.ZORAENERGY_API_KEY || '---', // Blank string doesn't work for Blockscout
      zoraTestnetSepolia: process.env.ZORAENERGY_API_KEY || '',
    },
    customChains: [
      {
        network: 'optimismTestnetSepolia',
        chainId: 11155420,
        urls: {
          apiURL: 'https://api-sepolia-optimistic.etherscan.io/api',
          browserURL: 'https://sepolia-optimism.etherscan.io/',
        },
      },
      {
        network: 'baseTestnetSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'zora',
        chainId: 7777777,
        urls: {
          apiURL: 'https://explorer.zora.energy/api',
          browserURL: 'https://explorer.zora.energy/',
        },
      },
      {
        network: 'zoraTestnetSepolia',
        chainId: 999999999,
        urls: {
          apiURL: 'https://sepolia.explorer.zora.energy/api',
          browserURL: 'https://explorer.zora.energy/',
        },
      },
      {
        network: 'arbitrumNova',
        chainId: 42170,
        urls: {
          apiURL: 'https://api-nova.arbiscan.io/api',
          browserURL: 'https://nova.arbiscan.io',
        },
      },
      {
        network: 'arbitrumTestnetSepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io',
        },
      },
      {
        network: 'mantle',
        chainId: 5000,
        urls: {
          apiURL: 'https://explorer.mantle.xyz/api',
          browserURL: 'https://explorer.mantle.xyz',
        },
      },
      {
        network: 'mantleTestnet',
        chainId: 5001,
        urls: {
          apiURL: 'https://explorer.testnet.mantle.xyz/api',
          browserURL: 'https://explorer.testnet.mantle.xyz',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'baseTestnetSepolia',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
  hardhatHolographContractBuilder: {
    runOnCompile: true,
    verbose: false,
  },
};

export default config;
