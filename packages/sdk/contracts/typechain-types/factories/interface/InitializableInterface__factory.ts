/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  InitializableInterface,
  InitializableInterfaceInterface,
} from "../../interface/InitializableInterface";

const _abi = [
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
] as const;

export class InitializableInterface__factory {
  static readonly abi = _abi;
  static createInterface(): InitializableInterfaceInterface {
    return new utils.Interface(_abi) as InitializableInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InitializableInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as InitializableInterface;
  }
}
