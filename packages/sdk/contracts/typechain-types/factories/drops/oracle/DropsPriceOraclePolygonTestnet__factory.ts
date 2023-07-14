/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DropsPriceOraclePolygonTestnet,
  DropsPriceOraclePolygonTestnetInterface,
} from "../../../drops/oracle/DropsPriceOraclePolygonTestnet";

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
  "0x608060405234801561001057600080fd5b506107fb806100206000396000f3fe6080604052600436106100655760003560e01c8063bf64a82d11610043578063bf64a82d14610137578063f5d781611461014a578063f851a4401461017857600080fd5b80634ddf47d41461006a5780636e9960c3146100c0578063704b6c0214610115575b600080fd5b34801561007657600080fd5b5061008a610085366004610562565b61018d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b3480156100cc57600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b7565b34801561012157600080fd5b5061013561013036600461065a565b610296565b005b61013561014536600461067c565b610370565b34801561015657600080fd5b5061016a6101653660046106ff565b61044b565b6040519081526020016100b7565b34801561018457600080fd5b506100f061047b565b60006101b77f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b15610223576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a6564000060448201526064015b60405180910390fd5b327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95561026f60017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d400000000000000000000000000000000000000000000000000000000919050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461034c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610426576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e0000604482015260640161021a565b808260003760008082600034875af13d6000803e808015610446573d6000f35b3d6000fd5b60006002610458836104aa565b61046184610513565b61046b9190610747565b610475919061075f565b92915050565b60006104a57f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b60006902ec161afffa1767c88c64039af111ce8181846104ca878461079a565b6104d6906103e861079a565b905060006104e488846107d7565b6104f0906103e561079a565b90506104fc818361075f565b610507906001610747565b98975050505050505050565b6000692736fc91c1ab65dab67764306cada6128181846104ca878461079a565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020828403121561057457600080fd5b813567ffffffffffffffff8082111561058c57600080fd5b818401915084601f8301126105a057600080fd5b8135818111156105b2576105b2610533565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156105f8576105f8610533565b8160405282815287602084870101111561061157600080fd5b826020860160208301376000928101602001929092525095945050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461065557600080fd5b919050565b60006020828403121561066c57600080fd5b61067582610631565b9392505050565b60008060006040848603121561069157600080fd5b61069a84610631565b9250602084013567ffffffffffffffff808211156106b757600080fd5b818601915086601f8301126106cb57600080fd5b8135818111156106da57600080fd5b8760208285010111156106ec57600080fd5b6020830194508093505050509250925092565b60006020828403121561071157600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000821982111561075a5761075a610718565b500190565b600082610795577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156107d2576107d2610718565b500290565b6000828210156107e9576107e9610718565b50039056fea164736f6c634300080d000a";

type DropsPriceOraclePolygonTestnetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DropsPriceOraclePolygonTestnetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DropsPriceOraclePolygonTestnet__factory extends ContractFactory {
  constructor(...args: DropsPriceOraclePolygonTestnetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DropsPriceOraclePolygonTestnet> {
    return super.deploy(
      overrides || {}
    ) as Promise<DropsPriceOraclePolygonTestnet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DropsPriceOraclePolygonTestnet {
    return super.attach(address) as DropsPriceOraclePolygonTestnet;
  }
  override connect(signer: Signer): DropsPriceOraclePolygonTestnet__factory {
    return super.connect(signer) as DropsPriceOraclePolygonTestnet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DropsPriceOraclePolygonTestnetInterface {
    return new utils.Interface(_abi) as DropsPriceOraclePolygonTestnetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DropsPriceOraclePolygonTestnet {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DropsPriceOraclePolygonTestnet;
  }
}
