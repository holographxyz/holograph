/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Holograph, HolographInterface } from "../Holograph";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
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
    inputs: [],
    name: "getBridge",
    outputs: [
      {
        internalType: "address",
        name: "bridge",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFactory",
    outputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHolographChainId",
    outputs: [
      {
        internalType: "uint32",
        name: "holographChainId",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInterfaces",
    outputs: [
      {
        internalType: "address",
        name: "interfaces",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOperator",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegistry",
    outputs: [
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTreasury",
    outputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUtilityToken",
    outputs: [
      {
        internalType: "address",
        name: "utilityToken",
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
        internalType: "address",
        name: "bridge",
        type: "address",
      },
    ],
    name: "setBridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "setChainId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "setFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "holographChainId",
        type: "uint32",
      },
    ],
    name: "setHolographChainId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "interfaces",
        type: "address",
      },
    ],
    name: "setInterfaces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
    ],
    name: "setRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "utilityToken",
        type: "address",
      },
    ],
    name: "setUtilityToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061146f806100206000396000f3fe6080604052600436106101835760003560e01c80638dd14802116100d6578063da8292d91161007f578063ef0e2ff411610059578063ef0e2ff41461053f578063f0f442601461055f578063f851a4401461057f57600080fd5b8063da8292d9146104b7578063e7f43c68146104d7578063ebac15f91461050b57600080fd5b8063b3ab15fb116100b0578063b3ab15fb14610464578063bf64a82d14610484578063c910325b1461049757600080fd5b80638dd14802146104045780639013ae0814610424578063a91ee0dc1461044457600080fd5b80634ddf47d4116101385780636e9960c3116101125780636e9960c31461037c578063704b6c02146103b057806388cc58e4146103d057600080fd5b80634ddf47d4146102d55780635ab1bd53146103265780635bb478081461035a57600080fd5b80633408e470116101695780633408e47014610220578063381b5f461461025d5780633b19e84a146102a157600080fd5b8062626679146101925780630fffbaf3146101ec57600080fd5b3661018d57600080fd5b600080fd5b34801561019e57600080fd5b507fbf76518d46db472b71aa7677a0908b8016f3dee568415ffa24055f9a670f9c37545b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b3480156101f857600080fd5b507feb87cbb21687feb327e3d58c6c16d552231d12c7a0e8115042a4165fac8a77f9546101c2565b34801561022c57600080fd5b507f7651bfc11f7485d07ab2b41c1312e2007c8cb7efb0f7352a6dee4a1153eebab2546040519081526020016101e3565b34801561026957600080fd5b507fd840a780c26e07edc6e1ee2eaa6f134ed5488dbd762614116653cee8542a38445460405163ffffffff90911681526020016101e3565b3480156102ad57600080fd5b507f4215e7a38d75164ca078bbd61d0992cdeb1ba16f3b3ead5944966d3e4080e8b6546101c2565b3480156102e157600080fd5b506102f56102f03660046111cd565b610594565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016101e3565b34801561033257600080fd5b507fce8e75d5c5227ce29a4ee170160bb296e5dea6934b80a9bd723f7ef1e7c850e7546101c2565b34801561036657600080fd5b5061037a6103753660046112c1565b610810565b005b34801561038857600080fd5b507f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c9546101c2565b3480156103bc57600080fd5b5061037a6103cb3660046112c1565b6108ea565b3480156103dc57600080fd5b507fa49f20855ba576e09d13c8041c8039fa655356ea27f6c40f1ec46a4301cd5b23546101c2565b34801561041057600080fd5b5061037a61041f3660046112c1565b6109c4565b34801561043057600080fd5b5061037a61043f3660046112c1565b610a9e565b34801561045057600080fd5b5061037a61045f3660046112c1565b610b78565b34801561047057600080fd5b5061037a61047f3660046112c1565b610c52565b61037a6104923660046112e5565b610d2c565b3480156104a357600080fd5b5061037a6104b236600461137c565b610e07565b3480156104c357600080fd5b5061037a6104d23660046112c1565b610ee1565b3480156104e357600080fd5b507f7caba557ad34138fa3b7e43fb574e0e6cc10481c3073e0dffbc560db81b5c60f546101c2565b34801561051757600080fd5b507fbd3084b8c09da87ad159c247a60e209784196be2530cecbbd8f337fdd1848827546101c2565b34801561054b57600080fd5b5061037a61055a366004611399565b610fbb565b34801561056b57600080fd5b5061037a61057a3660046112c1565b611095565b34801561058b57600080fd5b506101c261116f565b60006105be7f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b1561062a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a20616c726561647920696e697469616c697a6564000060448201526064015b60405180910390fd5b6000806000806000806000808980602001905181019061064a91906113b2565b97509750975097509750975097509750327f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955467f7651bfc11f7485d07ab2b41c1312e2007c8cb7efb0f7352a6dee4a1153eebab255877fd840a780c26e07edc6e1ee2eaa6f134ed5488dbd762614116653cee8542a384455867feb87cbb21687feb327e3d58c6c16d552231d12c7a0e8115042a4165fac8a77f955857fa49f20855ba576e09d13c8041c8039fa655356ea27f6c40f1ec46a4301cd5b2355847fbd3084b8c09da87ad159c247a60e209784196be2530cecbbd8f337fdd184882755837f7caba557ad34138fa3b7e43fb574e0e6cc10481c3073e0dffbc560db81b5c60f55827fce8e75d5c5227ce29a4ee170160bb296e5dea6934b80a9bd723f7ef1e7c850e755817f4215e7a38d75164ca078bbd61d0992cdeb1ba16f3b3ead5944966d3e4080e8b655807fbf76518d46db472b71aa7677a0908b8016f3dee568415ffa24055f9a670f9c37556107e160017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d4000000000000000000000000000000000000000000000000000000009998505050505050505050565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146108c6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7fa49f20855ba576e09d13c8041c8039fa655356ea27f6c40f1ec46a4301cd5b2355565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146109a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a7a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7feb87cbb21687feb327e3d58c6c16d552231d12c7a0e8115042a4165fac8a77f955565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b54576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7fbf76518d46db472b71aa7677a0908b8016f3dee568415ffa24055f9a670f9c3755565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c2e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7fce8e75d5c5227ce29a4ee170160bb296e5dea6934b80a9bd723f7ef1e7c850e755565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d08576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7f7caba557ad34138fa3b7e43fb574e0e6cc10481c3073e0dffbc560db81b5c60f55565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610de2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b808260003760008082600034875af13d6000803e808015610e02573d6000f35b3d6000fd5b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ebd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7fd840a780c26e07edc6e1ee2eaa6f134ed5488dbd762614116653cee8542a384455565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f97576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7fbd3084b8c09da87ad159c247a60e209784196be2530cecbbd8f337fdd184882755565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611071576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7f7651bfc11f7485d07ab2b41c1312e2007c8cb7efb0f7352a6dee4a1153eebab255565b7f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461114b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a2061646d696e206f6e6c792066756e6374696f6e00006044820152606401610621565b7f4215e7a38d75164ca078bbd61d0992cdeb1ba16f3b3ead5944966d3e4080e8b655565b60006111997f3f106594dc74eeef980dae234cde8324dc2497b13d27a0c59e55bd2ca10a07c95490565b905090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000602082840312156111df57600080fd5b813567ffffffffffffffff808211156111f757600080fd5b818401915084601f83011261120b57600080fd5b81358181111561121d5761121d61119e565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156112635761126361119e565b8160405282815287602084870101111561127c57600080fd5b826020860160208301376000928101602001929092525095945050505050565b73ffffffffffffffffffffffffffffffffffffffff811681146112be57600080fd5b50565b6000602082840312156112d357600080fd5b81356112de8161129c565b9392505050565b6000806000604084860312156112fa57600080fd5b83356113058161129c565b9250602084013567ffffffffffffffff8082111561132257600080fd5b818601915086601f83011261133657600080fd5b81358181111561134557600080fd5b87602082850101111561135757600080fd5b6020830194508093505050509250925092565b63ffffffff811681146112be57600080fd5b60006020828403121561138e57600080fd5b81356112de8161136a565b6000602082840312156113ab57600080fd5b5035919050565b600080600080600080600080610100898b0312156113cf57600080fd5b88516113da8161136a565b60208a01519098506113eb8161129c565b60408a01519097506113fc8161129c565b60608a015190965061140d8161129c565b60808a015190955061141e8161129c565b60a08a015190945061142f8161129c565b60c08a01519093506114408161129c565b60e08a01519092506114518161129c565b80915050929598509295989093965056fea164736f6c634300080d000a";

type HolographConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HolographConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Holograph__factory extends ContractFactory {
  constructor(...args: HolographConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Holograph> {
    return super.deploy(overrides || {}) as Promise<Holograph>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Holograph {
    return super.attach(address) as Holograph;
  }
  override connect(signer: Signer): Holograph__factory {
    return super.connect(signer) as Holograph__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HolographInterface {
    return new utils.Interface(_abi) as HolographInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Holograph {
    return new Contract(address, _abi, signerOrProvider) as Holograph;
  }
}