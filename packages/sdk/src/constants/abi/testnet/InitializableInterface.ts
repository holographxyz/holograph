import {narrow} from 'abitype'

export default narrow([
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
])
