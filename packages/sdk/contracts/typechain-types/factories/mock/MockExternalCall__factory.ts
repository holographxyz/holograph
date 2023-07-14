/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  MockExternalCall,
  MockExternalCallInterface,
} from "../../mock/MockExternalCall";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "encodedSignature",
        type: "bytes",
      },
    ],
    name: "callExternalFn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506101e0806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80638dae0e0c14610030575b600080fd5b61004361003e366004610125565b610045565b005b60008373ffffffffffffffffffffffffffffffffffffffff16838360405161006e9291906101c3565b6000604051808303816000865af19150503d80600081146100ab576040519150601f19603f3d011682016040523d82523d6000602084013e6100b0565b606091505b505090508061011f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f4661696c65640000000000000000000000000000000000000000000000000000604482015260640160405180910390fd5b50505050565b60008060006040848603121561013a57600080fd5b833573ffffffffffffffffffffffffffffffffffffffff8116811461015e57600080fd5b9250602084013567ffffffffffffffff8082111561017b57600080fd5b818601915086601f83011261018f57600080fd5b81358181111561019e57600080fd5b8760208285010111156101b057600080fd5b6020830194508093505050509250925092565b818382376000910190815291905056fea164736f6c634300080d000a";

type MockExternalCallConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockExternalCallConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockExternalCall__factory extends ContractFactory {
  constructor(...args: MockExternalCallConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockExternalCall> {
    return super.deploy(overrides || {}) as Promise<MockExternalCall>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockExternalCall {
    return super.attach(address) as MockExternalCall;
  }
  override connect(signer: Signer): MockExternalCall__factory {
    return super.connect(signer) as MockExternalCall__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockExternalCallInterface {
    return new utils.Interface(_abi) as MockExternalCallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockExternalCall {
    return new Contract(address, _abi, signerOrProvider) as MockExternalCall;
  }
}
