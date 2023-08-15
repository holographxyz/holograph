<div align="center">
  <a href="https://holograph.xyz"><img alt="Holograph" src="https://user-images.githubusercontent.com/21043504/188220186-9c7f55e0-143a-41b4-a6b8-90e8bd54bfd9.png" width=600></a>
  <br />
  <h1>Holograph Protocol - Environment Configurations</h1>
</div>
<p align="center">
</p>

## Description

The Holograph Protocol has different builds for different development environment types.
This package helps to easily declare the current environment.

## Development

### Getting Started

1. Install package with `npm i @holographxyz/environment`
1. Using the package:
   - **TypeScript**: `import { getEnvironment } from '@holographxyz/environment'`
   - **JavaScript**: `const { getEnvironment } = require('@holographxyz/environment');`
1. The package also includes type definitions for: `Environment`.

### Defining Environment

You can easily define your current environment by including `HOLOGRAPH_ENVIRONMENT` in your `.env` file, or using a branch name with the same name as the environment.
