import Joi from 'joi'

import {maybeGetResult} from './env.validation'

const LoggerSchema = Joi.object({
  level: Joi.string().default('info'),
})

export function getLoggerConfigs() {
  const result = LoggerSchema.validate({
    level: process.env.LOG_LEVEL,
  })
  const config: {readonly level: string} = maybeGetResult(result)
  return config
}
