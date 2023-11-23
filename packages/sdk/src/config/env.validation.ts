import Joi from 'joi'
import * as dotenv from 'dotenv'

dotenv.config()

const NodeEnvSchema = Joi.string()
  .valid('development', 'production', 'staging', 'test', 'provision')
  .default('development')

const HolographEnvSchema = Joi.string()
  .valid('localhost', 'experimental', 'develop', 'testnet', 'mainnet')
  .default('develop')

export function maybeGetResult(result: Joi.ValidationResult<any>) {
  if (result.error) {
    throw new Error(`Environment config error: ${result.error.message}`)
  }
  return result.value
}

export function getNodeEnv(): string {
  const result = NodeEnvSchema.validate(process.env.NODE_ENV)
  return maybeGetResult(result)
}

export function getHolographEnv(): string {
  const result = HolographEnvSchema.validate(process.env.HOLOGRAPH_ENVIRONMENT)
  return maybeGetResult(result)
}
