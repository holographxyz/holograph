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
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
    ],
    name: 'Message',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newDeployer',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approve',
        type: 'bool',
      },
    ],
    name: 'approveDeployer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'bytes12',
        name: 'saltHash',
        type: 'bytes12',
      },
      {
        internalType: 'bytes',
        name: 'sourceCode',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'initCode',
        type: 'bytes',
      },
    ],
    name: 'deploy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'deployer',
        type: 'address',
      },
    ],
    name: 'isApprovedDeployer',
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
])
