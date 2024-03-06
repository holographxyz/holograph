import {isAddress} from 'viem'
import * as z from 'zod'

const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().min(1, {message: 'Description is required'})
const creatorSchema = z.string().min(1, {message: 'Creator is required'})
const attributesSchema = z.record(z.string())
const ownerSchema = z.string().refine(isAddress, {message: 'Invalid owner address'})
const fileSchema = z.string().url({message: 'Invalid file URL'})
const tokenIdSchema = z.string().refine(tokenId => !isNaN(Number(tokenId)), {message: 'Invalid token id'})
const chainIdSchema = z.coerce.number().gt(0, {message: 'Invalid chain id'})

const metadataSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema.optional(),
})

export type HolographNFTMetadata = z.infer<typeof metadataSchema>

export const validate = {
  name: nameSchema,
  description: descriptionSchema,
  creator: creatorSchema,
  attributes: attributesSchema,
  metadata: metadataSchema,
  owner: ownerSchema,
  file: fileSchema,
  tokenId: tokenIdSchema,
  chainId: chainIdSchema,
}
