import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [],
    name: 'getContractType',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'contractType',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDeploymentBlock',
    outputs: [
      {
        internalType: 'uint256',
        name: 'deploymentBlock',
        type: 'uint256',
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
    name: 'getHolographEnforcer',
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
    inputs: [],
    name: 'getOriginChain',
    outputs: [
      {
        internalType: 'uint32',
        name: 'originChain',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSourceContract',
    outputs: [
      {
        internalType: 'address',
        name: 'sourceContract',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
])
