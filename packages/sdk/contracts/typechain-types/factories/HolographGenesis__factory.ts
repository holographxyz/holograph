/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  HolographGenesis,
  HolographGenesisInterface,
} from "../HolographGenesis";

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
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "Message",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newDeployer",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approve",
        type: "bool",
      },
    ],
    name: "approveDeployer",
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
      {
        internalType: "bytes12",
        name: "saltHash",
        type: "bytes12",
      },
      {
        internalType: "bytes",
        name: "sourceCode",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "initCode",
        type: "bytes",
      },
    ],
    name: "deploy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
    ],
    name: "isApprovedDeployer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b503260009081526020819052604090819020805460ff19166001179055517f51a7f65c6325882f237d4aeb43228179cfad48b868511d508e24b4437a81913790610089906020808252818101527f54686520667574757265206f66204e46547320697320486f6c6f67726170682e604082015260600190565b60405180910390a16108bd806100a06000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806351724d9e14610046578063a07d73161461005b578063dc7faa071461006e575b600080fd5b610059610054366004610691565b6100bb565b005b61005961006936600461075f565b6104ae565b6100a761007c36600461079b565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205460ff1690565b604051901515815260200160405180910390f35b3360009081526020819052604090205460ff16610139576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a206465706c6f796572206e6f7420617070726f76656460448201526064015b60405180910390fd5b4684146101a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f484f4c4f47524150483a20696e636f727265637420636861696e2069640000006044820152606401610130565b604080517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b1660208201527fffffffffffffffffffffffff00000000000000000000000000000000000000008516603482015260009101604051602081830303815290604052610215906107b6565b8351602080860191909120604080517fff00000000000000000000000000000000000000000000000000000000000000818501523060601b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660218201526035810185905260558082019390935281518082039093018352607501905280519101209091506102a48161057d565b1561030b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f484f4c4f47524150483a20616c7265616479206465706c6f79656400000000006044820152606401610130565b818451602086016000f590506103208161057d565b610386576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f484f4c4f47524150483a206465706c6f796d656e74206661696c6564000000006044820152606401610130565b6040517f4ddf47d4000000000000000000000000000000000000000000000000000000008082529073ffffffffffffffffffffffffffffffffffffffff831690634ddf47d4906103da9087906004016107fb565b6020604051808303816000875af11580156103f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061041d919061086e565b7fffffffff0000000000000000000000000000000000000000000000000000000016146104a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a20696e697469616c697a6174696f6e206661696c65646044820152606401610130565b505050505050565b3360009081526020819052604090205460ff16610527576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a206465706c6f796572206e6f7420617070726f7665646044820152606401610130565b73ffffffffffffffffffffffffffffffffffffffff91909116600090815260208190526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b6000813f80158015906105b057507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4708114155b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f8301126105f757600080fd5b813567ffffffffffffffff80821115610612576106126105b7565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715610658576106586105b7565b8160405283815286602085880101111561067157600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080608085870312156106a757600080fd5b8435935060208501357fffffffffffffffffffffffff0000000000000000000000000000000000000000811681146106de57600080fd5b9250604085013567ffffffffffffffff808211156106fb57600080fd5b610707888389016105e6565b9350606087013591508082111561071d57600080fd5b5061072a878288016105e6565b91505092959194509250565b803573ffffffffffffffffffffffffffffffffffffffff8116811461075a57600080fd5b919050565b6000806040838503121561077257600080fd5b61077b83610736565b91506020830135801515811461079057600080fd5b809150509250929050565b6000602082840312156107ad57600080fd5b6105b082610736565b805160208083015191908110156107f5577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8160200360031b1b821691505b50919050565b600060208083528351808285015260005b818110156108285785810183015185820160400152820161080c565b8181111561083a576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60006020828403121561088057600080fd5b81517fffffffff00000000000000000000000000000000000000000000000000000000811681146105b057600080fdfea164736f6c634300080d000a";

type HolographGenesisConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HolographGenesisConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class HolographGenesis__factory extends ContractFactory {
  constructor(...args: HolographGenesisConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<HolographGenesis> {
    return super.deploy(overrides || {}) as Promise<HolographGenesis>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): HolographGenesis {
    return super.attach(address) as HolographGenesis;
  }
  override connect(signer: Signer): HolographGenesis__factory {
    return super.connect(signer) as HolographGenesis__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HolographGenesisInterface {
    return new utils.Interface(_abi) as HolographGenesisInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HolographGenesis {
    return new Contract(address, _abi, signerOrProvider) as HolographGenesis;
  }
}
