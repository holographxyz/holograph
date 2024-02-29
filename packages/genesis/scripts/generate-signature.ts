import { ethers } from 'ethers';
import { LedgerSigner } from '@ethersproject/hardware-wallets';

async function signApproval(nonce: number, newDeployer: string, approve: boolean, signer: LedgerSigner) {
  const messageHash = ethers.utils.solidityKeccak256(['uint256', 'address', 'bool'], [nonce, newDeployer, approve]);

  const ethSignedMessageHash = ethers.utils.solidityKeccak256(
    ['string', 'bytes32'],
    ['\x19Ethereum Signed Message:\n32', messageHash]
  );

  const signature = await signer.signMessage(ethers.utils.arrayify(ethSignedMessageHash));
  console.log('Signature:', signature);
  return signature;
}

async function main() {
  const nonce = process.env.NONCE; // This should be the next nonce expected by the contract

  if (!nonce) {
    throw new Error(`Nonce is required`);
  }

  const newDeployer = '0x...'; // The address you want to approve or disapprove
  const approve = true; // true to approve, false to disapprove

  // Connect to the Ledger device
  const ledgerSigner = new LedgerSigner(ethers.provider);

  // Generate and output the signature
  await signApproval(parseInt(nonce), newDeployer, approve, ledgerSigner);
}

main();
