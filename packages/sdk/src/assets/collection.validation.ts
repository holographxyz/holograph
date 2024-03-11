import {Hex} from 'viem'
import * as z from 'zod'

import {generateRandomSalt, getAddressTypeSchema} from '../utils/helpers'
import {TokenType} from '../utils/types'

const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().optional()
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

const publicSalePriceSchema = z.number().int().min(0)
const maxSalePurchasePerAddressSchema = z.number().int().min(1, {message: 'Must be at least 1'})
const publicSaleStartSchema = z.string().datetime()
const publicSaleEndSchema = z.string().datetime()
const presaleStartSchema = z.string().datetime().optional()
const presaleEndSchema = z.string().datetime().optional()
const presaleMerkleRootSchema = z
  .string()
  .optional()
  .default('0x0000000000000000000000000000000000000000000000000000000000000000')

const nftIpfsUrlSchema = z.string().url().startsWith('ipfs://')
const nftIpfsImageCidSchema = z.string().length(46).startsWith('Qm')

export const holographMoeSaleConfigSchema = z.object({
  publicSalePrice: publicSalePriceSchema,
  maxSalePurchasePerAddress: maxSalePurchasePerAddressSchema,
  publicSaleStart: publicSaleStartSchema,
  publicSaleEnd: publicSaleEndSchema,
  presaleStart: presaleStartSchema,
  presaleEnd: presaleEndSchema,
  presaleMerkleRoot: presaleMerkleRootSchema,
})

export const collectionInfoSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  symbol: symbolSchema,
  tokenType: tokenTypeSchema,
  royaltiesBps: royaltiesBpsSchema,
  salt: saltSchema,
})

export const nftInfoSchema = z.object({
  ipfsUrl: nftIpfsUrlSchema,
  ipfsImageCid: nftIpfsImageCidSchema,
})

export const createLegacyCollectionSchema = z.object({
  collectionInfo: collectionInfoSchema,
  primaryChainId: primaryChainIdSchema,
})

export const createHolographMoeSchema = z.object({
  collectionInfo: collectionInfoSchema,
  nftInfo: nftInfoSchema,
  primaryChainId: primaryChainIdSchema,
  saleConfig: holographMoeSaleConfigSchema,
})

export const holographDropERC721InitCodeV2ParamsSchema = z.object({
  contractType: z.string(),
  registryAddress: getAddressTypeSchema('registry'),
  initialOwner: getAddressTypeSchema('Initial owner'),
  fundsRecipient: getAddressTypeSchema('Funds recipient'),
  numOfEditions: z.number().int().min(0),
  royaltyBps: royaltiesBpsSchema,
  salesConfigArray: z.array(z.union([z.number(), z.string()])),
  metadataRendererAddress: getAddressTypeSchema('Metadata renderer'),
  metadataRendererInitCode: z.string(),
})

export const holographDropERC721InitCodeV1ParamsSchema = holographDropERC721InitCodeV2ParamsSchema.merge(
  z.object({
    erc721TransferHelper: getAddressTypeSchema('ERC721 transfer helper'),
    marketFilterAddress: getAddressTypeSchema('Market filter'),
    enableOpenSeaRoyaltyRegistry: z.boolean().default(false),
  }),
)

export const holographERC721InitCodeParamsSchema = z.object({
  collectionName: nameSchema,
  collectionSymbol: symbolSchema,
  royaltyBps: royaltiesBpsSchema,
  eventConfig: z.string().startsWith('0x'),
  skipInit: z.boolean().default(false),
  holographDropERC721InitCode: z.string(),
})

export const validate = {
  name: nameSchema,
  description: descriptionSchema,
  symbol: symbolSchema,
  tokenType: tokenTypeSchema,
  royaltiesBps: royaltiesBpsSchema,
  salt: saltSchema,
  publicSalePrice: publicSalePriceSchema,
  maxSalePurchasePerAddress: maxSalePurchasePerAddressSchema,
  publicSaleStart: publicSaleStartSchema,
  publicSaleEnd: publicSaleEndSchema,
  presaleStart: presaleStartSchema,
  presaleEnd: presaleEndSchema,
  presaleMerkleRoot: presaleMerkleRootSchema,
  nftIpfsUrl: nftIpfsUrlSchema,
  nftIpfsImageCid: nftIpfsImageCidSchema,
}
