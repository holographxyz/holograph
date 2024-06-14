import {isAddress} from 'viem'
import * as z from 'zod'

import {HolographERC721Contract} from './holograph-erc721-contract'
import {
  HolographOpenEditionERC721ContractV1,
  HolographOpenEditionERC721ContractV2,
} from './holograph-open-edition-erc721-contract'
import {CheckTypeIntegrity, HolographVersion} from '../utils/types'

const contractSchema = z
  .instanceof(HolographERC721Contract)
  .or(z.instanceof(HolographOpenEditionERC721ContractV1))
  .or(z.instanceof(HolographOpenEditionERC721ContractV2))
const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().min(1, {message: 'Description is required'})
const creatorSchema = z.string().min(1, {message: 'Creator is required'})
const attributesSchema = z.record(z.string())
const ownerSchema = z.string().refine(isAddress, {message: 'Invalid owner address'})
const fileSchema = z.string().url({message: 'Invalid file URL'})
const tokenIdSchema = z.string().refine(tokenId => !isNaN(Number(tokenId)), {message: 'Invalid token id'})
const versionSchema = z.enum([HolographVersion.V1, HolographVersion.V2]).optional()
const ipfsUrlSchema = z.string().url()
const ipfsImageCidSchema = z.string().length(46).startsWith('Qm')
const ipfsMetadataCidSchema = z.string().min(46).startsWith('Qm')

const ipfsInfoSchema = z
  .object({
    ipfsImageCid: ipfsImageCidSchema,
    ipfsMetadataCid: ipfsMetadataCidSchema,
    ipfsUrl: ipfsUrlSchema.optional(),
  })
  .optional()

const metadataSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema.optional(),
})

export const createNFTSchema = z.object({
  contract: contractSchema,
  ipfsInfo: ipfsInfoSchema,
  metadata: metadataSchema,
  version: versionSchema,
})

export const validate = {
  contract: contractSchema,
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema,
  metadata: metadataSchema,
  owner: ownerSchema,
  file: fileSchema,
  tokenId: tokenIdSchema,
  ipfsMetadataCid: ipfsMetadataCidSchema,
  ipfsUrl: ipfsUrlSchema,
  ipfsImageCid: ipfsImageCidSchema,
  ipfsInfo: ipfsInfoSchema,
}

export type CreateNFTSchema = z.infer<typeof createNFTSchema>
export type NFTMetadata = z.infer<typeof metadataSchema>
export type IpfsInfo = z.infer<typeof ipfsInfoSchema>

export type CreateNFT = {
  contract: HolographERC721Contract | HolographOpenEditionERC721ContractV1 | HolographOpenEditionERC721ContractV2
  ipfsInfo?: IpfsInfo
  metadata: NFTMetadata
  version?: HolographVersion
}

type CheckCreateNFT = CheckTypeIntegrity<CreateNFTSchema, CreateNFT, CreateNFTSchema>

export type HolographNFTMetadata = z.infer<typeof metadataSchema>

export type NFTIpfsInfo = z.infer<typeof ipfsInfoSchema>

export const DEFAULT_TOKEN_URI = 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/metadata.json'
