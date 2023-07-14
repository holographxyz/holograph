/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  OVM_GasPriceOracle,
  OVM_GasPriceOracleInterface,
} from "../../module/OVM_GasPriceOracle";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "DecimalsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "GasPriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "L1BaseFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "OverheadUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ScalarUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "adminCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gasPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdmin",
    outputs: [
      {
        internalType: "address",
        name: "adminAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "getL1Fee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "getL1GasUsed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "initPayload",
        type: "bytes",
      },
    ],
    name: "init",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "l1BaseFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "overhead",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "scalar",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "adminAddress",
        type: "address",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_decimals",
        type: "uint256",
      },
    ],
    name: "setDecimals",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gasPrice",
        type: "uint256",
      },
    ],
    name: "setGasPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_baseFee",
        type: "uint256",
      },
    ],
    name: "setL1BaseFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_overhead",
        type: "uint256",
      },
    ],
    name: "setOverhead",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_scalar",
        type: "uint256",
      },
    ],
    name: "setScalar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506110ac806100206000396000f3fe60806040526004361061010e5760003560e01c8063704b6c02116100a5578063bf64a82d11610074578063f45e65d811610059578063f45e65d814610323578063f851a44014610339578063fe173b971461034e57600080fd5b8063bf64a82d146102f0578063de26c4a11461030357600080fd5b8063704b6c02146102705780638c8885c814610290578063bede39b5146102b0578063bf1fe420146102d057600080fd5b80634ddf47d4116100e15780634ddf47d414610194578063519b4bd3146101e55780636e9960c3146101fb578063704655971461025057600080fd5b80630c18c16214610113578063313ce5671461013c5780633577afc51461015257806349948e0e14610174575b600080fd5b34801561011f57600080fd5b5061012960025481565b6040519081526020015b60405180910390f35b34801561014857600080fd5b5061012960045481565b34801561015e57600080fd5b5061017261016d366004610c26565b610364565b005b34801561018057600080fd5b5061012961018f366004610c6e565b61045b565b3480156101a057600080fd5b506101b46101af366004610c6e565b6104b7565b6040517fffffffff000000000000000000000000000000000000000000000000000000009091168152602001610133565b3480156101f157600080fd5b5061012960015481565b34801561020757600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9545b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610133565b34801561025c57600080fd5b5061017261026b366004610c26565b6105ef565b34801561027c57600080fd5b5061017261028b366004610d66565b6106da565b34801561029c57600080fd5b506101726102ab366004610c26565b6107b4565b3480156102bc57600080fd5b506101726102cb366004610c26565b61089f565b3480156102dc57600080fd5b506101726102eb366004610c26565b61098a565b6101726102fe366004610d88565b610a75565b34801561030f57600080fd5b5061012961031e366004610c6e565b610b50565b34801561032f57600080fd5b5061012960035481565b34801561034557600080fd5b5061022b610bf7565b34801561035a57600080fd5b5061012960005481565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461041f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e000060448201526064015b60405180910390fd5b60028190556040518181527f32740b35c0ea213650f60d44366b4fb211c9033b50714e4a1d34e65d5beb9bb4906020015b60405180910390a150565b60008061046783610b50565b90506000600154826104799190610e3a565b90506000600454600a61048c9190610f99565b905060006003548361049e9190610e3a565b905060006104ac8383610fa5565b979650505050505050565b60006104e17f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b15610548576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a656400006044820152606401610416565b6000806000806000868060200190518101906105649190610fe0565b6000949094556001928355600291909155600355600491909155327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9557f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155507f4ddf47d4000000000000000000000000000000000000000000000000000000009695505050505050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146106a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b60038190556040518181527f3336cd9708eaf2769a0f0dc0679f30e80f15dcd88d1921b5a16858e8b85c591a90602001610450565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610790576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461086a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b60048190556040518181527fd68112a8707e326d08be3656b528c1bcc5bbbfc47f4177e2179b14d8640838c190602001610450565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610955576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b60018190556040518181527f351fb23757bb5ea0546c85b7996ddd7155f96b939ebaa5ff7bc49c75f27f2c4490602001610450565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a40576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b60008190556040518181527ffcdccc6074c6c42e4bd578aa9870c697dc976a270968452d2b8c8dc369fae39690602001610450565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b2b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610416565b808260003760008082600034875af13d6000803e808015610b4b573d6000f35b3d6000fd5b600080805b8351811015610bd057838181518110610b7057610b70611020565b01602001517fff0000000000000000000000000000000000000000000000000000000000000016600003610bb057610ba960048361104f565b9150610bbe565b610bbb60108361104f565b91505b80610bc881611067565b915050610b55565b50600060025482610be1919061104f565b9050610bef8161044061104f565b949350505050565b6000610c217f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b600060208284031215610c3857600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060208284031215610c8057600080fd5b813567ffffffffffffffff80821115610c9857600080fd5b818401915084601f830112610cac57600080fd5b813581811115610cbe57610cbe610c3f565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908382118183101715610d0457610d04610c3f565b81604052828152876020848701011115610d1d57600080fd5b826020860160208301376000928101602001929092525095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610d6157600080fd5b919050565b600060208284031215610d7857600080fd5b610d8182610d3d565b9392505050565b600080600060408486031215610d9d57600080fd5b610da684610d3d565b9250602084013567ffffffffffffffff80821115610dc357600080fd5b818601915086601f830112610dd757600080fd5b813581811115610de657600080fd5b876020828501011115610df857600080fd5b6020830194508093505050509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610e7257610e72610e0b565b500290565b600181815b80851115610ed057817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115610eb657610eb6610e0b565b80851615610ec357918102915b93841c9390800290610e7c565b509250929050565b600082610ee757506001610f93565b81610ef457506000610f93565b8160018114610f0a5760028114610f1457610f30565b6001915050610f93565b60ff841115610f2557610f25610e0b565b50506001821b610f93565b5060208310610133831016604e8410600b8410161715610f53575081810a610f93565b610f5d8383610e77565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115610f8f57610f8f610e0b565b0290505b92915050565b6000610d818383610ed8565b600082610fdb577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b600080600080600060a08688031215610ff857600080fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000821982111561106257611062610e0b565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361109857611098610e0b565b506001019056fea164736f6c634300080d000a";

type OVM_GasPriceOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OVM_GasPriceOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OVM_GasPriceOracle__factory extends ContractFactory {
  constructor(...args: OVM_GasPriceOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OVM_GasPriceOracle> {
    return super.deploy(overrides || {}) as Promise<OVM_GasPriceOracle>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): OVM_GasPriceOracle {
    return super.attach(address) as OVM_GasPriceOracle;
  }
  override connect(signer: Signer): OVM_GasPriceOracle__factory {
    return super.connect(signer) as OVM_GasPriceOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OVM_GasPriceOracleInterface {
    return new utils.Interface(_abi) as OVM_GasPriceOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OVM_GasPriceOracle {
    return new Contract(address, _abi, signerOrProvider) as OVM_GasPriceOracle;
  }
}
