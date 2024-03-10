import {Hex} from 'viem'
import * as z from 'zod'

import {generateRandomSalt} from '../utils/helpers'
import {TokenType} from '../utils/types'

const nameSchema = z.string().min(1, {message: 'Name is required'})
const symbolSchema = z
  .string()
  .min(1, {message: 'Symbol is required'})
  .transform(s => s.toUpperCase())
const royaltiesBpsSchema = z.number().int().min(0).max(10000).default(0)
const saltSchema = z
  .string()
  .min(1, {
    message: 'Salt is required',
  })
  .default(generateRandomSalt())
  .transform(salt => salt as Hex)
const tokenTypeSchema = z.enum([TokenType.ERC721, TokenType.ERC1155]).default(TokenType.ERC721)
const primaryChainIdSchema = z.number().int().min(1)

export const collectionInfoSchema = z.object({
  name: nameSchema,
  symbol: symbolSchema,
  tokenType: tokenTypeSchema,
  royaltiesBps: royaltiesBpsSchema,
  salt: saltSchema,
})

export const createLegacyCollectionSchema = z.object({
  collectionInfo: collectionInfoSchema,
  primaryChainId: primaryChainIdSchema,
})

export const validate = {
  name: nameSchema,
  symbol: symbolSchema,
  tokenType: tokenTypeSchema,
  royaltiesBps: royaltiesBpsSchema,
  salt: saltSchema,
}
