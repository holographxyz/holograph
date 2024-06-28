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
const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().min(1, {message: 'Description is required'})
const creatorSchema = z.string().min(1, {message: 'Creator is required'})
const attributesSchema = z.record(z.string())
const ownerSchema = z.string().refine(isAddress, {message: 'Invalid owner address'})
const fileSchema = z.string().url({message: 'Invalid file URL'})
const tokenIdSchema = z.string().refine(tokenId => !isNaN(Number(tokenId)), {message: 'Invalid token id'})
const versionSchema = z.enum([HolographVersion.V1, HolographVersion.V2]).optional()
const ipfsUrlSchema = z.string().url()
const cidSchema = z
  .string()
  .min(46)
  .refine(cid => cid.startsWith('Qm') || cid.startsWith('bafy'), {message: 'Invalid CID'})
const ipfsImageCidSchema = cidSchema
const ipfsMetadataCidSchema = z
  .string()
  .refine(value => (value.includes('Qm') || value.includes('bafy')) && value.endsWith('/metadata.json'), {
    message: 'Invalid metadata',
  })
const imageMetadataSchema = ipfsUrlSchema.or(ipfsImageCidSchema)

const metadataSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  image: imageMetadataSchema.optional(),
  creator: creatorSchema.optional(),
  attributes: attributesSchema.optional(),
})

export const createNFTSchema = z.object({
  contract: contractSchema,
  ipfsMetadataCid: ipfsMetadataCidSchema,
  metadata: metadataSchema,
  version: versionSchema,
})

export const validate = {
  contract: contractSchema,
  openEditionContract: openEditionContractSchema,
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema,
  image: imageMetadataSchema,
  metadata: metadataSchema,
  owner: ownerSchema,
  file: fileSchema,
  tokenId: tokenIdSchema,
  ipfsMetadataCid: ipfsMetadataCidSchema,
  ipfsUrl: ipfsUrlSchema,
  ipfsImageCid: ipfsImageCidSchema,
}

export type CreateNFTSchema = z.infer<typeof createNFTSchema>
export type NFTMetadata = z.infer<typeof metadataSchema>

export type CreateNFT = {
  contract: HolographERC721Contract
  ipfsMetadataCid: string
  metadata: {
    name: string
    description: string
    image?: string
    creator?: string
    attributes?: Record<string, string>
  }
  version?: HolographVersion
}

export type CreateOpenEditionNFT = {
  contract: HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2
  version?: HolographVersion
}

type CheckCreateNFT = CheckTypeIntegrity<CreateNFTSchema, CreateNFT, CreateNFTSchema>

export type HolographNFTMetadata = z.infer<typeof metadataSchema>

export type HolographOpenEditionNFTMetadata = {
  name: string
  description: string
  image?: string
  animation_url?: string
  properties: {
    number: number
    name: string
  }
}

export const DEFAULT_TOKEN_URI = 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/metadata.json'
