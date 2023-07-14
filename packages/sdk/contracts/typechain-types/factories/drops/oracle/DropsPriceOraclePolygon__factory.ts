/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DropsPriceOraclePolygon,
  DropsPriceOraclePolygonInterface,
} from "../../../drops/oracle/DropsPriceOraclePolygon";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    inputs: [
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256",
      },
    ],
    name: "convertUsdToWei",
    outputs: [
      {
        internalType: "uint256",
        name: "weiAmount",
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
        name: "",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061093c806100206000396000f3fe6080604052600436106100655760003560e01c8063bf64a82d11610043578063bf64a82d14610137578063f5d781611461014a578063f851a4401461017857600080fd5b80634ddf47d41461006a5780636e9960c3146100c0578063704b6c0214610115575b600080fd5b34801561007657600080fd5b5061008a610085366004610635565b61018d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b3480156100cc57600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b7565b34801561012157600080fd5b5061013561013036600461072d565b610296565b005b61013561014536600461074f565b610370565b34801561015657600080fd5b5061016a6101653660046107d2565b61044b565b6040519081526020016100b7565b34801561018457600080fd5b506100f061047b565b60006101b77f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b15610223576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a6564000060448201526064015b60405180910390fd5b327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95561026f60017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d400000000000000000000000000000000000000000000000000000000919050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461034c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610426576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b808260003760008082600034875af13d6000803e808015610446573d6000f35b3d6000fd5b60006002610458836104aa565b610461846105a2565b61046b919061081a565b6104759190610832565b92915050565b60006104a57f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b60008060007355ff76bffc3cdd9d5fdbbc2ece4528ecce45047e73ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa15801561050e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610532919061088b565b5090925090506dffffffffffffffffffffffffffff808316908216600061055987846108db565b610565906103e86108db565b905060006105738884610918565b61057f906103e56108db565b905061058b8183610832565b61059690600161081a565b98975050505050505050565b600080600073cd353f79d9fade311fc3119b841e1f456b54e85873ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa15801561050e573d6000803e3d6000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020828403121561064757600080fd5b813567ffffffffffffffff8082111561065f57600080fd5b818401915084601f83011261067357600080fd5b81358181111561068557610685610606565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156106cb576106cb610606565b816040528281528760208487010111156106e457600080fd5b826020860160208301376000928101602001929092525095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461072857600080fd5b919050565b60006020828403121561073f57600080fd5b61074882610704565b9392505050565b60008060006040848603121561076457600080fd5b61076d84610704565b9250602084013567ffffffffffffffff8082111561078a57600080fd5b818601915086601f83011261079e57600080fd5b8135818111156107ad57600080fd5b8760208285010111156107bf57600080fd5b6020830194508093505050509250925092565b6000602082840312156107e457600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000821982111561082d5761082d6107eb565b500190565b600082610868577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b80516dffffffffffffffffffffffffffff8116811461072857600080fd5b6000806000606084860312156108a057600080fd5b6108a98461086d565b92506108b76020850161086d565b9150604084015163ffffffff811681146108d057600080fd5b809150509250925092565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610913576109136107eb565b500290565b60008282101561092a5761092a6107eb565b50039056fea164736f6c634300080d000a";

type DropsPriceOraclePolygonConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DropsPriceOraclePolygonConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DropsPriceOraclePolygon__factory extends ContractFactory {
  constructor(...args: DropsPriceOraclePolygonConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DropsPriceOraclePolygon> {
    return super.deploy(overrides || {}) as Promise<DropsPriceOraclePolygon>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DropsPriceOraclePolygon {
    return super.attach(address) as DropsPriceOraclePolygon;
  }
  override connect(signer: Signer): DropsPriceOraclePolygon__factory {
    return super.connect(signer) as DropsPriceOraclePolygon__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DropsPriceOraclePolygonInterface {
    return new utils.Interface(_abi) as DropsPriceOraclePolygonInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DropsPriceOraclePolygon {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DropsPriceOraclePolygon;
  }
}
