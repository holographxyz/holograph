/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DropsPriceOracleOptimismTestnetGoerli,
  DropsPriceOracleOptimismTestnetGoerliInterface,
} from "../../../drops/oracle/DropsPriceOracleOptimismTestnetGoerli";

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
    stateMutability: "pure",
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
  "0x608060405234801561001057600080fd5b50610865806100206000396000f3fe6080604052600436106100655760003560e01c8063bf64a82d11610043578063bf64a82d14610137578063f5d781611461014a578063f851a4401461017857600080fd5b80634ddf47d41461006a5780636e9960c3146100c0578063704b6c0214610115575b600080fd5b34801561007657600080fd5b5061008a6100853660046105cc565b61018d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b3480156100cc57600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b7565b34801561012157600080fd5b506101356101303660046106c4565b610296565b005b6101356101453660046106e6565b610370565b34801561015657600080fd5b5061016a610165366004610769565b61044b565b6040519081526020016100b7565b34801561018457600080fd5b506100f06104a1565b60006101b77f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b15610223576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a6564000060448201526064015b60405180910390fd5b327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95561026f60017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d400000000000000000000000000000000000000000000000000000000919050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461034c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610426576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b808260003760008082600034875af13d6000803e808015610446573d6000f35b3d6000fd5b60006004610458836104d0565b6104618461053a565b61046a8561055b565b6104738661057c565b61047d91906107b1565b61048791906107b1565b61049191906107b1565b61049b91906107c9565b92915050565b60006104cb7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b600069037e0d17167586ed514a6519de7794542c8181846104f18784610804565b6104fd906103e8610804565b9050600061050b8884610841565b610517906103e5610804565b905061052381836107c9565b61052e9060016107b1565b98975050505050505050565b6000651970421591f769036ce11fb813dd69f3bb8082846104f18784610804565b6000690185ccccc0a1cc90bb3a650b45e42de52d8181846104f18784610804565b6000650cf57798cfea6901be8f15b274c015a1cc8082846104f18784610804565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000602082840312156105de57600080fd5b813567ffffffffffffffff808211156105f657600080fd5b818401915084601f83011261060a57600080fd5b81358181111561061c5761061c61059d565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156106625761066261059d565b8160405282815287602084870101111561067b57600080fd5b826020860160208301376000928101602001929092525095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146106bf57600080fd5b919050565b6000602082840312156106d657600080fd5b6106df8261069b565b9392505050565b6000806000604084860312156106fb57600080fd5b6107048461069b565b9250602084013567ffffffffffffffff8082111561072157600080fd5b818601915086601f83011261073557600080fd5b81358181111561074457600080fd5b87602082850101111561075657600080fd5b6020830194508093505050509250925092565b60006020828403121561077b57600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082198211156107c4576107c4610782565b500190565b6000826107ff577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561083c5761083c610782565b500290565b60008282101561085357610853610782565b50039056fea164736f6c634300080d000a";

type DropsPriceOracleOptimismTestnetGoerliConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DropsPriceOracleOptimismTestnetGoerliConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DropsPriceOracleOptimismTestnetGoerli__factory extends ContractFactory {
  constructor(...args: DropsPriceOracleOptimismTestnetGoerliConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DropsPriceOracleOptimismTestnetGoerli> {
    return super.deploy(
      overrides || {}
    ) as Promise<DropsPriceOracleOptimismTestnetGoerli>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DropsPriceOracleOptimismTestnetGoerli {
    return super.attach(address) as DropsPriceOracleOptimismTestnetGoerli;
  }
  override connect(
    signer: Signer
  ): DropsPriceOracleOptimismTestnetGoerli__factory {
    return super.connect(
      signer
    ) as DropsPriceOracleOptimismTestnetGoerli__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DropsPriceOracleOptimismTestnetGoerliInterface {
    return new utils.Interface(
      _abi
    ) as DropsPriceOracleOptimismTestnetGoerliInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DropsPriceOracleOptimismTestnetGoerli {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DropsPriceOracleOptimismTestnetGoerli;
  }
}