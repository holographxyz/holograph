import {isAddress} from 'viem'
import * as z from 'zod'

import {HolographVersion} from '../utils/types'

const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().min(1, {message: 'Description is required'})
const creatorSchema = z.string().min(1, {message: 'Creator is required'})
const attributesSchema = z.record(z.string())
const ownerSchema = z.string().refine(isAddress, {message: 'Invalid owner address'})
const fileSchema = z.string().url({message: 'Invalid file URL'})
const tokenIdSchema = z.string().refine(tokenId => !isNaN(Number(tokenId)), {message: 'Invalid token id'})
const collectionAddressSchema = z.string().min(1, {message: 'Collection address is required'})
const versionSchema = z.enum([HolographVersion.V1, HolographVersion.V2]).optional()
const ipfsUrlSchema = z.string().url()
const ipfsImageCidSchema = z.string().length(46).startsWith('Qm')
const tokenUriSchema = z.string().min(46).startsWith('Qm')

const ipfsInfoSchema = z
  .object({
    ipfsImageCid: ipfsImageCidSchema,
    ipfsUrl: ipfsUrlSchema.optional(),
  })
  .optional()

const metadataSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema.optional(),
})

export const createNftSchema = z.object({
  metadata: metadataSchema,
  collectionAddress: collectionAddressSchema,
  ipfsInfo: ipfsInfoSchema,
  version: versionSchema,
})

export const validate = {
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema,
  metadata: metadataSchema,
  owner: ownerSchema,
  file: fileSchema,
  tokenId: tokenIdSchema,
  collectionAddress: collectionAddressSchema,
  ipfsUrl: ipfsUrlSchema,
  ipfsImageCid: ipfsImageCidSchema,
  ipfsInfo: ipfsInfoSchema,
  tokenUri: tokenUriSchema,
}

export type CreateNft = z.infer<typeof createNftSchema>

export type HolographNFTMetadata = z.infer<typeof metadataSchema>

export type NftIpfsInfo = z.infer<typeof ipfsInfoSchema>

export const DEFAULT_TOKEN_URI = 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/metadata.json'
