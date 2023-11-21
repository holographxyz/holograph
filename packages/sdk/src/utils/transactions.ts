import {JsonRpcProvider, TransactionReceipt, TransactionResponse} from 'ethers'

//TODO: implement retry logic
export async function getTransactionReceipt(
  transactionHash: string,
  provider: JsonRpcProvider,
): Promise<TransactionReceipt> {
  const receipt = await provider.getTransactionReceipt(transactionHash) //TODO: check if the implementation of network Monitor should be replicated

  if (receipt === null) {
    throw Error(`Could not get receipt for ${transactionHash}`)
  }
  return receipt
}

export async function getTransaction(
  transactionHash: string,
  provider: JsonRpcProvider,
): Promise<TransactionResponse | null> {
  return await provider.getTransaction(transactionHash)
}
