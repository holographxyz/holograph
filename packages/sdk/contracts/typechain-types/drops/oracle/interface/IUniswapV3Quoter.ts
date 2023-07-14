/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface IUniswapV3QuoterInterface extends utils.Interface {
  functions: {
    "quoteExactInput(bytes,uint256)": FunctionFragment;
    "quoteExactInputSingle(address,address,uint24,uint256,uint160)": FunctionFragment;
    "quoteExactOutput(bytes,uint256)": FunctionFragment;
    "quoteExactOutputSingle(address,address,uint24,uint256,uint160)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "quoteExactInput"
      | "quoteExactInputSingle"
      | "quoteExactOutput"
      | "quoteExactOutputSingle"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "quoteExactInput",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteExactInputSingle",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteExactOutput",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteExactOutputSingle",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "quoteExactInput",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteExactInputSingle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteExactOutput",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteExactOutputSingle",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IUniswapV3Quoter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IUniswapV3QuoterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    quoteExactInput(
      path: PromiseOrValue<BytesLike>,
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    quoteExactInputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountIn: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    quoteExactOutput(
      path: PromiseOrValue<BytesLike>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    quoteExactOutputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  quoteExactInput(
    path: PromiseOrValue<BytesLike>,
    amountIn: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  quoteExactInputSingle(
    tokenIn: PromiseOrValue<string>,
    tokenOut: PromiseOrValue<string>,
    fee: PromiseOrValue<BigNumberish>,
    amountIn: PromiseOrValue<BigNumberish>,
    sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  quoteExactOutput(
    path: PromiseOrValue<BytesLike>,
    amountOut: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  quoteExactOutputSingle(
    tokenIn: PromiseOrValue<string>,
    tokenOut: PromiseOrValue<string>,
    fee: PromiseOrValue<BigNumberish>,
    amountOut: PromiseOrValue<BigNumberish>,
    sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    quoteExactInput(
      path: PromiseOrValue<BytesLike>,
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteExactInputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountIn: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteExactOutput(
      path: PromiseOrValue<BytesLike>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteExactOutputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    quoteExactInput(
      path: PromiseOrValue<BytesLike>,
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    quoteExactInputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountIn: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    quoteExactOutput(
      path: PromiseOrValue<BytesLike>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    quoteExactOutputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    quoteExactInput(
      path: PromiseOrValue<BytesLike>,
      amountIn: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    quoteExactInputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountIn: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    quoteExactOutput(
      path: PromiseOrValue<BytesLike>,
      amountOut: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    quoteExactOutputSingle(
      tokenIn: PromiseOrValue<string>,
      tokenOut: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      amountOut: PromiseOrValue<BigNumberish>,
      sqrtPriceLimitX96: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
