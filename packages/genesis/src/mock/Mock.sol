/*HOLOGRAPH_LICENSE_HEADER*/

/*SOLIDITY_COMPILER_VERSION*/

import "../abstract/Initializable.sol";
import "../abstract/Owner.sol";

import "../interface/InitializableInterface.sol";

contract Mock is Initializable, Owner {
  constructor() {}

  function init(bytes memory initPayload) external override returns (bytes4) {
    require(!_isInitialized(), "MOCK: already initialized");
    bytes32 arbitraryData = abi.decode(initPayload, (bytes32));
    bool shouldFail = false;
    assembly {
      // we leave slot 0 available for fallback calls
      sstore(0x01, arbitraryData)
      switch arbitraryData
      case 0 {
        shouldFail := 0x01
      }
      sstore(_ownerSlot, caller())
    }
    _setInitialized();
    if (shouldFail) {
      return bytes4(0x12345678);
    } else {
      return InitializableInterface.init.selector;
    }
  }

  function getStorage(uint256 slot) public view returns (bytes32 data) {
    assembly {
      data := sload(slot)
    }
  }

  function setStorage(uint256 slot, bytes32 data) public {
    assembly {
      sstore(slot, data)
    }
  }

  function mockCall(address target, bytes calldata data) public payable {
    assembly {
      calldatacopy(0, data.offset, data.length)
      let result := call(gas(), target, callvalue(), 0, data.length, 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }

  function mockStaticCall(address target, bytes calldata data) public view returns (bytes memory) {
    assembly {
      calldatacopy(0, data.offset, data.length)
      let result := staticcall(gas(), target, 0, data.length, 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }

  function mockDelegateCall(address target, bytes calldata data) public returns (bytes memory) {
    assembly {
      calldatacopy(0, data.offset, data.length)
      let result := delegatecall(gas(), target, 0, data.length, 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }

  receive() external payable {}

  fallback() external payable {
    assembly {
      calldatacopy(0, 0, calldatasize())
      let result := call(gas(), sload(0), callvalue(), 0, calldatasize(), 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }
}
