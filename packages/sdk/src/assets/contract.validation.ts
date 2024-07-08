import {Address, Hex} from 'viem'
import * as z from 'zod'

import {generateRandomSalt, getAddressTypeSchema} from '../utils/helpers'
import {CheckTypeIntegrity, HolographVersion} from '../utils/types'

const nameSchema = z.string().min(1, {message: 'Name is required'})
const descriptionSchema = z.string().optional()
const symbolSchema = z
  .string()
  .min(1, {message: 'Symbol is required'})
  .transform(s => s.toUpperCase())
const royaltiesPercentageSchema = z.number().int().min(0).max(10000).default(0)
const saltSchema = z
  .string()
  .min(32, {
    message: 'Salt is required',
  })
  .default(generateRandomSalt())
  .transform(salt => salt as Hex)
export const primaryChainIdSchema = z.number().int().min(1)

const publicSalePriceSchema = z.number().min(0)
const maxSalePurchasePerAddressSchema = z.number().int().min(1)
const publicSaleStartSchema = z.string().datetime()
const publicSaleEndSchema = z.string().datetime()
const presaleStartSchema = z.string().datetime().optional()
const presaleEndSchema = z.string().datetime().optional()
const presaleMerkleRootSchema = z
  .string()
  .optional()
  .default('0x0000000000000000000000000000000000000000000000000000000000000000')

const nftIpfsUrlSchema = z.string().url()
const nftIpfsImageCidSchema = z.string().length(46).startsWith('Qm')

export const openEditionSalesConfigSchema = z.object({
  publicSalePrice: publicSalePriceSchema,
  maxSalePurchasePerAddress: maxSalePurchasePerAddressSchema,
  publicSaleStart: publicSaleStartSchema,
  publicSaleEnd: publicSaleEndSchema,
  presaleStart: presaleStartSchema,
  presaleEnd: presaleEndSchema,
  presaleMerkleRoot: presaleMerkleRootSchema,
})

export const contractInfoSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  symbol: symbolSchema,
  royaltiesPercentage: royaltiesPercentageSchema,
  salt: saltSchema,
})

export const nftInfoSchema = z.object({
  ipfsUrl: nftIpfsUrlSchema,
  ipfsImageCid: nftIpfsImageCidSchema,
})

export const createHolographERC721ContractSchema = z.object({
  contractInfo: contractInfoSchema,
  primaryChainId: primaryChainIdSchema,
})

export const createHolographOpenEditionERC721ContractSchema = z.object({
  contractInfo: contractInfoSchema,
  nftInfo: nftInfoSchema,
  primaryChainId: primaryChainIdSchema,
  salesConfig: openEditionSalesConfigSchema,
})

export const holographOpenEditionERC721InitCodeV2ParamsSchema = z.object({
  contractType: z.string(),
  registryAddress: getAddressTypeSchema('registry'),
  initialOwner: getAddressTypeSchema('Initial owner'),
  fundsRecipient: getAddressTypeSchema('Funds recipient'),
  numOfEditions: z.number().int().min(0),
  royaltiesPercentage: royaltiesPercentageSchema,
  salesConfigArray: z.array(z.union([z.number(), z.string(), z.bigint()])),
  metadataRendererAddress: getAddressTypeSchema('Metadata renderer'),
  metadataRendererInitCode: z.string(),
})

export const holographOpenEditionERC721InitCodeV1ParamsSchema = holographOpenEditionERC721InitCodeV2ParamsSchema.merge(
  z.object({
    erc721TransferHelper: getAddressTypeSchema('ERC721 transfer helper'),
    marketFilterAddress: getAddressTypeSchema('Market filter'),
    enableOpenSeaRoyaltyRegistry: z.boolean().default(false),
  }),
)

export const holographERC721InitCodeParamsSchema = z.object({
  contractName: nameSchema,
  contractSymbol: symbolSchema,
  royaltiesPercentage: royaltiesPercentageSchema,
  eventConfig: z.string().startsWith('0x'),
  skipInit: z.boolean().default(false),
  holographOpenEditionERC721InitCode: z.string(),
})

export const validate = {
  name: nameSchema,
  description: descriptionSchema,
  symbol: symbolSchema,
  royaltiesPercentage: royaltiesPercentageSchema,
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
  contractInfo: contractInfoSchema,
  nftInfo: nftInfoSchema,
  salesConfig: openEditionSalesConfigSchema,
  primaryChainId: primaryChainIdSchema,
}

export const openEditionContractInfo = contractInfoSchema.merge(nftInfoSchema).merge(openEditionSalesConfigSchema)

