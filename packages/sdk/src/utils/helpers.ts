export function isFrontEnd() {
  return typeof window !== 'undefined' && window.document
}
