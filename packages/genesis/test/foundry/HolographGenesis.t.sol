// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Test, Vm} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";

import {HolographGenesis} from "../../contracts/HolographGenesis.sol";
import {Mock} from "../../contracts/mock/Mock.sol";

contract HolographGenesisTest is Test {
  // Contracts
  HolographGenesis genesis;
  Mock mock;

  // Addresses
  address zeroAddress = address(0);
  address deployer1 = 0x05439df4FdE744533f006815d79418c8f9C18c24;
  address deployer2 = 0x9b8FF2eAEC61d225D5EE76AeaDa79980ad0C2A8c;

  // Hardcoded deployer addresses (Needs to be same as deployed contract)
  address[5] private deployers = [
    0x05439df4FdE744533f006815d79418c8f9C18c24,
    0x9b8FF2eAEC61d225D5EE76AeaDa79980ad0C2A8c,
    0x2b553be1bC6a8DaA751DFB71Ff6558482cF49698,
    0x0a806a225Bd19321Ea9e9CCc6782381d1c50a8F6,
    0x3a6E8E08F18d48d7057d5930Efe569870bD8D699
  ];

  // address newDeployer = address(0x4); // New deployer to be approved

  function setUp() public {
    vm.recordLogs();
    genesis = new HolographGenesis();
    Vm.Log[] memory entries = vm.getRecordedLogs();
    assertEq(entries.length, 1);
    assertEq(entries[0].topics.length, 1);
    assertEq(entries[0].topics[0], keccak256("Message(string)"));
    assertEq(abi.decode(entries[0].data, (string)), string("The future is Holographic"));
  }

  function testVersion() public {
    assertEq(genesis.getVersion(), 2);
  }

  function testGenesisDeployment() public {
    assertTrue(address(genesis) != zeroAddress, "Address should not be zero");
  }

  function testDeploySuccess() public {
    vm.startPrank(deployer1);
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000001");

    try genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode) {
      // If deployment is successful, the test passes
    } catch {
      fail("Deployment should not revert");
    }
    vm.stopPrank();
  }

  function testDeploySameContractWithDifferentApprovedDeployerHasSameAddress() public {
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000001");

    vm.startPrank(deployer1);

    // Take a snapshot before any deployment
    uint256 snapshotId = vm.snapshot();

    // Start recording logs
    vm.recordLogs();

    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);

    // Grab the logs
    Vm.Log[] memory entries = vm.getRecordedLogs();
    assertEq(entries[0].topics[0], keccak256("ContractDeployed(address)"));
    address firstAddress = abi.decode(entries[0].data, (address));
    vm.stopPrank();

    vm.revertTo(snapshotId);

    vm.startPrank(deployer2);
    vm.recordLogs();
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);
    // Grab the logs
    entries = vm.getRecordedLogs();
    assertEq(entries[0].topics[0], keccak256("ContractDeployed(address)"));
    address secondAddress = abi.decode(entries[0].data, (address));
    assertEq(firstAddress, secondAddress);

    vm.stopPrank();
  }

  function testDeployWithIncorrectChainIdFails() public {
    vm.startPrank(deployer1);
    uint256 chainId = block.chainid + 1;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000001");

    vm.expectRevert("HOLOGRAPH: incorrect chain id");
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);

    vm.stopPrank();
  }

  function testDeploySameContractFails() public {
    vm.startPrank(deployer1);
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000001");
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);

    vm.expectRevert("HOLOGRAPH: already deployed");
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);

    vm.stopPrank();
  }

  function testDeployThrowsIfDeploymentFails() public {
    vm.startPrank(deployer1);
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000001");

    bytes memory badByteCode = new bytes(0);

    vm.expectRevert("HOLOGRAPH: deployment failed");
    genesis.deploy(chainId, salt, secret, badByteCode, initCode);
    vm.stopPrank();
  }

  function testDeployThrowsIfInitFails() public {
    vm.startPrank(deployer1);
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0000000000000000000000000000000000000000000000000000000000000000");

    vm.expectRevert("HOLOGRAPH: initialization failed");
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);
    vm.stopPrank();
  }

  function testDeployWithUnapprovedDeployerFails() public {
    uint256 chainId = block.chainid;
    bytes12 salt = bytes12(hex"000000000000000000000001");
    bytes20 secret = bytes20(hex"87e48a560777ffe6a8b42011e832efa0c4e32851");
    bytes memory initCode = bytes(hex"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd");

    vm.expectRevert("HOLOGRAPH: deployer not approved");
    genesis.deploy(chainId, salt, secret, getMockBytecode(), initCode);
  }

  function testGetApproveDeployerNonce() public {
    vm.startPrank(deployer1);

    // Get the nonce
    uint256 currentNonce = genesis.getApproveDeployerNonce();
    uint256 expectedNonceValue = 0;

    // Check the first nonce
    assertTrue(currentNonce == expectedNonceValue);

    vm.stopPrank();
  }

  function testAllDeployersAreApproved() public {
    for (uint256 i = 0; i < deployers.length; i++) {
      assertTrue(genesis.isApprovedDeployer(deployers[i]), "Deployer not approved");
    }
  }

  function testApproveDeployer() public {
    vm.recordLogs();
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d); // New deployer to be approved
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = true;

    // NOTE: Hardcoded signatures. These are explicitly created and used for tests
    bytes
      memory sig1 = hex"dd90de226937e62bb2b7b0b65ac1bd0bbf3a0ec0b385d5e73f7b96b5c9664bc1539d72e0151be9fb65d2dbf212c9a15bc12d806b30eaa039bc8da2f23a93ec8c1c";
    bytes
      memory sig2 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    // Call approveDeployer function with actual signatures
    genesis.approveDeployer(nonce, newDeployer, approveStatus, sig1, sig2);

    // Verify the approval status
    assertTrue(genesis.isApprovedDeployer(newDeployer), "New deployer should be approved");

    // Get the nonce
    uint256 newNonce = genesis.getApproveDeployerNonce();
    console.log("New Nonce:", newNonce);

    uint256 expectedNonceValue = 1;

    // Check the new nonce
    assertTrue(newNonce == expectedNonceValue);

    vm.stopPrank();

    Vm.Log[] memory entries = vm.getRecordedLogs();
    assertEq(entries.length, 2);
    assertEq(entries[0].topics.length, 1);
    assertEq(entries[0].topics[0], keccak256("Message(string)"));
    assertEq(abi.decode(entries[0].data, (string)), string("The future is Holographic"));

    assertEq(entries[1].topics.length, 1);
    assertEq(entries[1].topics[0], keccak256("Message(string)"));
    assertEq(abi.decode(entries[1].data, (string)), string("HOLOGRAPH: deployer approved"));
  }

  function testDisapproveDeployer() public {
    vm.recordLogs();
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    address deployerToRemove = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d); // New deployer to be approved
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = false;

    // NOTE: Hardcoded signatures. These are explicitly created and used for tests
    bytes
      memory sig1 = hex"bcc159f5eef67ed1f6526b43bc35dd00b07fed45c48c1b86a530ae26c3c30e6030b1a632f4c83847a8b5ded2dc083d54c3122b649e268808b3c07f69187555031b";
    bytes
      memory sig2 = hex"8de94dfa4d54a15499bae3b549637f65f8f961861a8f4cd1c3216b2b08fc4b010a52da6fcca35bcbdc0b165f361527427eb90bd3c42075a5ed9199e5f4eeaeec1b";

    // Call approveDeployer function with actual signatures
    genesis.approveDeployer(nonce, deployerToRemove, approveStatus, sig1, sig2);

    // Verify the approval status
    assertTrue(!genesis.isApprovedDeployer(deployerToRemove), "New deployer should be disapproved");

    // Get the nonce
    uint256 newNonce = nonce;
    console.log("New Nonce:", newNonce);

    uint256 expectedNonceValue = 1;

    // Check that new nonce is the same as the old nonce
    assertTrue(newNonce == expectedNonceValue);

    vm.stopPrank();

    Vm.Log[] memory entries = vm.getRecordedLogs();
    assertEq(entries.length, 2);
    assertEq(entries[0].topics.length, 1);
    assertEq(entries[0].topics[0], keccak256("Message(string)"));
    assertEq(abi.decode(entries[0].data, (string)), string("The future is Holographic"));

    assertEq(entries[1].topics.length, 1);
    assertEq(entries[1].topics[0], keccak256("Message(string)"));
    assertEq(abi.decode(entries[1].data, (string)), string("HOLOGRAPH: deployer disapproved"));
  }

  function testApproveDeployerWithIncorrectNonceFails() public {
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    // First we have to approve the new deployer with the correct nonce
    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d); // New deployer to be approved
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = true;

    // NOTE: Hardcoded signatures. These are explicitly created and used for tests
    bytes
      memory sig1 = hex"dd90de226937e62bb2b7b0b65ac1bd0bbf3a0ec0b385d5e73f7b96b5c9664bc1539d72e0151be9fb65d2dbf212c9a15bc12d806b30eaa039bc8da2f23a93ec8c1c";
    bytes
      memory sig2 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    genesis.approveDeployer(nonce, newDeployer, approveStatus, sig1, sig2);

    uint256 incorrectNonce = 0; // Incorrect nonce

    // Expect the transaction to revert
    vm.expectRevert("HOLOGRAPH: invalid nonce");
    genesis.approveDeployer(incorrectNonce, newDeployer, approveStatus, sig1, sig2);

    vm.stopPrank();
  }

  function testApproveDeployerWithUnapprovedSigner1Fails() public {
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = true;

    // Use the private key of the generated account
    uint256 unapprovedPrivateKey = 0xb1538f8d1eed3f059d8719c58bf4d8d450266022ee773677ccb5f5633d0d8e99; // NOTE: This PK is for testing purposes only!

    // Generate an invalid signature for signer1
    bytes32 message = keccak256(abi.encodePacked(nonce, newDeployer, approveStatus));
    (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(unapprovedPrivateKey, message);
    bytes memory sig1 = abi.encodePacked(r1, s1, v1);

    // NOTE: Hardcoded signatures. These are explicitly created and used for tests
    // Use a valid signature for signer2
    bytes
      memory sig2 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    // Expect the transaction to revert with the specific error
    vm.expectRevert("HOLOGRAPH: signer 1 not approved");
    genesis.approveDeployer(nonce, newDeployer, approveStatus, sig1, sig2);

    vm.stopPrank();
  }

  function testApproveDeployerWithUnapprovedSigner2Fails() public {
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = true;

    // Use the private key of the generated account
    uint256 unapprovedPrivateKey = 0xb1538f8d1eed3f059d8719c58bf4d8d450266022ee773677ccb5f5633d0d8e99; // NOTE: This PK is for testing purposes only!

    // Use a valid signature for signer2
    bytes
      memory sig1 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    // Generate an invalid signature for signer1
    bytes32 message = keccak256(abi.encodePacked(nonce, newDeployer, approveStatus));
    (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(unapprovedPrivateKey, message);
    bytes memory sig2 = abi.encodePacked(r1, s1, v1);

    // Expect the transaction to revert with the specific error
    vm.expectRevert("HOLOGRAPH: signer 2 not approved");
    genesis.approveDeployer(nonce, newDeployer, approveStatus, sig1, sig2);

    vm.stopPrank();
  }

  function testApproveDeployerWithSameSignerFails() public {
    genesis = new HolographGenesis();

    vm.startPrank(deployer1);

    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    uint256 nonce = genesis.getApproveDeployerNonce() + 1;
    bool approveStatus = true;

    // NOTE: Hardcoded signatures. These are explicitly created and used for tests
    // Use a valid signature for signer2
    bytes
      memory sig1 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    bytes
      memory sig2 = hex"2d94d04ec1e9fbe73b671bc7f5e619554d0e6cb879c023d0ce763be6833d320d4f3cc15e2ba776fa0f0ed196acee22075d490562d6d8982ab6a994471f6f1e731c";

    // Expect the transaction to revert with the specific error
    vm.expectRevert("HOLOGRAPH: signatures must be from different deployers");
    genesis.approveDeployer(nonce, newDeployer, approveStatus, sig1, sig2);

    vm.stopPrank();
  }

  function testGetMessageHash() public {
    genesis = new HolographGenesis();

    uint256 nonce = 1; // Example nonce
    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d); // Example new deployer address
    bool approve = true; // Example approval status

    // Expected hash
    bytes32 expectedHash = keccak256(abi.encodePacked(nonce, newDeployer, approve));

    // Get the actual hash from the contract
    bytes32 actualHash = genesis.getMessageHash(nonce, newDeployer, approve);

    // Assert equality
    assertEq(actualHash, expectedHash, "Hashes should match");
  }

  function testFailGetMessageHashWithDifferentInputs() public {
    genesis = new HolographGenesis();

    uint256 nonce1 = 1;
    address newDeployer1 = address(0x123);
    bool approve1 = true;

    uint256 nonce2 = 2; // Different nonce
    address newDeployer2 = address(0x456); // Different deployer
    bool approve2 = false; // Different approval status

    bytes32 hash1 = genesis.getMessageHash(nonce1, newDeployer1, approve1);
    bytes32 hash2 = genesis.getMessageHash(nonce2, newDeployer2, approve2);

    // The test should fail if the two different sets of inputs produce the same hash
    assertEq(hash1, hash2, "Hashes should not match for different inputs");
  }

  function testGetEthSignedMessageHash() public {
    genesis = new HolographGenesis();

    // Create a sample message hash using getMessageHash
    uint256 nonce = 1;
    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    bool approve = true;
    bytes32 messageHash = genesis.getMessageHash(nonce, newDeployer, approve);

    // Expected Ethereum signed message hash
    bytes32 expectedSignedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

    // Get the actual Ethereum signed message hash from the contract
    bytes32 actualSignedHash = genesis.getEthSignedMessageHash(messageHash);

    // Assert equality
    assertEq(actualSignedHash, expectedSignedHash, "Ethereum signed message hashes should match");
  }

  function testFailGetEthSignedMessageHashWithDifferentInputs() public {
    genesis = new HolographGenesis();

    bytes32 messageHash1 = keccak256(abi.encodePacked("message1"));
    bytes32 messageHash2 = keccak256(abi.encodePacked("message2")); // Different message

    bytes32 signedHash1 = genesis.getEthSignedMessageHash(messageHash1);
    bytes32 signedHash2 = genesis.getEthSignedMessageHash(messageHash2);

    // The test should fail if the two different message hashes produce the same Ethereum signed message hash
    assertEq(signedHash1, signedHash2, "Ethereum signed message hashes should not match for different message hashes");
  }

  function testRecoverSigner() public {
    genesis = new HolographGenesis();

    // Use the same nonce, newDeployer, and approve as used for signing
    uint256 nonce = 1;
    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    bool approve = true;

    // NOTE: Hardcoded signature. This is explicitly created and used for tests
    bytes
      memory signature = hex"dd9916acacf1f1ef02e0ff038002875bfe7a9d4c628147c9ab534968d77b0b89422d0109783924586bff87b3d8455e16d26403e74d128577f997a5ae39e3b2131b";

    // Recover the signer
    address recoveredAddress = genesis.recoverSigner(nonce, newDeployer, approve, signature);

    // Address of the signer (public address corresponding to the private key used)
    address signerAddress = 0x6409BDf3a02A7cDee678Da09361F466906a52D65; // NOTE: This address is for testing purposes only!

    // Assert that the recovered address is the signer's address
    assertEq(recoveredAddress, signerAddress, "Recovered address should match the signer's address");
  }

  function testRecoverSignerWithWrongSignatureFails() public {
    genesis = new HolographGenesis();

    // Use the same nonce, newDeployer, and approve as used for signing
    uint256 nonce = 1;
    address newDeployer = address(0x5f5C3548f96C7DA33A18E5F2F2f13519e1c8bD0d);
    bool approve = true;

    // NOTE: Hardcoded signature. This is explicitly created and used for tests
    bytes
      memory signature = hex"dd90de226937e62bb2b7b0b65ac1bd0bbf3a0ec0b385d5e73f7b96b5c9664bc1539d72e0151be9fb65d2dbf212c9a15bc12d806b30eaa039bc8da2f23a93ec8c1c";

    // Recover the signer
    address recoveredAddress = genesis.recoverSigner(nonce, newDeployer, approve, signature);

    // Address of the signer (public address corresponding to the private key used)
    address signerAddress = 0x6409BDf3a02A7cDee678Da09361F466906a52D65; // NOTE: This address is for testing purposes only!

    // Assert that the recovered address is not the signer's address
    assertTrue(
      recoveredAddress != signerAddress,
      "Recovered address should not match the signer's address for an incorrect signature"
    );
  }
}

