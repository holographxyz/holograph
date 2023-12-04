export enum HolographErrorCode {
  HOLO_SDK_10000 = 'HOLO_SDK_10000',
}

type ErrorInfo = Record<HolographErrorCode, (...args: any[]) => {message: string; description: string}>

export const errorInfo: ErrorInfo = {
  [HolographErrorCode.HOLO_SDK_10000]: (chainId: number) => ({
    message: `Failed to get network to chainId ${chainId}.`,
    description: 'The provided chainId is not in the scope',
  }),
}
