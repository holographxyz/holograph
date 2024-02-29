/*HOLOGRAPH_LICENSE_HEADER*/

/*SOLIDITY_COMPILER_VERSION*/

import "../HolographGenesis.sol";

contract MockHolographGenesisChild is HolographGenesis {
  constructor() {}

  function approveDeployerMock(
    uint256 nonce,
    address newDeployer,
    bool approve,
    bytes memory sig1,
    bytes memory sig2
  ) external onlyDeployer {
    return this.approveDeployer(nonce, newDeployer, approve, sig1, sig2);
  }

  function isApprovedDeployerMock(address deployer) external view returns (bool) {
    return this.isApprovedDeployer(deployer);
  }
}
