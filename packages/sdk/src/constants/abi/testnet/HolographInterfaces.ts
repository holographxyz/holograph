import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'admin',
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
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'adminCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'imageURL',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'externalLink',
        type: 'string',
      },
      {
        internalType: 'uint16',
        name: 'bps',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAdmin',
    outputs: [
      {
        internalType: 'address',
        name: 'adminAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ChainIdType',
        name: 'fromChainType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'fromChainId',
        type: 'uint256',
      },
      {
        internalType: 'enum ChainIdType',
        name: 'toChainType',
        type: 'uint8',
      },
    ],
    name: 'getChainId',
    outputs: [
      {
        internalType: 'uint256',
        name: 'toChainId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum TokenUriType',
        name: 'uriType',
        type: 'uint8',
      },
    ],
    name: 'getUriPrepend',
    outputs: [
      {
        internalType: 'string',
        name: 'prepend',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'initPayload',
        type: 'bytes',
      },
    ],
    name: 'init',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'adminAddress',
        type: 'address',
      },
    ],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum InterfaceType',
        name: 'interfaceType',
        type: 'uint8',
      },
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ChainIdType',
        name: 'fromChainType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'fromChainId',
        type: 'uint256',
      },
      {
        internalType: 'enum ChainIdType',
        name: 'toChainType',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'toChainId',
        type: 'uint256',
      },
    ],
    name: 'updateChainIdMap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ChainIdType[]',
        name: 'fromChainType',
        type: 'uint8[]',
      },
      {
        internalType: 'uint256[]',
        name: 'fromChainId',
        type: 'uint256[]',
      },
      {
        internalType: 'enum ChainIdType[]',
        name: 'toChainType',
        type: 'uint8[]',
      },
      {
        internalType: 'uint256[]',
        name: 'toChainId',
        type: 'uint256[]',
      },
    ],
    name: 'updateChainIdMaps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum InterfaceType',
        name: 'interfaceType',
        type: 'uint8',
      },
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
      {
        internalType: 'bool',
        name: 'supported',
        type: 'bool',
      },
    ],
    name: 'updateInterface',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum InterfaceType',
        name: 'interfaceType',
        type: 'uint8',
      },
      {
        internalType: 'bytes4[]',
        name: 'interfaceIds',
        type: 'bytes4[]',
      },
      {
        internalType: 'bool',
        name: 'supported',
        type: 'bool',
      },
    ],
    name: 'updateInterfaces',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum TokenUriType',
        name: 'uriType',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'prepend',
        type: 'string',
      },
    ],
    name: 'updateUriPrepend',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum TokenUriType[]',
        name: 'uriTypes',
        type: 'uint8[]',
      },
      {
        internalType: 'string[]',
        name: 'prepends',
        type: 'string[]',
      },
    ],
    name: 'updateUriPrepends',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
])