export const OPEN_EDITION_INIT_CODE_ABI_PARAMETERS = {
  [HolographVersion.V1]: [
    {
      type: 'tuple',
      components: [
        {
          type: 'address', // erc721TransferHelper
        },
        {
          type: 'address', // marketFilterAddress
        },
        {
          type: 'address', // initialOwner
        },
        {
          type: 'address', // fundsRecipient
        },
        {
          type: 'uint64', // numOfEditions
        },
        {
          type: 'uint16', // royaltiesPercentage
        },
        {
          type: 'bool', // enableOpenSeaRoyaltyRegistry
        },
        {
          type: 'tuple', // salesConfig
          components: [
            {
              type: 'uint104', // publicSalePrice
            },
            {
              type: 'uint32', // maxSalePurchasePerAddress
            },
            {
              type: 'uint64', // publicSaleStart
            },
            {
              type: 'uint64', // publicSaleEnd
            },
            {
              type: 'uint64', // presaleStart
            },
            {
              type: 'uint64', // presaleEnd
            },
            {
              type: 'bytes32', // presaleMerkleRoot
            },
          ],
        },
        {
          type: 'address', // metadataRendererAddress
        },
        {
          type: 'bytes', // metadataRendererInitCode
        },
      ],
    },
  ],
  [HolographVersion.V2]: [
    {
      type: 'tuple',
      components: [
        {
          type: 'address', // initialOwner
        },
        {
          type: 'address', // fundsRecipient
        },
        {
          type: 'uint64', // numOfEditions
        },
        {
          type: 'uint16', // royaltiesPercentage
        },
        {
          type: 'tuple', // salesConfig
          components: [
            {
              type: 'uint104', // publicSalePrice
            },
            {
              type: 'uint32', // maxSalePurchasePerAddress
            },
            {
              type: 'uint64', // publicSaleStart
            },
            {
              type: 'uint64', // publicSaleEnd
            },
            {
              type: 'uint64', // presaleStart
            },
            {
              type: 'uint64', // presaleEnd
            },
            {
              type: 'bytes32', // presaleMerkleRoot
            },
          ],
        },
        {
          type: 'address', // metadataRendererAddress
        },
        {
          type: 'bytes', // metadataRendererInitCode
        },
      ],
    },
  ],
}

export type CreateHolographERC721ContractSchema = z.input<typeof createHolographERC721ContractSchema>

export type CreateHolographERC721Contract = {
  contractInfo: {
    name: string
    symbol: string
    royaltiesPercentage?: number
    salt?: string
  }
  primaryChainId: number
}

export type HydrateHolographERC721Contract = {
  contractInfo: {
    name: string
    symbol: string
    royaltiesPercentage?: number
    salt?: string
  }
  chainId: number
  address: Address
  txHash?: Hex
}

type CheckCreateHolographERC721Contract = CheckTypeIntegrity<
  CreateHolographERC721ContractSchema,
  CreateHolographERC721Contract,
  CreateHolographERC721ContractSchema
>

export type ContractInfo = z.infer<typeof contractInfoSchema>

export type OpenEditionContractInfo = z.input<typeof openEditionContractInfo>

export type NFTInfo = z.infer<typeof nftInfoSchema>

export type OpenEditionSalesConfig = z.input<typeof openEditionSalesConfigSchema>

export type CreateHolographOpenEditionERC721ContractSchema = z.input<
  typeof createHolographOpenEditionERC721ContractSchema
>

export type CreateHolographOpenEditionERC721Contract = {
  contractInfo: {
    name: string
    symbol: string
    description?: string
    royaltiesPercentage?: number
    salt?: string
  }
  nftInfo: {
    ipfsUrl: string
    ipfsImageCid: string
  }
  primaryChainId: number
  salesConfig: OpenEditionSalesConfig
}

export type HydrateHolographOpenEditionERC721Contract = {
  contractInfo: {
    name: string
    symbol: string
    description?: string
    royaltiesPercentage?: number
    salt?: string
  }
  nftInfo: {
    ipfsUrl: string
    ipfsImageCid: string
  }
  salesConfig: OpenEditionSalesConfig
  chainId: number
  address: Address
  txHash?: Hex
}

type CheckCreateHolographOpenEditionERC721Contract = CheckTypeIntegrity<
  CreateHolographOpenEditionERC721ContractSchema,
  CreateHolographOpenEditionERC721Contract,
  CreateHolographOpenEditionERC721ContractSchema
>

export type HolographERC721InitCodeParams = z.infer<typeof holographERC721InitCodeParamsSchema>

export type HolographOpenEditionERC721InitCodeV1Params = z.infer<
  typeof holographOpenEditionERC721InitCodeV1ParamsSchema
>

export type HolographOpenEditionERC721InitCodeV2Params = z.infer<
  typeof holographOpenEditionERC721InitCodeV2ParamsSchema
>
