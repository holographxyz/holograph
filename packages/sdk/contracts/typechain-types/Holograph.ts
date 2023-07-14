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
} from "./common";

export interface HolographInterface extends utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "adminCall(address,bytes)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getBridge()": FunctionFragment;
    "getChainId()": FunctionFragment;
    "getFactory()": FunctionFragment;
    "getHolographChainId()": FunctionFragment;
    "getInterfaces()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getRegistry()": FunctionFragment;
    "getTreasury()": FunctionFragment;
    "getUtilityToken()": FunctionFragment;
    "init(bytes)": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "setBridge(address)": FunctionFragment;
    "setChainId(uint256)": FunctionFragment;
    "setFactory(address)": FunctionFragment;
    "setHolographChainId(uint32)": FunctionFragment;
    "setInterfaces(address)": FunctionFragment;
    "setOperator(address)": FunctionFragment;
    "setRegistry(address)": FunctionFragment;
    "setTreasury(address)": FunctionFragment;
    "setUtilityToken(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "admin"
      | "adminCall"
      | "getAdmin"
      | "getBridge"
      | "getChainId"
      | "getFactory"
      | "getHolographChainId"
      | "getInterfaces"
      | "getOperator"
      | "getRegistry"
      | "getTreasury"
      | "getUtilityToken"
      | "init"
      | "setAdmin"
      | "setBridge"
      | "setChainId"
      | "setFactory"
      | "setHolographChainId"
      | "setInterfaces"
      | "setOperator"
      | "setRegistry"
      | "setTreasury"
      | "setUtilityToken"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "adminCall",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(functionFragment: "getBridge", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getChainId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHolographChainId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getInterfaces",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUtilityToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setBridge",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setChainId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFactory",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setHolographChainId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setInterfaces",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOperator",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRegistry",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTreasury",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setUtilityToken",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "adminCall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBridge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getHolographChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInterfaces",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUtilityToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setBridge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setChainId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setHolographChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setInterfaces",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUtilityToken",
    data: BytesLike
  ): Result;

  events: {};
}

export interface Holograph extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HolographInterface;

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

    getAdmin(
      overrides?: CallOverrides
    ): Promise<[string] & { adminAddress: string }>;

    getBridge(
      overrides?: CallOverrides
    ): Promise<[string] & { bridge: string }>;

    getChainId(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { chainId: BigNumber }>;

    getFactory(
      overrides?: CallOverrides
    ): Promise<[string] & { factory: string }>;

    getHolographChainId(
      overrides?: CallOverrides
    ): Promise<[number] & { holographChainId: number }>;

    getInterfaces(
      overrides?: CallOverrides
    ): Promise<[string] & { interfaces: string }>;

    getOperator(
      overrides?: CallOverrides
    ): Promise<[string] & { operator: string }>;

    getRegistry(
      overrides?: CallOverrides
    ): Promise<[string] & { registry: string }>;

    getTreasury(
      overrides?: CallOverrides
    ): Promise<[string] & { treasury: string }>;

    getUtilityToken(
      overrides?: CallOverrides
    ): Promise<[string] & { utilityToken: string }>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setBridge(
      bridge: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setChainId(
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setHolographChainId(
      holographChainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setInterfaces(
      interfaces: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOperator(
      operator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTreasury(
      treasury: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setUtilityToken(
      utilityToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  admin(overrides?: CallOverrides): Promise<string>;

  adminCall(
    target: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getBridge(overrides?: CallOverrides): Promise<string>;

  getChainId(overrides?: CallOverrides): Promise<BigNumber>;

  getFactory(overrides?: CallOverrides): Promise<string>;

  getHolographChainId(overrides?: CallOverrides): Promise<number>;

  getInterfaces(overrides?: CallOverrides): Promise<string>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getRegistry(overrides?: CallOverrides): Promise<string>;

  getTreasury(overrides?: CallOverrides): Promise<string>;

  getUtilityToken(overrides?: CallOverrides): Promise<string>;

  init(
    initPayload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    adminAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setBridge(
    bridge: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setChainId(
    chainId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFactory(
    factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setHolographChainId(
    holographChainId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setInterfaces(
    interfaces: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOperator(
    operator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRegistry(
    registry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTreasury(
    treasury: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setUtilityToken(
    utilityToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getBridge(overrides?: CallOverrides): Promise<string>;

    getChainId(overrides?: CallOverrides): Promise<BigNumber>;

    getFactory(overrides?: CallOverrides): Promise<string>;

    getHolographChainId(overrides?: CallOverrides): Promise<number>;

    getInterfaces(overrides?: CallOverrides): Promise<string>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getRegistry(overrides?: CallOverrides): Promise<string>;

    getTreasury(overrides?: CallOverrides): Promise<string>;

    getUtilityToken(overrides?: CallOverrides): Promise<string>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setBridge(
      bridge: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setChainId(
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setHolographChainId(
      holographChainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setInterfaces(
      interfaces: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOperator(
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRegistry(
      registry: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTreasury(
      treasury: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setUtilityToken(
      utilityToken: PromiseOrValue<string>,
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

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getBridge(overrides?: CallOverrides): Promise<BigNumber>;

    getChainId(overrides?: CallOverrides): Promise<BigNumber>;

    getFactory(overrides?: CallOverrides): Promise<BigNumber>;

    getHolographChainId(overrides?: CallOverrides): Promise<BigNumber>;

    getInterfaces(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    getTreasury(overrides?: CallOverrides): Promise<BigNumber>;

    getUtilityToken(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setBridge(
      bridge: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setChainId(
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setHolographChainId(
      holographChainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setInterfaces(
      interfaces: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOperator(
      operator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTreasury(
      treasury: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setUtilityToken(
      utilityToken: PromiseOrValue<string>,
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

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getHolographChainId(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInterfaces(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTreasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUtilityToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setBridge(
      bridge: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setChainId(
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setHolographChainId(
      holographChainId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setInterfaces(
      interfaces: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOperator(
      operator: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRegistry(
      registry: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTreasury(
      treasury: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setUtilityToken(
      utilityToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
