/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  HolographFactoryInterface,
  HolographFactoryInterfaceInterface,
} from "../../interface/HolographFactoryInterface";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "BridgeableContractDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "contractType",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "chainType",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "salt",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "byteCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
        ],
        internalType: "struct DeploymentConfig",
        name: "config",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
        ],
        internalType: "struct Verification",
        name: "signature",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "deployHolographableContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getHolograph",
    outputs: [
      {
        internalType: "address",
        name: "holograph",
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
    inputs: [
      {
        internalType: "address",
        name: "holograph",
        type: "address",
      },
    ],
    name: "setHolograph",
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
] as const;

export class HolographFactoryInterface__factory {
  static readonly abi = _abi;
  static createInterface(): HolographFactoryInterfaceInterface {
    return new utils.Interface(_abi) as HolographFactoryInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HolographFactoryInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as HolographFactoryInterface;
  }
}
