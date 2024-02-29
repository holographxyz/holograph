import pino from 'pino'
import pretty from 'pino-pretty'
import {v4 as uuidv4} from 'uuid'
import {getLoggerConfigs} from '../config/logger.config'
import {HolographError} from '../errors'
import {baseClassSimulacrum} from '../utils/transformers'

type PinoMethods = Pick<pino.Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'>

type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K>}> = Partial<T> & U[keyof U]

interface CreateHolographLogger {
  serviceName: string
  className: string
  functionName: string
  traceId: string
}

type HolographLoggerContext = AtLeastOne<CreateHolographLogger>

export function simpleFnLogger() {
  return function (target: Object, key: string, descriptor: PropertyDescriptor) {
    const originalFn = descriptor.value
    const decoratorLogger = HolographLogger.createLogger({className: target.constructor.name}).addContext({
      functionName: key,
    })
    descriptor.value = function (...args: any[]) {
      decoratorLogger.info({args}, 'calling function')
      const returnValue = originalFn.apply(this, [...args, decoratorLogger])
      decoratorLogger.info({returnValue}, 'return value')
      return returnValue
    }
    return descriptor
  }
}

export class HolographLogger extends baseClassSimulacrum<PinoMethods>() {
  protected static config = getLoggerConfigs()

  private constructor(private pinoLogger: pino.Logger, protected context: HolographLoggerContext) {
    super()
    return new Proxy(this, {
      get(target, prop) {
        const exists = target[prop as keyof typeof target]

        if (exists !== undefined) return exists

        const underlyingAtt = target.pinoLogger[prop as keyof typeof target.pinoLogger]

        if (typeof underlyingAtt === 'function') {
          return underlyingAtt.bind(target.pinoLogger)
        }

        return target.pinoLogger[prop as keyof typeof target.pinoLogger]
      },
    })
  }

  logHolographError(error: HolographError) {
    this.pinoLogger.debug(error.stack) // log stack if in debug mode
    if (error.message) {
      this.pinoLogger.info(`${error.code}: ${error.message}`) // nice error output
    } else {
      // log the internal error that we have not captured yet
      this.pinoLogger.error(error.cause)
    }
  }

  getContext() {
    // Notice: make sure this.context is equal to this.pinoLogger.bindings()
    return this.context
  }

  static createLogger(input: HolographLoggerContext) {
    const pinoLogger = pino(
      HolographLogger.config,
      pretty({
        colorize: true,
      }),
    ).child(input)

    return new HolographLogger(pinoLogger, input)
  }

  static maybeAddTraceId(logger: HolographLogger) {
    if (!logger.context.traceId) {
      const traceId = uuidv4()
      return HolographLogger.createLogger({...logger.getContext(), traceId})
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

    const thisLoggerChild = this.pinoLogger.child(newContext)
    return new HolographLogger(thisLoggerChild, newContext)
  }
}
