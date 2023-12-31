import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'destinationChainId',
        type: 'uint16',
      },
    ],
    name: 'defaultAppConfig',
    outputs: [
      {
        internalType: 'uint16',
        name: 'inboundProofLibraryVersion',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: 'inboundBlockConfirmations',
        type: 'uint64',
      },
      {
        internalType: 'address',
        name: 'relayer',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'outboundProofType',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: 'outboundBlockConfirmations',
        type: 'uint64',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultSendLibrary',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'destinationChainId',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'outboundProofType',
        type: 'uint16',
      },
    ],
    name: 'dstConfigLookup',
    outputs: [
      {
        internalType: 'uint128',
        name: 'dstNativeAmtCap',
        type: 'uint128',
      },
      {
        internalType: 'uint64',
        name: 'baseGas',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'gasPerByte',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'destinationChainId',
        type: 'uint16',
      },
    ],
    name: 'dstPriceLookup',
    outputs: [
      {
        internalType: 'uint128',
        name: 'dstPriceRatio',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'dstGasPriceInWei',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_dstChainId',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: '_userApplication',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '_payInZRO',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: '_adapterParam',
        type: 'bytes',
      },
    ],
    name: 'estimateFees',
    outputs: [
      {
        internalType: 'uint256',
        name: 'nativeFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'zroFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'destinationChainId',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'userApplicationAddress',
        type: 'address',
      },
    ],
    name: 'getAppConfig',
    outputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'inboundProofLibraryVersion',
            type: 'uint16',
          },
          {
            internalType: 'uint64',
            name: 'inboundBlockConfirmations',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'relayer',
            type: 'address',
          },
          {
            internalType: 'uint16',
            name: 'outboundProofType',
            type: 'uint16',
          },
          {
            internalType: 'uint64',
            name: 'outboundBlockConfirmations',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'oracle',
            type: 'address',
          },
        ],
        internalType: 'struct LayerZeroOverrides.ApplicationConfiguration',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_dstChainId',
        type: 'uint16',
      },
      {
        internalType: 'bytes',
        name: '_destination',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
      {
        internalType: 'address payable',
        name: '_refundAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_zroPaymentAddress',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_adapterParams',
        type: 'bytes',
      },
    ],
    name: 'send',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
])
