/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  MockHolographGenesisChild,
  MockHolographGenesisChildInterface,
} from "../../mock/MockHolographGenesisChild";

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
    name: "approveDeployerMock",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
    ],
    name: "isApprovedDeployerMock",
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
  "0x608060405234801561001057600080fd5b503260009081526020819052604090819020805460ff19166001179055517f51a7f65c6325882f237d4aeb43228179cfad48b868511d508e24b4437a81913790610089906020808252818101527f54686520667574757265206f66204e46547320697320486f6c6f67726170682e604082015260600190565b60405180910390a1610ac5806100a06000396000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063a78645bd11610050578063a78645bd14610094578063dc7faa07146100bb578063e776ecf1146100f457600080fd5b806351724d9e1461006c578063a07d731614610081575b600080fd5b61007f61007a366004610870565b610107565b005b61007f61008f36600461094f565b6104fa565b6100a76100a2366004610986565b6105c9565b604051901515815260200160405180910390f35b6100a76100c9366004610986565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205460ff1690565b61007f61010236600461094f565b610660565b3360009081526020819052604090205460ff16610185576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a206465706c6f796572206e6f7420617070726f76656460448201526064015b60405180910390fd5b4684146101ee576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f484f4c4f47524150483a20696e636f727265637420636861696e206964000000604482015260640161017c565b604080517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b1660208201527fffffffffffffffffffffffff00000000000000000000000000000000000000008516603482015260009101604051602081830303815290604052610261906109a1565b8351602080860191909120604080517fff00000000000000000000000000000000000000000000000000000000000000818501523060601b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660218201526035810185905260558082019390935281518082039093018352607501905280519101209091506102f08161075c565b15610357576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f484f4c4f47524150483a20616c7265616479206465706c6f7965640000000000604482015260640161017c565b818451602086016000f5905061036c8161075c565b6103d2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f484f4c4f47524150483a206465706c6f796d656e74206661696c656400000000604482015260640161017c565b6040517f4ddf47d4000000000000000000000000000000000000000000000000000000008082529073ffffffffffffffffffffffffffffffffffffffff831690634ddf47d4906104269087906004016109e6565b6020604051808303816000875af1158015610445573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104699190610a59565b7fffffffff0000000000000000000000000000000000000000000000000000000016146104f2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a20696e697469616c697a6174696f6e206661696c6564604482015260640161017c565b505050505050565b3360009081526020819052604090205460ff16610573576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a206465706c6f796572206e6f7420617070726f766564604482015260640161017c565b73ffffffffffffffffffffffffffffffffffffffff91909116600090815260208190526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b6040517fdc7faa0700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152600090309063dc7faa0790602401602060405180830381865afa158015610636573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061065a9190610a9b565b92915050565b3360009081526020819052604090205460ff166106d9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f484f4c4f47524150483a206465706c6f796572206e6f7420617070726f766564604482015260640161017c565b6040517fa07d731600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff831660048201528115156024820152309063a07d731690604401600060405180830381600087803b15801561074857600080fd5b505af11580156104f2573d6000803e3d6000fd5b6000813f801580159061078f57507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4708114155b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f8301126107d657600080fd5b813567ffffffffffffffff808211156107f1576107f1610796565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190828211818310171561083757610837610796565b8160405283815286602085880101111561085057600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561088657600080fd5b8435935060208501357fffffffffffffffffffffffff0000000000000000000000000000000000000000811681146108bd57600080fd5b9250604085013567ffffffffffffffff808211156108da57600080fd5b6108e6888389016107c5565b935060608701359150808211156108fc57600080fd5b50610909878288016107c5565b91505092959194509250565b803573ffffffffffffffffffffffffffffffffffffffff8116811461093957600080fd5b919050565b801515811461094c57600080fd5b50565b6000806040838503121561096257600080fd5b61096b83610915565b9150602083013561097b8161093e565b809150509250929050565b60006020828403121561099857600080fd5b61078f82610915565b805160208083015191908110156109e0577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8160200360031b1b821691505b50919050565b600060208083528351808285015260005b81811015610a13578581018301518582016040015282016109f7565b81811115610a25576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b600060208284031215610a6b57600080fd5b81517fffffffff000000000000000000000000000000000000000000000000000000008116811461078f57600080fd5b600060208284031215610aad57600080fd5b815161078f8161093e56fea164736f6c634300080d000a";

type MockHolographGenesisChildConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockHolographGenesisChildConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockHolographGenesisChild__factory extends ContractFactory {
  constructor(...args: MockHolographGenesisChildConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockHolographGenesisChild> {
    return super.deploy(overrides || {}) as Promise<MockHolographGenesisChild>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockHolographGenesisChild {
    return super.attach(address) as MockHolographGenesisChild;
  }
  override connect(signer: Signer): MockHolographGenesisChild__factory {
    return super.connect(signer) as MockHolographGenesisChild__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockHolographGenesisChildInterface {
    return new utils.Interface(_abi) as MockHolographGenesisChildInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockHolographGenesisChild {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockHolographGenesisChild;
  }
}
