import { ethers } from 'ethers';

// Function to mimic getMessageHash in Solidity
function getMessageHash(nonce: number, newDeployer: string, approve: boolean): string {
  return ethers.utils.solidityKeccak256(['uint256', 'address', 'bool'], [nonce, newDeployer, approve]);
}

// Function to mimic recoverSigner in Solidity
function recoverSigner(messageHash: string, signature: string): string {
  return ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash), signature);
}

// Example usage
async function testRecoverSigner() {
  const nonce = 1;
  const newDeployer = '0x21Ab3Aa7053A3615E02d4aC517B7075b45BF524f'; // example new deployer address
  const approve = true;

  // Generate the message hash
  const messageHash = getMessageHash(nonce, newDeployer, approve);

  console.log(`Message hash: ${messageHash}`);

  // Example signature (replace with the actual signature to test)
  const signature =
    '0xdd90de226937e62bb2b7b0b65ac1bd0bbf3a0ec0b385d5e73f7b96b5c9664bc1539d72e0151be9fb65d2dbf212c9a15bc12d806b30eaa039bc8da2f23a93ec8c1c';

  // Recover the address from the signature
  const recoveredAddress = recoverSigner(messageHash, signature);
  console.log(`Recovered Address: ${recoveredAddress}`);
}

function decodeSignature(signature: string) {
  if (signature.length !== 132) {
    throw new Error('Invalid signature length');
  }

  const r = signature.substring(0, 66);
  const s = '0x' + signature.substring(66, 130);
  const v = '0x' + signature.substring(130, 132);

  console.log(`r: ${r}`);
  console.log(`s: ${s}`);
  console.log(`v: ${v}`);

  return { r, s, v };
}

testRecoverSigner();
decodeSignature(
  '0xdd90de226937e62bb2b7b0b65ac1bd0bbf3a0ec0b385d5e73f7b96b5c9664bc1539d72e0151be9fb65d2dbf212c9a15bc12d806b30eaa039bc8da2f23a93ec8c1c'
);
