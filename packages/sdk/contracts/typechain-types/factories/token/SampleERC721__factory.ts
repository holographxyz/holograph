/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SampleERC721,
  SampleERC721Interface,
} from "../../token/SampleERC721";

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
        indexed: true,
        internalType: "address",
        name: "source",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "FundsReceived",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "afterApprovalAll",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "afterApprove",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "afterBurn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "afterMint",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterOnERC721Received",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterSafeTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "afterTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "beforeApprovalAll",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "beforeApprove",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "beforeBurn",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "beforeMint",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeOnERC721Received",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeSafeTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "beforeTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "bridgeIn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "bridgeOut",
    outputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "contractJSON",
        type: "string",
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
        name: "wallet",
        type: "address",
      },
    ],
    name: "isOwner",
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
    inputs: [],
    name: "isOwner",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint224",
        name: "tokenId",
        type: "uint224",
      },
      {
        internalType: "string",
        name: "URI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "onIsApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
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
  "0x608060405234801561001057600080fd5b506121cf806100206000396000f3fe6080604052600436106101a55760003560e01c80634ddf47d4116100e1578063900f66ef1161008a578063b6d3d5b711610064578063b6d3d5b7146102d7578063c87b56dd14610474578063e8a3d48514610494578063f0f54073146104a957610203565b8063900f66ef1461034c578063971c34b414610434578063983fd56d1461045457610203565b80638b1465c6116100bb5780638b1465c6146103b85780638da5cb5b146103e55780638f32d59b1461041f57610203565b80634ddf47d41461036757806368fd76b21461032c5780638a2fa94c1461029757610203565b80632f54bf6e1161014e5780633ccfd60b116101285780633ccfd60b14610317578063462b401a1461032c57806347abf3be1461034c5780634a1fefbd1461029757610203565b80632f54bf6e146102f7578063343b278f146102b757806336fff062146102b757610203565b80630668af801161017f5780630668af80146102b75780630d391915146102d75780632ca16676146102b757610203565b8063015eaa7a1461024157806301ffc9a7146102765780630628a2c01461029757610203565b36610203576101b26104c9565b73ffffffffffffffffffffffffffffffffffffffff167f8e47b87b0ef542cdfa1659c551d88bad38aa7f452d2bbb349ab7530dfec8be8f346040516101f991815260200190565b60405180910390a2005b337fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd54146001811461023457600080fd5b600160805260206080f35b005b34801561024d57600080fd5b5061026161025c366004611a62565b610528565b60405190151581526020015b60405180910390f35b34801561028257600080fd5b50610261610291366004611a9b565b50600090565b3480156102a357600080fd5b506102616102b2366004611add565b6105f4565b3480156102c357600080fd5b506102616102d2366004611b52565b6106e7565b3480156102e357600080fd5b506102616102f2366004611bd3565b6107dd565b34801561030357600080fd5b50610261610312366004611c1e565b6108d1565b34801561032357600080fd5b5061023f610930565b34801561033857600080fd5b50610261610347366004611c3b565b610a55565b34801561035857600080fd5b506102616102f2366004611cc0565b34801561037357600080fd5b50610387610382366004611dc4565b610b4c565b6040517fffffffff00000000000000000000000000000000000000000000000000000000909116815260200161026d565b3480156103c457600080fd5b506103d86103d3366004611e29565b610b9d565b60405161026d9190611ee3565b3480156103f157600080fd5b506103fa610cbb565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161026d565b34801561042b57600080fd5b50610261610cea565b34801561044057600080fd5b5061026161044f366004611add565b610d4e565b34801561046057600080fd5b5061023f61046f366004611ef6565b610e2c565b34801561048057600080fd5b506103d861048f366004611f7c565b6113ee565b3480156104a057600080fd5b506103d861154b565b3480156104b557600080fd5b506102616104c4366004611f95565b611639565b60007fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd543314600081146105205750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe036013590565b3391505b5090565b60006105527fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146105eb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064015b60405180910390fd5b50600092915050565b600061061e7fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146106b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b50600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600190811790915592915050565b60006107117fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b50600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600190811790915595945050505050565b60006108077fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461089b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b50600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660019081179091559392505050565b60006108fb7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775490565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff166109706104c9565b73ffffffffffffffffffffffffffffffffffffffff16146109ed576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f4552433732313a206f776e6572206f6e6c792066756e6374696f6e000000000060448201526064016105e2565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775460405173ffffffffffffffffffffffffffffffffffffffff909116904780156108fc02916000818181858888f19350505050158015610a52573d6000803e3d6000fd5b50565b6000610a7f7fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b13576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b50600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660019081179091559695505050505050565b60008082806020019051810190610b639190611fb7565b9050610b8d817fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf77277755565b610b9683611738565b9392505050565b6060610bc77fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c5b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b600280547fffffff00ffffffffffffffffffffffffffffffffffffffffffffffffffffffff1690556000828152600160209081526040918290209151610ca2929101612027565b6040516020818303038152906040529050949350505050565b6000610ce57fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775490565b905090565b6000610d147fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775490565b73ffffffffffffffffffffffffffffffffffffffff16610d326104c9565b73ffffffffffffffffffffffffffffffffffffffff1614905090565b6000610d787fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e0c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b6000828152600160205260408120610e23916118df565b50600192915050565b7fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ee2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff16610f226104c9565b73ffffffffffffffffffffffffffffffffffffffff1614610f9f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f4552433732313a206f776e6572206f6e6c792066756e6374696f6e000000000060448201526064016105e2565b6000610fc97fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b9050837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1660000361128a5760028054600191906000906110259084907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff16612134565b92506101000a8154817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff02191690837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1602179055505b6002546040517f4f558e790000000000000000000000000000000000000000000000000000000081527bffffffffffffffffffffffffffffffffffffffffffffffffffffffff909116600482015273ffffffffffffffffffffffffffffffffffffffff821690634f558e7990602401602060405180830381865afa158015611100573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111249190612174565b806111da57506002546040517f23250cae0000000000000000000000000000000000000000000000000000000081527bffffffffffffffffffffffffffffffffffffffffffffffffffffffff909116600482015273ffffffffffffffffffffffffffffffffffffffff8216906323250cae90602401602060405180830381865afa1580156111b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111da9190612174565b156112665760028054600191906000906112139084907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff16612134565b92506101000a8154817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff02191690837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff160217905550611074565b6002547bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1693505b6040517f3b4f1b2600000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86811660048301527bffffffffffffffffffffffffffffffffffffffffffffffffffffffff86166024830152821690633b4f1b2690604401600060405180830381600087803b15801561131757600080fd5b505af115801561132b573d6000803e3d6000fd5b505050506000847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff166377dbd8636040518163ffffffff1660e01b8152600401602060405180830381865afa15801561139b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113bf9190612191565b6113c991906121aa565b60008181526001602052604090209091506113e5908585611919565b50505050505050565b60606114187fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114ac576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b600082815260016020526040902080546114c590611fd4565b80601f01602080910402602001604051908101604052809291908181526020018280546114f190611fd4565b801561153e5780601f106115135761010080835404028352916020019161153e565b820191906000526020600020905b81548152906001019060200180831161152157829003601f168201915b505050505090505b919050565b60606115757fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611609576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b60005460ff16611626575060408051602081019091526000815290565b5060408051602081019091526000815290565b60006116637fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd5490565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146116f7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4552433732313a20686f6c6f67726170686572206f6e6c79000000000000000060448201526064016105e2565b600061170583850185611dc4565b600086815260016020908152604090912082519293506117299290918401906119b7565b50600198975050505050505050565b60006117627f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b156117c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f4552433732313a20616c726561647920696e697469616c697a6564000000000060448201526064016105e2565b337fe9fcff60011c1a99f7b7244d1f2d9da93d79ea8ef3654ce590d775575255b2bd8190557fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff811661188d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f484f4c4f47524150483a206f776e6572206e6f7420736574000000000000000060448201526064016105e2565b6118b660017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b507f4ddf47d4000000000000000000000000000000000000000000000000000000009392505050565b5080546118eb90611fd4565b6000825580601f106118fb575050565b601f016020900490600052602060002090810190610a529190611a2b565b82805461192590611fd4565b90600052602060002090601f01602090048101928261194757600085556119ab565b82601f1061197e578280017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008235161785556119ab565b828001600101855582156119ab579182015b828111156119ab578235825591602001919060010190611990565b50610524929150611a2b565b8280546119c390611fd4565b90600052602060002090601f0160209004810192826119e557600085556119ab565b82601f106119fe57805160ff19168380011785556119ab565b828001600101855582156119ab579182015b828111156119ab578251825591602001919060010190611a10565b5b808211156105245760008155600101611a2c565b73ffffffffffffffffffffffffffffffffffffffff81168114610a5257600080fd5b60008060408385031215611a7557600080fd5b8235611a8081611a40565b91506020830135611a9081611a40565b809150509250929050565b600060208284031215611aad57600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610b9657600080fd5b60008060408385031215611af057600080fd5b8235611afb81611a40565b946020939093013593505050565b60008083601f840112611b1b57600080fd5b50813567ffffffffffffffff811115611b3357600080fd5b602083019150836020828501011115611b4b57600080fd5b9250929050565b600080600080600060808688031215611b6a57600080fd5b8535611b7581611a40565b94506020860135611b8581611a40565b935060408601359250606086013567ffffffffffffffff811115611ba857600080fd5b611bb488828901611b09565b969995985093965092949392505050565b8015158114610a5257600080fd5b600080600060608486031215611be857600080fd5b8335611bf381611a40565b92506020840135611c0381611a40565b91506040840135611c1381611bc5565b809150509250925092565b600060208284031215611c3057600080fd5b8135610b9681611a40565b60008060008060008060a08789031215611c5457600080fd5b8635611c5f81611a40565b95506020870135611c6f81611a40565b94506040870135611c7f81611a40565b935060608701359250608087013567ffffffffffffffff811115611ca257600080fd5b611cae89828a01611b09565b979a9699509497509295939492505050565b600080600060608486031215611cd557600080fd5b8335611ce081611a40565b92506020840135611cf081611a40565b929592945050506040919091013590565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600067ffffffffffffffff80841115611d4b57611d4b611d01565b604051601f85017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715611d9157611d91611d01565b81604052809350858152868686011115611daa57600080fd5b858560208301376000602087830101525050509392505050565b600060208284031215611dd657600080fd5b813567ffffffffffffffff811115611ded57600080fd5b8201601f81018413611dfe57600080fd5b611e0d84823560208401611d30565b949350505050565b803563ffffffff8116811461154657600080fd5b60008060008060808587031215611e3f57600080fd5b611e4885611e15565b93506020850135611e5881611a40565b92506040850135611e6881611a40565b9396929550929360600135925050565b6000815180845260005b81811015611e9e57602081850181015186830182015201611e82565b81811115611eb0576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610b966020830184611e78565b60008060008060608587031215611f0c57600080fd5b8435611f1781611a40565b935060208501357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff81168114611f4857600080fd5b9250604085013567ffffffffffffffff811115611f6457600080fd5b611f7087828801611b09565b95989497509550505050565b600060208284031215611f8e57600080fd5b5035919050565b60008060008060008060a08789031215611fae57600080fd5b611c5f87611e15565b600060208284031215611fc957600080fd5b8151610b9681611a40565b600181811c90821680611fe857607f821691505b602082108103612021577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600060208083526000845481600182811c91508083168061204957607f831692505b858310810361207f577f4e487b710000000000000000000000000000000000000000000000000000000085526022600452602485fd5b87860183815260200181801561209c57600181146120cb576120f6565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008616825287820196506120f6565b60008b81526020902060005b868110156120f0578154848201529085019089016120d7565b83019750505b50949998505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff80831681851680830382111561216b5761216b612105565b01949350505050565b60006020828403121561218657600080fd5b8151610b9681611bc5565b6000602082840312156121a357600080fd5b5051919050565b600082198211156121bd576121bd612105565b50019056fea164736f6c634300080d000a";

type SampleERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SampleERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SampleERC721__factory extends ContractFactory {
  constructor(...args: SampleERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SampleERC721> {
    return super.deploy(overrides || {}) as Promise<SampleERC721>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SampleERC721 {
    return super.attach(address) as SampleERC721;
  }
  override connect(signer: Signer): SampleERC721__factory {
    return super.connect(signer) as SampleERC721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SampleERC721Interface {
    return new utils.Interface(_abi) as SampleERC721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SampleERC721 {
    return new Contract(address, _abi, signerOrProvider) as SampleERC721;
  }
}
