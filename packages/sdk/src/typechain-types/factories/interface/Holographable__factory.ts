/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  Holographable,
  HolographableInterface,
} from "../../interface/Holographable";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint32",
        name: "fromChain",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "bridgeIn",
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
        internalType: "uint32",
        name: "toChain",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "bridgeOut",
    outputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class Holographable__factory {
  static readonly abi = _abi;
  static createInterface(): HolographableInterface {
    return new utils.Interface(_abi) as HolographableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Holographable {
    return new Contract(address, _abi, signerOrProvider) as Holographable;
  }
}