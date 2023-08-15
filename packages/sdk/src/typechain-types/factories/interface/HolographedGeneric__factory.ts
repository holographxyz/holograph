/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  HolographedGeneric,
  HolographedGenericInterface,
} from "../../interface/HolographedGeneric";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_chainId",
        type: "uint32",
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
        name: "_chainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
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
] as const;

export class HolographedGeneric__factory {
  static readonly abi = _abi;
  static createInterface(): HolographedGenericInterface {
    return new utils.Interface(_abi) as HolographedGenericInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HolographedGeneric {
    return new Contract(address, _abi, signerOrProvider) as HolographedGeneric;
  }
}