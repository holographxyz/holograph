import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    hardhatHolographContractBuilder?: {
      verbose?: boolean;
      runOnCompile?: boolean;
    };
  }

  interface HardhatConfig {
    hardhatHolographContractBuilder: {
      verbose: boolean;
      runOnCompile: boolean;
    };
  }
}
