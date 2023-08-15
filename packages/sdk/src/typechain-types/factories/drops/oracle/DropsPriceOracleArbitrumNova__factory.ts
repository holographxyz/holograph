/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DropsPriceOracleArbitrumNova,
  DropsPriceOracleArbitrumNovaInterface,
} from "../../../drops/oracle/DropsPriceOracleArbitrumNova";

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
  "0x608060405234801561001057600080fd5b50610985806100206000396000f3fe6080604052600436106100655760003560e01c8063bf64a82d11610043578063bf64a82d14610137578063f5d781611461014a578063f851a4401461017857600080fd5b80634ddf47d41461006a5780636e9960c3146100c0578063704b6c0214610115575b600080fd5b34801561007657600080fd5b5061008a61008536600461067e565b61018d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b3480156100cc57600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b7565b34801561012157600080fd5b50610135610130366004610776565b610296565b005b610135610145366004610798565b610370565b34801561015657600080fd5b5061016a61016536600461081b565b61044b565b6040519081526020016100b7565b34801561018457600080fd5b506100f06104a1565b60006101b77f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b15610223576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a6564000060448201526064015b60405180910390fd5b327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95561026f60017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d400000000000000000000000000000000000000000000000000000000919050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461034c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610426576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b808260003760008082600034875af13d6000803e808015610446573d6000f35b3d6000fd5b60006004610458836104d0565b610461846105b4565b61046a856104d0565b610473866105b4565b61047d9190610863565b6104879190610863565b6104919190610863565b61049b919061087b565b92915050565b60006104cb7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b60008060008073ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015610520573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061054491906108d4565b5090925090506dffffffffffffffffffffffffffff808316908216600061056b8784610924565b610577906103e8610924565b905060006105858884610961565b610591906103e5610924565b905061059d818361087b565b6105a8906001610863565b98975050505050505050565b60008060008073ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015610604573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062891906108d4565b5090925090506dffffffffffffffffffffffffffff808216908316600061056b8784610924565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020828403121561069057600080fd5b813567ffffffffffffffff808211156106a857600080fd5b818401915084601f8301126106bc57600080fd5b8135818111156106ce576106ce61064f565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156107145761071461064f565b8160405282815287602084870101111561072d57600080fd5b826020860160208301376000928101602001929092525095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461077157600080fd5b919050565b60006020828403121561078857600080fd5b6107918261074d565b9392505050565b6000806000604084860312156107ad57600080fd5b6107b68461074d565b9250602084013567ffffffffffffffff808211156107d357600080fd5b818601915086601f8301126107e757600080fd5b8135818111156107f657600080fd5b87602082850101111561080857600080fd5b6020830194508093505050509250925092565b60006020828403121561082d57600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000821982111561087657610876610834565b500190565b6000826108b1577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b80516dffffffffffffffffffffffffffff8116811461077157600080fd5b6000806000606084860312156108e957600080fd5b6108f2846108b6565b9250610900602085016108b6565b9150604084015163ffffffff8116811461091957600080fd5b809150509250925092565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561095c5761095c610834565b500290565b60008282101561097357610973610834565b50039056fea164736f6c634300080d000a";

type DropsPriceOracleArbitrumNovaConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DropsPriceOracleArbitrumNovaConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DropsPriceOracleArbitrumNova__factory extends ContractFactory {
  constructor(...args: DropsPriceOracleArbitrumNovaConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DropsPriceOracleArbitrumNova> {
    return super.deploy(
      overrides || {}
    ) as Promise<DropsPriceOracleArbitrumNova>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DropsPriceOracleArbitrumNova {
    return super.attach(address) as DropsPriceOracleArbitrumNova;
  }
  override connect(signer: Signer): DropsPriceOracleArbitrumNova__factory {
    return super.connect(signer) as DropsPriceOracleArbitrumNova__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DropsPriceOracleArbitrumNovaInterface {
    return new utils.Interface(_abi) as DropsPriceOracleArbitrumNovaInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DropsPriceOracleArbitrumNova {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DropsPriceOracleArbitrumNova;
  }
}