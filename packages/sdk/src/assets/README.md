#### TODO: Move this content to our SDK docs website soon

## How to deploy a collection to multiple chains using Holograph SDK 🚀

```typescript
import {
  HolographAccountFactory,
  HolographConfig,
  HolographLegacyCollection,
  HolographMoeERC721DropV2,
  HolographWallet,
} from '@holograph/sdk'
import { Environment } from '@holographxyz/environment'
import { networks } from '@holographxyz/networks'

// 1) Initial configuration setup ⚙️

// Start by setting up your default account using your private key.
const defaultAccount = HolographAccountFactory.createAccountUsingPrivateKey(process.env.PRIVATE_KEY)

// Then, define the configuration including networks and accounts.
const holographConfig: HolographConfig = {
  // You can skip this networks object as long as you set
  // the RPC URLs via environment variables following our naming convention.
  // Check out the environment variables section here (https://docs.holograph.xyz/developer/holograph-sdk/overview). TODO: Update link
  networks: {
    ethereum: 'https://your-ethereum-rpc-url.com', // You can skip this if ETHEREUM_RPC_URL is set in your .env file
    polygon: 'https://your-polygon-rpc-url.com', // You can skip this if POLYGON_RPC_URL is set in your .env file
    avalanche: 'https://your-avalanche-rpc-url.com' // You can skip this if AVALANCHE_RPC_URL is set in your .env file
  },
  environment: Environment.mainnet,
  accounts: {
    default: defaultAccount,
  },
}

// Finally, initialize the wallet with the configured account and rpcs.
const wallet = new HolographWallet({ account: defaultAccount, chainsRpc: holographConfig.networks })

// 2) Create your new collection 🛠️
const myCollection = new HolographLegacyCollection(holographConfig, {
  collectionInfo: {
    name: 'NFTs Without Boundaries',
    description: 'Possibly the most innovative NFT collection yet.',
    symbol: 'HOLO',
    royaltiesBps: 2000, // 20%
    salt: '0x1234567890abcdef',
  },
  primaryChainId: networks.polygon.chain,
})

// 3) Get the deployment signature 🔏
const signatureData = await myCollection.signDeploy(wallet)

// 4) Deploy 🚀
const { collectionAddress, txHash} = await myCollection.deploy(signatureData)

// 5) Wanna to deploy to another chain? 🌐
const avalancheSignatureData = await myCollection.signDeploy(wallet, networks.avalanche.chain)
await myCollection.deploy(avalancheSignatureData)
```

### Congratulations! You've just launched a multi-chain collection! 🎉

### If you want to deploy MOEs (Multi-Chain Open Editions 🖼️), you will be providing a little bit of extra info:

```typescript
// You can use either HolographMoeERC721DropV1 or HolographMoeERC721DropV2 instances
const myCollection = new HolographMoeERC721DropV2(holographConfig, {
  collectionInfo: {
    name: 'NFTs Without Boundaries',
    description: 'Possibly the most innovative NFT collection yet.',
    symbol: 'HOLO',
    royaltiesBps: 2000, // 20%
    salt: '0x1234567890abcdef',
  },
  nftInfo: {
    ipfsUrl: 'ipfs://fileurl.com/file',
    ipfsImageCid: 'QmQJNvXvNqfDAV4srQ8dRr8s4FYBKB67RnWhvWLvE72osu',
  },
  salesConfig: {
    maxSalePurchasePerAddress: 10,
    publicSaleStart: '2025-01-01T00:00:00Z', // It must be in the ISO format
    publicSaleEnd: '2025-01-02T00:00:00Z',
    publicSalePrice: 25, // USD unit
  },
  primaryChainId: networks.polygon.chain,
})
```

### You can also get relevant info about your collection. Here are some examples:

```typescript
const collectionAddress = myCollection.collectionAddress
const deployedChainIds = myCollection.chainIds
const lastTxHash = myCollection.txHash
```

## How to mint an NFT from the collection you've just deployed ⤵️

```typescript
import { NFT } from '@holograph/sdk'

const myNft = new NFT(configObject, {
  collectionAddress: myCollection.collectionAddress,
  metadata: {
    name: 'My new NFT',
    description: 'Probably nothing.',
    creator: 'Holograph Protocol',
  },
  ipfsInfo: {
    ipfsImageCid: 'QmfPiMDcWQNPmJpZ1MKicVQzoo42Jgb2fYFH7PemhXkM32',
  },
})

const { tokenId, txHash } = await myNft.mint({ chainId: networks.polygon.chain, tokenUri: `${myNft.ipfsImageCid}/metadata.json`})

// ps: Here are the differences to mint from an open edition NFT (MOE NFT):
// 1) You'll have to deploy a collection using the HolographMoeERC721DropV2 class
// 2) You'll have to pass the quantity inside the mint method instead of tokenUri:
//    const { tokenId, txHash } = await myNft.mint({ quantity: 2 })
```
