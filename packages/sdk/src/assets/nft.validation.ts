import {isAddress} from 'viem'
import * as z from 'zod'

import {HolographERC721Contract} from './holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from './holograph-open-edition-erc721-contract'
import {CheckTypeIntegrity, HolographVersion} from '../utils/types'

const openEditionContractSchema = z
  .instanceof(HolographOpenEditionERC721ContractV1)
  .or(z.instanceof(HolographOpenEditionERC721ContractV2))
const contractSchema = z.instanceof(HolographERC721Contract)
const ownerSchema = z.string().refine(isAddress, {message: 'Invalid owner address'})
const fileSchema = z.string().url({message: 'Invalid file URL'})
const tokenIdSchema = z.string().refine(tokenId => !isNaN(Number(tokenId)), {message: 'Invalid token id'})
const versionSchema = z.enum([HolographVersion.V1, HolographVersion.V2]).optional()
const ipfsMetadataCidSchema = z
  .string()
  .refine(value => (value.includes('Qm') || value.includes('bafy')) && value.endsWith('/metadata.json'), {
    message: 'Invalid metadata',
  })

export const createNFTSchema = z.object({
  contract: contractSchema,
  ipfsMetadataCid: ipfsMetadataCidSchema,
  version: versionSchema,
})

export const validate = {
  contract: contractSchema,
  openEditionContract: openEditionContractSchema,
  owner: ownerSchema,
  file: fileSchema,
  tokenId: tokenIdSchema,
  ipfsMetadataCid: ipfsMetadataCidSchema,
}

export type CreateNFTSchema = z.infer<typeof createNFTSchema>

export type CreateNFT = {
  contract: HolographERC721Contract
  ipfsMetadataCid: string
  version?: HolographVersion
}

export type CreateOpenEditionNFT = {
  contract: HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2
  version?: HolographVersion
}

type CheckCreateNFT = CheckTypeIntegrity<CreateNFTSchema, CreateNFT, CreateNFTSchema>

export const DEFAULT_TOKEN_URI = 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/metadata.json'
