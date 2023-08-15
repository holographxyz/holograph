/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
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

export interface ILBPairInterface extends utils.Interface {
  functions: {
    "getReservesAndId()": FunctionFragment;
    "tokenX()": FunctionFragment;
    "tokenY()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getReservesAndId" | "tokenX" | "tokenY"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getReservesAndId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "tokenX", values?: undefined): string;
  encodeFunctionData(functionFragment: "tokenY", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getReservesAndId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenX", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenY", data: BytesLike): Result;

  events: {};
}

export interface ILBPair extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILBPairInterface;

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
    getReservesAndId(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        reserveX: BigNumber;
        reserveY: BigNumber;
        activeId: BigNumber;
      }
    >;

    tokenX(overrides?: CallOverrides): Promise<[string]>;

    tokenY(overrides?: CallOverrides): Promise<[string]>;
  };

  getReservesAndId(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      reserveX: BigNumber;
      reserveY: BigNumber;
      activeId: BigNumber;
    }
  >;

  tokenX(overrides?: CallOverrides): Promise<string>;

  tokenY(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getReservesAndId(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        reserveX: BigNumber;
        reserveY: BigNumber;
        activeId: BigNumber;
      }
    >;

    tokenX(overrides?: CallOverrides): Promise<string>;

    tokenY(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getReservesAndId(overrides?: CallOverrides): Promise<BigNumber>;

    tokenX(overrides?: CallOverrides): Promise<BigNumber>;

    tokenY(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getReservesAndId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenX(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenY(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}