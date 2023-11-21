import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [],
    name: 'config',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IMetadataRenderer',
            name: 'metadataRenderer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'editionSize',
            type: 'uint64',
          },
          {
            internalType: 'uint16',
            name: 'royaltyBPS',
            type: 'uint16',
          },
          {
            internalType: 'address payable',
            name: 'fundsRecipient',
            type: 'address',
          },
        ],
        internalType: 'struct Configuration',
        name: 'config',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
])
