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
    inputs: [],
    name: 'getBridge',
    outputs: [
      {
        internalType: 'address',
        name: 'bridge',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'chainId',
        type: 'uint32',
      },
    ],
    name: 'getGasParameters',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'msgBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'msgGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minGasPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxGasLimit',
            type: 'uint256',
          },
        ],
        internalType: 'struct GasParameters',
        name: 'gasParameters',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'toChain',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'gasLimit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gasPrice',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'crossChainPayload',
        type: 'bytes',
      },
    ],
    name: 'getHlgFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'hlgFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getInterfaces',
    outputs: [
      {
        internalType: 'address',
        name: 'interfaces',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLZEndpoint',
    outputs: [
      {
        internalType: 'address',
        name: 'lZEndpoint',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'toChain',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'gasLimit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gasPrice',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'crossChainPayload',
        type: 'bytes',
      },
    ],
    name: 'getMessageFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'hlgFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'msgFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dstGasPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOperator',
    outputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOptimismGasPriceOracle',
    outputs: [
      {
        internalType: 'address',
        name: 'optimismGasPriceOracle',
        type: 'address',
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
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
      {
        internalType: 'bytes',
        name: '_srcAddress',
        type: 'bytes',
      },
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
      {
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: 'toChain',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'msgValue',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'crossChainPayload',
        type: 'bytes',
      },
    ],
    name: 'send',
    outputs: [],
    stateMutability: 'payable',
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
        internalType: 'address',
        name: 'bridge',
        type: 'address',
      },
    ],
    name: 'setBridge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32[]',
        name: 'chainIds',
        type: 'uint32[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'msgBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'msgGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minGasPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxGasLimit',
            type: 'uint256',
          },
        ],
        internalType: 'struct GasParameters[]',
        name: 'gasParameters',
        type: 'tuple[]',
      },
    ],
    name: 'setGasParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'chainId',
        type: 'uint32',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'msgBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'msgGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobBaseGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'jobGasPerByte',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minGasPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxGasLimit',
            type: 'uint256',
          },
        ],
        internalType: 'struct GasParameters',
        name: 'gasParameters',
        type: 'tuple',
      },
    ],
    name: 'setGasParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'interfaces',
        type: 'address',
      },
    ],
    name: 'setInterfaces',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lZEndpoint',
        type: 'address',
      },
    ],
    name: 'setLZEndpoint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'optimismGasPriceOracle',
        type: 'address',
      },
    ],
    name: 'setOptimismGasPriceOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
])
