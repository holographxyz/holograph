import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'AvailableOperatorJob',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'messageHash',
        type: 'bytes32',
      },
    ],
    name: 'CrossChainMessageSent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
    ],
    name: 'FailedOperatorJob',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'FinishedOperatorJob',
    type: 'event',
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
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'operatorJobExists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'failedJobExists',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
    ],
    name: 'bondUtilityToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'bridgeInRequestPayload',
        type: 'bytes',
      },
    ],
    name: 'crossChainMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'bridgeInRequestPayload',
        type: 'bytes',
      },
    ],
    name: 'executeJob',
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
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'getBondedAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    name: 'getBondedPod',
    outputs: [
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    name: 'getBondedPodIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
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
    inputs: [],
    name: 'getHolograph',
    outputs: [
      {
        internalType: 'address',
        name: 'holograph',
        type: 'address',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: 'jobHash',
        type: 'bytes32',
      },
    ],
    name: 'getJobDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'pod',
            type: 'uint8',
          },
          {
            internalType: 'uint16',
            name: 'blockTimes',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'startBlock',
            type: 'uint40',
          },
          {
            internalType: 'uint64',
            name: 'startTimestamp',
            type: 'uint64',
          },
          {
            internalType: 'uint16[5]',
            name: 'fallbackOperators',
            type: 'uint16[5]',
          },
        ],
        internalType: 'struct OperatorJob',
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
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
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
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'getMessageFee',
    outputs: [
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMessagingModule',
    outputs: [
      {
        internalType: 'address',
        name: 'messagingModule',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMinGasPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'minGasPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
    ],
    name: 'getPodBondAmounts',
    outputs: [
      {
        internalType: 'uint256',
        name: 'base',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'current',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'getPodOperators',
    outputs: [
      {
        internalType: 'address[]',
        name: 'operators',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
    ],
    name: 'getPodOperators',
    outputs: [
      {
        internalType: 'address[]',
        name: 'operators',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pod',
        type: 'uint256',
      },
    ],
    name: 'getPodOperatorsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRegistry',
    outputs: [
      {
        internalType: 'address',
        name: 'registry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalPods',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalPods',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUtilityToken',
    outputs: [
      {
        internalType: 'address',
        name: 'utilityToken',
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
        internalType: 'bytes',
        name: 'bridgeInRequestPayload',
        type: 'bytes',
      },
    ],
    name: 'jobEstimator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'nonRevertingBridgeCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'bridgeInRequestPayload',
        type: 'bytes',
      },
    ],
    name: 'recoverJob',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
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
        name: 'nonce',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'holographableContract',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'bridgeOutPayload',
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
        internalType: 'address',
        name: 'holograph',
        type: 'address',
      },
    ],
    name: 'setHolograph',
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
        name: 'messagingModule',
        type: 'address',
      },
    ],
    name: 'setMessagingModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'minGasPrice',
        type: 'uint256',
      },
    ],
    name: 'setMinGasPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'registry',
        type: 'address',
      },
    ],
    name: 'setRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'utilityToken',
        type: 'address',
      },
    ],
    name: 'setUtilityToken',
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
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'topupUtilityToken',
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
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'unbondUtilityToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
])
