import * as z from 'zod'
import * as dotenv from 'dotenv'
import {Environment} from '@holographxyz/environment'

dotenv.config()

export const logLevelSchema = z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional().default('info')

export const generalEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test', 'provision']).default('development'),
  HOLOGRAPH_ENVIRONMENT: z
    .enum([
      Environment.localhost,
      Environment.experimental,
      Environment.develop,
      Environment.testnet,
      Environment.mainnet,
    ])
    .default(Environment.develop),
  LOG_LEVEL: logLevelSchema,
})

export const rpcUrlEnvSchema = z.object({
  ARBITRUM_TESTNET_SEPOLIA_RPC_URL: z.string().url().optional(),
  ARBITRUM_ONE_RPC_URL: z.string().url().optional(),
  AVALANCHE_TESTNET_RPC_URL: z.string().url().optional(),
  AVALANCHE_RPC_URL: z.string().url().optional(),
  BASE_TESTNET_SEPOLIA_RPC_URL: z.string().url().optional(),
  BASE_RPC_URL: z.string().url().optional(),
  BINANCE_SMART_CHAIN_TESTNET_RPC_URL: z.string().url().optional(),
  BINANCE_SMART_CHAIN_RPC_URL: z.string().url().optional(),
  ETHEREUM_TESTNET_GOERLI_RPC_URL: z.string().url().optional(),
  ETHEREUM_TESTNET_SEPOLIA_RPC_URL: z.string().url().optional(),
  ETHEREUM_RPC_URL: z.string().url().optional(),
  MANTLE_TESTNET_RPC_URL: z.string().url().optional(),
  MANTLE_RPC_URL: z.string().url().optional(),
  OPTIMISM_TESTNET_SEPOLIA_RPC_URL: z.string().url().optional(),
  OPTIMISM_RPC_URL: z.string().url().optional(),
  POLYGON_TESTNET_RPC_URL: z.string().url().optional(),
  POLYGON_RPC_URL: z.string().url().optional(),
  ZORA_TESTNET_SEPOLIA_RPC_URL: z.string().url().optional(),
  ZORA_RPC_URL: z.string().url().optional(),
})

export type RpcUrlEnvironmentVariables = keyof z.infer<typeof rpcUrlEnvSchema>

export const envSchema = generalEnvSchema.merge(rpcUrlEnvSchema)

export type EnvironmentVariables = z.infer<typeof envSchema>

// Validate and get environment variables with TypeScript autocomplete
// It will throw an error if there is a missing or invalid environment variable
// @example: const holographEnvironment = getEnv().HOLOGRAPH_ENVIRONMENT
export function getEnv() {
  return envSchema.parse(process.env)
}