/*
 * Utility function to get the bytecode of the Mock contract
 */
function getMockBytecode() pure returns (bytes memory) {
  return
    hex"608060405234801561001057600080fd5b50610aae806100206000396000f3fe6080604052600436106100c05760003560e01c8063893d20e811610074578063aa0e09a31161004e578063aa0e09a314610257578063eb66dbcf14610277578063f2fde38b1461028a576100c7565b8063893d20e8146101c057806389a4cac0146102155780638da5cb5b14610242576100c7565b806365fd4772116100a557806365fd4772146101615780636ee4800f1461018e57806382f02b6e146101a1576100c7565b806313af4035146100eb5780634ddf47d41461010b576100c7565b366100c757005b600036818237808136833485545af13d82833e8080156100e5573d83f35b3d83fd5b005b3480156100f757600080fd5b506100e961010636600461083e565b6102aa565b34801561011757600080fd5b5061012b61012636600461088f565b610412565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020015b60405180910390f35b34801561016d57600080fd5b5061018061017c36600461095e565b5490565b604051908152602001610158565b6100e961019c366004610977565b610572565b3480156101ad57600080fd5b506100e96101bc3660046109fa565b9055565b3480156101cc57600080fd5b507fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf772777545b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610158565b34801561022157600080fd5b50610235610230366004610977565b610597565b6040516101589190610a1c565b34801561024e57600080fd5b506101f06105b8565b34801561026357600080fd5b50610235610272366004610977565b6105e7565b6100e9610285366004610977565b610608565b34801561029657600080fd5b506100e96102a536600461083e565b6106be565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a206f776e6572206f6e6c792066756e6374696f6e000060448201526064015b60405180910390fd5b600061038f7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775490565b9050817fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf772777558173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600061043c7f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a015490565b156104a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4d4f434b3a20616c726561647920696e697469616c697a656400000000000000604482015260640161035c565b6000828060200190518101906104b99190610a88565b60018190559050600081806104cd57600191505b50337fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775561051a60017f4e5f991bca30eca2d4643aaefa807e88f96a4a97398933d572a3c0d973004a0155565b801561054957507f12345678000000000000000000000000000000000000000000000000000000009392505050565b507f4ddf47d4000000000000000000000000000000000000000000000000000000009392505050565b808260003760008082600034875af13d6000803e808015610592573d6000f35b3d6000fd5b60608183600037600080836000875afa3d6000803e808015610592573d6000f35b60006105e27fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775490565b905090565b60608183600037600080836000875af43d6000803e808015610592573d6000f35b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610572576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a206f776e6572206f6e6c792066756e6374696f6e0000604482015260640161035c565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf7727775473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610774576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f484f4c4f47524150483a206f776e6572206f6e6c792066756e6374696f6e0000604482015260640161035c565b73ffffffffffffffffffffffffffffffffffffffff81166107f1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f484f4c4f47524150483a207a65726f2061646472657373000000000000000000604482015260640161035c565b7fb56711ba6bd3ded7639fc335ee7524fe668a79d7558c85992e3f8494cf77277755565b803573ffffffffffffffffffffffffffffffffffffffff8116811461083957600080fd5b919050565b60006020828403121561085057600080fd5b61085982610815565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000602082840312156108a157600080fd5b813567ffffffffffffffff808211156108b957600080fd5b818401915084601f8301126108cd57600080fd5b8135818111156108df576108df610860565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190838211818310171561092557610925610860565b8160405282815287602084870101111561093e57600080fd5b826020860160208301376000928101602001929092525095945050505050565b60006020828403121561097057600080fd5b5035919050565b60008060006040848603121561098c57600080fd5b61099584610815565b9250602084013567ffffffffffffffff808211156109b257600080fd5b818601915086601f8301126109c657600080fd5b8135818111156109d557600080fd5b8760208285010111156109e757600080fd5b6020830194508093505050509250925092565b60008060408385031215610a0d57600080fd5b50508035926020909101359150565b600060208083528351808285015260005b81811015610a4957858101830151858201604001528201610a2d565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b600060208284031215610a9a57600080fd5b505191905056fea164736f6c6343000811000a";
}
