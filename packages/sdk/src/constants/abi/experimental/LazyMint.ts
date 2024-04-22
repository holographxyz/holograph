import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'BatchMintInvalidBatchId',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMintInvalidTokenId',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'batchId',
        type: 'uint256',
      },
    ],
    name: 'BatchMintMetadataFrozen',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LazyMintInvalidAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LazyMintUnauthorized',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'MetadataFrozen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'startTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'baseURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'encryptedBaseURI',
        type: 'bytes',
      },
    ],
    name: 'TokensLazyMinted',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'batchFrozen',
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
    inputs: [],
    name: 'getBaseURICount',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'getBatchIdAtIndex',
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
])
