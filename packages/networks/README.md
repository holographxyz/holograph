<div align="center">
  <a href="https://holograph.xyz"><img alt="Holograph" src="https://user-images.githubusercontent.com/21043504/188220186-9c7f55e0-143a-41b4-a6b8-90e8bd54bfd9.png" width=600></a>
  <br />
  <h1>Holograph Protocol - Network Configurations</h1>
</div>
<p align="center">
</p>

## Description

The Holograph Protocol works with a specific set of EVM blockchains, requires certain configurations, and uses proprietary chain IDs.
This package helps to access all those variable conveniently.

## Development

### Getting Started

1. Install package with `npm i @holographxyz/networks`
1. Using the package:
   - **TypeScript**: `import { networks } from '@holographxyz/networks'`
   - **JavaScript**: `const { networks } = require('@holographxyz/networks');`
1. The package also includes type definitions for: `NetworkType`, `Network`, and `Networks`.

### RPC Endpoints

Every network is defined with a network name key inside of the `networks` object. Each network has a default RPC endpoint listed under `rpc`. You can override the detault value via environment variables.
Environment variables are loaded from the `.env` file of your project/repo. The environment variables that are being queried is shown in the [`sample.env`](./sample.env) file.
