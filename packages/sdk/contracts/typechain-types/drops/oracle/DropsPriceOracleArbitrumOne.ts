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
  PayableOverrides,
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
} from "../../common";

export interface DropsPriceOracleArbitrumOneInterface extends utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "adminCall(address,bytes)": FunctionFragment;
    "convertUsdToWei(uint256)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "init(bytes)": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "admin"
      | "adminCall"
      | "convertUsdToWei"
      | "getAdmin"
      | "init"
      | "setAdmin"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "adminCall",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "convertUsdToWei",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "adminCall", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "convertUsdToWei",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;

  events: {};
}

export interface DropsPriceOracleArbitrumOne extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DropsPriceOracleArbitrumOneInterface;

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
    admin(overrides?: CallOverrides): Promise<[string]>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    convertUsdToWei(
      usdAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { weiAmount: BigNumber }>;

    getAdmin(
      overrides?: CallOverrides
    ): Promise<[string] & { adminAddress: string }>;

    init(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  adminCall(
    target: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  convertUsdToWei(
    usdAmount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  init(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    adminAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    convertUsdToWei(
      usdAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    init(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    admin(overrides?: CallOverrides): Promise<BigNumber>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    convertUsdToWei(
      usdAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    convertUsdToWei(
      usdAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
