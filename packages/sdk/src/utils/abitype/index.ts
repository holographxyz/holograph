export * from './ethers'
export * from './types'

import type {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ResolvedRegister,
} from 'abitype'

import type {ContractEventPayload, Overrides as EthersOverrides} from 'ethers'

export type AbiFunctionArgs<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable' | 'pure' | 'view'>,
> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']>

export type AbiFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs'], 'outputs'>

/**
 * Get name for {@link AbiFunction} or {@link AbiEvent}
 *
 * @param TAbiItem - {@link AbiFunction} or {@link AbiEvent}
 * @param IsSignature - Whether to return the signature instead of the name
 * @returns Name or signature of function or event
 *
 * @example
 * type Result = AbiItemName<{ type: 'function'; name: 'Foo'; … }>
 */
export type AbiItemName<
  TAbiItem extends (AbiFunction & {type: 'function'}) | AbiEvent,
  IsSignature extends boolean = false,
> = IsSignature extends true
  ? TAbiItem['inputs'] extends infer TAbiParameters extends readonly AbiParameter[]
    ? `${TAbiItem['name']}(${Join<[...{[K in keyof TAbiParameters]: TAbiParameters[K]['type']}], ','>})`
    : never
  : TAbiItem['name']

/**
 * Get overrides for {@link AbiStateMutability}
 *
 * @param TAbiStateMutability - {@link AbiStateMutability}
 * @returns Overrides for {@link TAbiStateMutability}
 *
 * @example
 * type Result = GetOverridesForAbiStateMutability<'pure'>
 */
export type GetOverridesForAbiStateMutability<TAbiStateMutability extends AbiStateMutability> = {
  nonpayable: Overrides & {from?: Address}
  payable: PayableOverrides & {from?: Address}
  pure: CallOverrides
  view: CallOverrides
}[TAbiStateMutability]

// Update `ethers.Overrides` to use abitype config
export interface Overrides extends EthersOverrides {
  gasLimit?: ResolvedRegister['BigIntType']
  gasPrice?: ResolvedRegister['BigIntType']
  maxFeePerGas?: ResolvedRegister['BigIntType']
  maxPriorityFeePerGas?: ResolvedRegister['BigIntType']
  nonce?: ResolvedRegister['IntType']
}

// Update `ethers.PayableOverrides` to use abitype config
export interface PayableOverrides extends Overrides {
  value?: ResolvedRegister['IntType'] | ResolvedRegister['BigIntType']
}

// Update `ethers.CallOverrides` to use abitype config
export interface CallOverrides extends PayableOverrides {
  blockTag?: NonNullable<EthersOverrides['blockTag']>
  from?: Address
}

// Add type inference to `ethers.Event`
export type Event<TAbiEvent extends AbiEvent> = Omit<ContractEventPayload, 'args' | 'eventName' | 'eventSignature'> & {
  args: AbiParametersToPrimitiveTypes<TAbiEvent['inputs']>
  event: TAbiEvent['name']
  eventSignature: AbiItemName<TAbiEvent, true>
}
/**
 * Joins {@link Items} into string separated by {@link Separator}
 *
 * @param Items - Items to join
 * @param Separator - Separator to use
 * @returns Joined string
 *
 * @example
 * type Result = Join<['foo', 'bar'], '-'>
 */
export type Join<Items extends string[], Separator extends string | number> = Items extends [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends string[]
      ? Rest extends []
        ? `${First}`
        : `${First}${Separator}${Join<Rest, Separator>}`
      : never
    : never
  : ''
/**
 * Count occurrences of {@link TType} in {@link TArray}
 *
 * @param TArray - Array to count occurrences in
 * @param TType - Type to count occurrences of
 * @returns Number of occurrences of {@link TType} in {@link TArray}
 *
 * @example
 * type Result = CountOccurrences<['foo', 'bar', 'foo'], 'foo'>
 */
export type CountOccurrences<TArray extends readonly unknown[], TType> = FilterNever<
  [
    ...{
      [K in keyof TArray]: TArray[K] extends TType ? TArray[K] : never
    },
  ]
>['length']
/**
 * Removes all occurrences of `never` from {@link TArray}
 *
 * @param TArray - Array to filter
 * @returns Array with `never` removed
 *
 * @example
 * type Result = FilterNever<[1, 2, never, 3, never, 4]>
 */
export type FilterNever<TArray extends readonly unknown[]> = TArray['length'] extends 0
  ? []
  : TArray extends [infer THead, ...infer TRest]
  ? IsNever<THead> extends true
    ? FilterNever<TRest>
    : [THead, ...FilterNever<TRest>]
  : never

type IsNever<T> = [T] extends [never] ? true : false
