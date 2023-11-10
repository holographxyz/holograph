// interface HolographErrorMap {
//   [${class or service}]: HolographErrorGroup
//   holographContract: HolographErrorGroup
// }

// interface HolographErrorGroup {
//  [code]: HolographError
// }

// interface HologrphErrorCode {
//  [code]: string // HOLO_SDK_00000
// }

// // // Example function that outputs nice errors for people but debug if needed
// // function logHolographError(error: HolographError) {
// //  logger.debug(error.error.stack) // log stack if in debug mode
// //  if (error.message) {
// //    logger.info(`${error.code}: ${error.message}`) // nice error output
// //  } else {
// //    // log the internal error that we have not captured yet
// //    logger.error(error.error.message)
// //  }
// // }

enum HologrphErrorCode {
  HOLO_SDK_00000 = 'string', // HOLO_SDK_00000
}

interface HolographErrorParams {
  name: string
  description?: string
  options?: {cause: Error} //original error
  message: string // the human readable error
  code: HologrphErrorCode
}

abstract class HolographError extends Error {
  public name: string
  public description?: string
  public code: HologrphErrorCode

  constructor(holographErrorParams: HolographErrorParams) {
    const {name, description, options, message, code} = holographErrorParams
    super(message, options)

    this.name = name
    this.description = description
    this.code = code
  }
}
