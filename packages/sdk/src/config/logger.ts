import Joi from 'joi'
import pino from 'pino'

import {maybeGetResult} from './env.validation'

const LoggerSchema = Joi.object({
  level: Joi.string().default('info'),
})

function getLoggerConfigs() {
  const result = LoggerSchema.validate({
    level: process.env.LOG_LEVEL,
  })
  const config: {readonly level: string} = maybeGetResult(result)
  return config
}

export function getMainLoopLogger() {
  const config = getLoggerConfigs()
  return pino({
    level: config.level,
  }).child({
    logger: 'mainEventLoop',
  })
}

export function getHandlerLogger() {
  const config = getLoggerConfigs()
  return pino({
    level: config.level,
  }).child({
    logger: 'handler',
  })
}
