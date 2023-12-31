import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'encodedSignature',
        type: 'bytes',
      },
    ],
    name: 'callExternalFn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
])
