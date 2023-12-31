import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'usdAmount',
        type: 'uint256',
      },
    ],
    name: 'convertUsdToWei',
    outputs: [
      {
        internalType: 'uint256',
        name: 'weiAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
])
