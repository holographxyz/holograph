export * from 'abitype'

declare module 'abitype' {
  export interface Config {
    AddressType: string
    BigIntType: BigInt
  }
}
