import * as z from 'zod'

import {logLevelSchema} from './env.validation'

const loggerSchema = z.object({
  level: logLevelSchema,
})

export function getLoggerConfigs() {
  const result = loggerSchema.parse({level: process.env.LOG_LEVEL})
  return result
}
