// The function below is for checking where the code is running at (either front-end or server).
// It is used mainly on the networks setup for the Config service class.
// It is not reliable and should not be used for security checks.
export function isFrontEnd() {
  return typeof window !== 'undefined' && window.document
}
