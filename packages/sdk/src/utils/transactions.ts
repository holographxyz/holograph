import {JsonRpcProvider} from '@ethersproject/providers'
import {TransactionReceipt, TransactionResponse} from '@ethersproject/abstract-provider'

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

export async function getTransaction(transactionHash: string, provider: JsonRpcProvider): Promise<TransactionResponse> {
  return await provider.getTransaction(transactionHash)
}
