import {narrow} from 'abitype'

export default narrow([
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'Access_MissingRoleOrAdmin',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Access_OnlyAdmin',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Access_WithdrawNotAllowed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposedAddress',
        type: 'address',
      },
    ],
    name: 'Admin_InvalidUpgradeAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Admin_UnableToFinalizeNotOpenEdition',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExternalMetadataRenderer_CallFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketFilterDAOAddressNotSupportedForChain',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintFee_FundsSendFailure',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Mint_SoldOut',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'OperatorNotAllowed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Presale_Inactive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Presale_MerkleNotApproved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Presale_TooManyForAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Purchase_TooManyForAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'correctPrice',
        type: 'uint256',
      },
    ],
    name: 'Purchase_WrongPrice',
    type: 'error',
  },
  {
    inputs: [],
    name: 'RemoteOperatorFilterRegistryCallFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Sale_Inactive',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'maxRoyaltyBPS',
        type: 'uint16',
      },
    ],
    name: 'Setup_RoyaltyPercentageTooHigh',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Withdraw_FundsSendFailure',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'changedBy',
        type: 'address',
      },
    ],
    name: 'FundsRecipientChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawnBy',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawnTo',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
    ],
    name: 'FundsWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mintFeeAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'mintFeeRecipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    name: 'MintFeePayout',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numberOfMints',
        type: 'uint256',
      },
    ],
    name: 'OpenMintFinalized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstPurchasedTokenId',
        type: 'uint256',
      },
    ],
    name: 'Sale',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'changedBy',
        type: 'address',
      },
    ],
    name: 'SalesConfigChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IMetadataRenderer',
        name: 'renderer',
        type: 'address',
      },
    ],
    name: 'UpdatedMetadataRenderer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
    ],
    name: 'adminMint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'to',
        type: 'address[]',
      },
    ],
    name: 'adminMintAirdrop',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isAdmin',
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
        internalType: 'address',
        name: 'minter',
        type: 'address',
      },
    ],
    name: 'mintedPerAddress',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'totalMints',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'presaleMints',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'publicMints',
            type: 'uint256',
          },
        ],
        internalType: 'struct AddressMintDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
    ],
    name: 'purchase',
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
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxQuantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]',
      },
    ],
    name: 'purchasePresale',
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
    inputs: [],
    name: 'saleDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'publicSaleActive',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'presaleActive',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'publicSalePrice',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'publicSaleStart',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'publicSaleEnd',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'presaleStart',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'presaleEnd',
            type: 'uint64',
          },
          {
            internalType: 'bytes32',
            name: 'presaleMerkleRoot',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'maxSalePurchasePerAddress',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxSupply',
            type: 'uint256',
          },
        ],
        internalType: 'struct SaleDetails',
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
        internalType: 'contract IMetadataRenderer',
        name: 'newRenderer',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'setupRenderer',
        type: 'bytes',
      },
    ],
    name: 'setMetadataRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint104',
        name: 'publicSalePrice',
        type: 'uint104',
      },
      {
        internalType: 'uint32',
        name: 'maxSalePurchasePerAddress',
        type: 'uint32',
      },
      {
        internalType: 'uint64',
        name: 'publicSaleStart',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'publicSaleEnd',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'presaleStart',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'presaleEnd',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: 'presaleMerkleRoot',
        type: 'bytes32',
      },
    ],
    name: 'setSaleConfiguration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
])
