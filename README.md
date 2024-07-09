<p align="center">
  <a href="https://holograph.xyz">
    <img src="https://www.holograph.xyz/icon.jpg" alt="Holograph logo"  />
  </a>
</p>

<h1 align="center">Holograph SDK: Tokenize your app</h1>
<br />

<p align="center">
  <a href="https://twitter.com/holographxyz">
    <img alt="X" src="https://img.shields.io/twitter/follow/:holographxyz.svg?style=social&label=@:holographxyz"/>
  </a>
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@holographxyz/sdk.svg?style=flat"/>
   <a href="https://npmjs.org/package/@holographxyz/sdk">
    <img alt="Version" src="https://img.shields.io/npm/v/@holographxyz/sdk"/>
  </a>
  <img alt="Github Stars" src="https://badgen.net/github/stars/holographxyz/holograph" />
  <img alt="Bundle Size" src="https://badgen.net/bundlephobia/minzip/@holographxyz/sdk"/>
  <img alt="MIT License" src="https://img.shields.io/npm/l/@holographxyz/sdk"/>
</p>

<br />

Holograph provides developers with the flexibility to create a diverse range of tokens, from standard fungible and non-fungible tokens to custom tokens for unique use cases. It also enables the seamless expansion of existing tokens across different chains. With the Holograph SDK, developers can efficiently create, deploy, mint, and bridge omnichain tokens, facilitating the integration of these mechanisms into their own applications.

## Table of contents

- 📋 [Documentation](#documentation)
- 📦 [Installation](#installation)
- 💻 [Usage](#usage)
- 📚 [Tutorials](#tutorials)
- 📝 [Contributing](#contributing)
- ⚖️ [License](#license)

## Documentation

Check out our [documentation](https://docs.holograph.xyz/developer/sdk/quickstart-setup) site for more details on how to use Holograph SDK.

## Installation

To use Holograph SDK, all you need to do is install the
`@holographxyz/sdk` package and its peer dependencies:

```sh
# with pnpm
$ pnpm add @holographxyz/sdk @holographxyz/networks @holographxyz/environment

# with npm
$ npm i @holographxyz/sdk @holographxyz/networks @holographxyz/environment

# with Yarn
$ yarn add @holographxyz/sdk @holographxyz/networks @holographxyz/environment

# with Bun
$ bun add @holographxyz/sdk @holographxyz/networks @holographxyz/environment
```

## Usage

To deploy your first contract, you can use the following code snippet:

1. Set up your Holograph SDK configuration:

```ts title="config.ts"
import { Config, HolographAccountFactory } from "@holographxyz/sdk";
import { Environment } from "@holographxyz/environment";

const defaultAccount = HolographAccountFactory.createAccountUsingPrivateKey(
  process.env.PRIVATE_KEY
);

const holographConfig = Config.getInstance({
  networks: {
    ethereum: "https://your-ethereum-rpc-url.com",
    polygon: "https://your-polygon-rpc-url.com",
    avalanche: "https://your-avalanche-rpc-url.com",
  },
  environment: Environment.mainnet,
  accounts: {
    default: defaultAccount,
  },
});

export const wallet = new HolographWallet({
  account: defaultAccount,
});
```

2. Deploy your very first contract:

```ts
import { HolographERC721Contract } from "@holographxyz/sdk";
import { networks } from "@holographxyz/networks";

import { wallet } from "./config";

const myContract = new HolographERC721Contract({
  contractInfo: {
    name: "Holograph",
    symbol: "HOLO",
  },
  primaryChainId: networks.polygon.chain,
});

const signatureData = await myContract.signDeploy(wallet);
const { contractAddress, txHash } = await myContract.deploy(signatureData);

// Deploying on other chains
const avalancheSignatureData = await myContract.signDeploy(
  wallet,
  networks.avalanche.chain
);
await myContract.deploy(avalancheSignatureData);
```

More guides on how to get started are available
[here](https://docs.holograph.xyz/developer/sdk/quickstart-setup)

## Tutorials

- Deploying Contracts: https://docs.holograph.xyz/developer/sdk/deploying-contracts
- Minting Tokens: https://docs.holograph.xyz/developer/sdk/minting-tokens
- Bridging Tokens: https://docs.holograph.xyz/developer/sdk/bridging-tokens

## Contributing

Feel like contributing? That's awesome!

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## License

MIT © [Holograph](https://github.com/holographxyz/holograph/blob/main/packages/sdk/LICENSE.md)
