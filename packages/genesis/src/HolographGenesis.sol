/*HOLOGRAPH_LICENSE_HEADER*/

/*SOLIDITY_COMPILER_VERSION*/

import "./interface/InitializableInterface.sol";

/**
 * @dev In the beginning there was a smart contract...
 */
contract HolographGenesis {
  mapping(address => bool) private _approvedDeployers;

  event Message(string message);

  modifier onlyDeployer() {
    require(_approvedDeployers[msg.sender], "HOLOGRAPH: deployer not approved");
    _;
  }

  constructor() {
    _approvedDeployers[tx.origin] = true;
    emit Message("The future of NFTs is Holograph.");
  }

  function deploy(
    uint256 chainId,
    bytes12 saltHash,
    bytes memory sourceCode,
    bytes memory initCode
  ) external onlyDeployer {
    require(chainId == block.chainid, "HOLOGRAPH: incorrect chain id");
    bytes32 salt = bytes32(abi.encodePacked(msg.sender, saltHash));
    address contractAddress = address(
      uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(sourceCode)))))
    );
    require(!_isContract(contractAddress), "HOLOGRAPH: already deployed");
    assembly {
      contractAddress := create2(0, add(sourceCode, 0x20), mload(sourceCode), salt)
    }
    require(_isContract(contractAddress), "HOLOGRAPH: deployment failed");
    require(
      InitializableInterface(contractAddress).init(initCode) == InitializableInterface.init.selector,
      "HOLOGRAPH: initialization failed"
    );
  }

  function approveDeployer(address newDeployer, bool approve) external onlyDeployer {
    _approvedDeployers[newDeployer] = approve;
  }

  function isApprovedDeployer(address deployer) external view returns (bool) {
    return _approvedDeployers[deployer];
  }

  function _isContract(address contractAddress) internal view returns (bool) {
    bytes32 codehash;
    assembly {
      codehash := extcodehash(contractAddress)
    }
    return (codehash != 0x0 && codehash != 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470);
  }
}
