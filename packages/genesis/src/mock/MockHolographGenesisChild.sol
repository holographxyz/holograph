/*HOLOGRAPH_LICENSE_HEADER*/

/*SOLIDITY_COMPILER_VERSION*/

import "../HolographGenesis.sol";

contract MockHolographGenesisChild is HolographGenesis {
  constructor() {}

  function approveDeployerMock(address newDeployer, bool approve) external onlyDeployer {
    return this.approveDeployer(newDeployer, approve);
  }

  function isApprovedDeployerMock(address deployer) external view returns (bool) {
    return this.isApprovedDeployer(deployer);
  }
}
