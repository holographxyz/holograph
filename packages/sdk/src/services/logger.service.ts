import {v4 as uuidv4} from 'uuid'

import {HolographError} from '../errors'
import {HolographLoggerContext} from '../utils/types'

export class HolographLogger {
  private constructor(protected context: HolographLoggerContext) {
    this.context = context
  }

  generateLogPrefix(message: string) {
    return `[${this.context.functionName || 'unknown'}] [${this.context.traceId || 'unknown'}] ${message}`
  }

  info(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.info(logMessage, ...args)
  }

  error(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.error(logMessage, ...args)
  }

  debug(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.debug(logMessage, ...args)
  }

  log(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.log(logMessage, ...args)
  }

  trace(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.trace(logMessage, ...args)
  }

  warn(message: string, ...args: any[]) {
    const logMessage = this.generateLogPrefix(message)
    console.warn(logMessage, ...args)
  }

  logHolographError(error: HolographError) {
    if (error.message) {
      this.info(`${error.code}: ${error.message}`) // nice error output
    } else {
      // log the internal error that we have not captured yet
      this.error(String(error.cause))
    }
  }

  static createLogger(input: HolographLoggerContext) {
    return new HolographLogger(input)
  }

  static maybeAddTraceId(logger: HolographLogger) {
    if (!logger.context.traceId) {
      const traceId = uuidv4()
      return HolographLogger.createLogger({...logger.context, traceId})
    }
    return logger
  }

  addContext(context: HolographLoggerContext) {
    const newContext = {...this.context}

    for (const prop in context) {
      if (!this.context[prop]) {
        newContext[prop] = context[prop]
      }
    }

    if (!newContext.traceId && newContext.functionName !== undefined) {
      newContext.traceId = uuidv4()
    }

    return new HolographLogger(newContext)
  }
}
