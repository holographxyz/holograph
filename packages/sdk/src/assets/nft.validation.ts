import {isAddress} from 'viem'
import * as z from 'zod'

import {HolographLegacyCollection} from './collection-legacy'
import {HolographMoeERC721DropV1, HolographMoeERC721DropV2} from './collection-moe'
import {CheckTypeIntegrity, HolographVersion} from '../utils/types'

const collectionSchema = z
  .instanceof(HolographLegacyCollection)
  .or(z.instanceof(HolographMoeERC721DropV1))
  .or(z.instanceof(HolographMoeERC721DropV2))
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
  collection: collectionSchema,
  ipfsInfo: ipfsInfoSchema,
  metadata: metadataSchema,
  version: versionSchema,
})

export const validate = {
  collection: collectionSchema,
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

export type CreateNFT = {
  collection: HolographLegacyCollection | HolographMoeERC721DropV1 | HolographMoeERC721DropV2
  ipfsInfo?: {
    ipfsImageCid: string
    ipfsMetadataCid: string
    ipfsUrl?: string
  }
  metadata: {
    name: string
    description: string
    creator: string
    attributes?: Record<string, string>
  }
  version?: HolographVersion
}

type CheckCreateLegacyCollectionType = CheckTypeIntegrity<CreateNFTSchema, CreateNFT, CreateNFTSchema>

export type HolographNFTMetadata = z.infer<typeof metadataSchema>

export type NFTIpfsInfo = z.infer<typeof ipfsInfoSchema>

export const DEFAULT_TOKEN_URI = 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/metadata.json'
