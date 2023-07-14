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

export interface HolographBridgeInterface extends utils.Interface {
  functions: {
    "admin()": FunctionFragment;
    "adminCall(address,bytes)": FunctionFragment;
    "bridgeInRequest(uint256,uint32,address,address,address,uint256,bool,bytes)": FunctionFragment;
    "bridgeOutRequest(uint32,address,uint256,uint256,bytes)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getBridgeOutRequestPayload(uint32,address,uint256,uint256,bytes)": FunctionFragment;
    "getFactory()": FunctionFragment;
    "getHolograph()": FunctionFragment;
    "getJobNonce()": FunctionFragment;
    "getMessageFee(uint32,uint256,uint256,bytes)": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getRegistry()": FunctionFragment;
    "init(bytes)": FunctionFragment;
    "revertedBridgeOutRequest(address,uint32,address,bytes)": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "setFactory(address)": FunctionFragment;
    "setHolograph(address)": FunctionFragment;
    "setOperator(address)": FunctionFragment;
    "setRegistry(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "admin"
      | "adminCall"
      | "bridgeInRequest"
      | "bridgeOutRequest"
      | "getAdmin"
      | "getBridgeOutRequestPayload"
      | "getFactory"
      | "getHolograph"
      | "getJobNonce"
      | "getMessageFee"
      | "getOperator"
      | "getRegistry"
      | "init"
      | "revertedBridgeOutRequest"
      | "setAdmin"
      | "setFactory"
      | "setHolograph"
      | "setOperator"
      | "setRegistry"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "adminCall",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeInRequest",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeOutRequest",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getBridgeOutRequestPayload",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHolograph",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getJobNonce",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMessageFee",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
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
    functionFragment: "init",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "revertedBridgeOutRequest",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFactory",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setHolograph",
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

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "adminCall", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bridgeInRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bridgeOutRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBridgeOutRequestPayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getHolograph",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getJobNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMessageFee",
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
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revertedBridgeOutRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setHolograph",
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

  events: {};
}

export interface HolographBridge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HolographBridgeInterface;

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

    bridgeInRequest(
      arg0: PromiseOrValue<BigNumberish>,
      fromChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      hToken: PromiseOrValue<string>,
      hTokenRecipient: PromiseOrValue<string>,
      hTokenValue: PromiseOrValue<BigNumberish>,
      doNotRevert: PromiseOrValue<boolean>,
      bridgeInPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    bridgeOutRequest(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAdmin(
      overrides?: CallOverrides
    ): Promise<[string] & { adminAddress: string }>;

    getBridgeOutRequestPayload(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getFactory(
      overrides?: CallOverrides
    ): Promise<[string] & { factory: string }>;

    getHolograph(
      overrides?: CallOverrides
    ): Promise<[string] & { holograph: string }>;

    getJobNonce(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { jobNonce: BigNumber }>;

    getMessageFee(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getOperator(
      overrides?: CallOverrides
    ): Promise<[string] & { operator: string }>;

    getRegistry(
      overrides?: CallOverrides
    ): Promise<[string] & { registry: string }>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revertedBridgeOutRequest(
      sender: PromiseOrValue<string>,
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setHolograph(
      holograph: PromiseOrValue<string>,
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
  };

  admin(overrides?: CallOverrides): Promise<string>;

  adminCall(
    target: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  bridgeInRequest(
    arg0: PromiseOrValue<BigNumberish>,
    fromChain: PromiseOrValue<BigNumberish>,
    holographableContract: PromiseOrValue<string>,
    hToken: PromiseOrValue<string>,
    hTokenRecipient: PromiseOrValue<string>,
    hTokenValue: PromiseOrValue<BigNumberish>,
    doNotRevert: PromiseOrValue<boolean>,
    bridgeInPayload: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  bridgeOutRequest(
    toChain: PromiseOrValue<BigNumberish>,
    holographableContract: PromiseOrValue<string>,
    gasLimit: PromiseOrValue<BigNumberish>,
    gasPrice: PromiseOrValue<BigNumberish>,
    bridgeOutPayload: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getBridgeOutRequestPayload(
    toChain: PromiseOrValue<BigNumberish>,
    holographableContract: PromiseOrValue<string>,
    gasLimit: PromiseOrValue<BigNumberish>,
    gasPrice: PromiseOrValue<BigNumberish>,
    bridgeOutPayload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getFactory(overrides?: CallOverrides): Promise<string>;

  getHolograph(overrides?: CallOverrides): Promise<string>;

  getJobNonce(overrides?: CallOverrides): Promise<BigNumber>;

  getMessageFee(
    arg0: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<BigNumberish>,
    arg2: PromiseOrValue<BigNumberish>,
    arg3: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getRegistry(overrides?: CallOverrides): Promise<string>;

  init(
    initPayload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revertedBridgeOutRequest(
    sender: PromiseOrValue<string>,
    toChain: PromiseOrValue<BigNumberish>,
    holographableContract: PromiseOrValue<string>,
    bridgeOutPayload: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAdmin(
    adminAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFactory(
    factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setHolograph(
    holograph: PromiseOrValue<string>,
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

  callStatic: {
    admin(overrides?: CallOverrides): Promise<string>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    bridgeInRequest(
      arg0: PromiseOrValue<BigNumberish>,
      fromChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      hToken: PromiseOrValue<string>,
      hTokenRecipient: PromiseOrValue<string>,
      hTokenValue: PromiseOrValue<BigNumberish>,
      doNotRevert: PromiseOrValue<boolean>,
      bridgeInPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    bridgeOutRequest(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getBridgeOutRequestPayload(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    getFactory(overrides?: CallOverrides): Promise<string>;

    getHolograph(overrides?: CallOverrides): Promise<string>;

    getJobNonce(overrides?: CallOverrides): Promise<BigNumber>;

    getMessageFee(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getRegistry(overrides?: CallOverrides): Promise<string>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    revertedBridgeOutRequest(
      sender: PromiseOrValue<string>,
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setHolograph(
      holograph: PromiseOrValue<string>,
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
  };

  filters: {};

  estimateGas: {
    admin(overrides?: CallOverrides): Promise<BigNumber>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    bridgeInRequest(
      arg0: PromiseOrValue<BigNumberish>,
      fromChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      hToken: PromiseOrValue<string>,
      hTokenRecipient: PromiseOrValue<string>,
      hTokenValue: PromiseOrValue<BigNumberish>,
      doNotRevert: PromiseOrValue<boolean>,
      bridgeInPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    bridgeOutRequest(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getBridgeOutRequestPayload(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getFactory(overrides?: CallOverrides): Promise<BigNumber>;

    getHolograph(overrides?: CallOverrides): Promise<BigNumber>;

    getJobNonce(overrides?: CallOverrides): Promise<BigNumber>;

    getMessageFee(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revertedBridgeOutRequest(
      sender: PromiseOrValue<string>,
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setHolograph(
      holograph: PromiseOrValue<string>,
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
  };

  populateTransaction: {
    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adminCall(
      target: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    bridgeInRequest(
      arg0: PromiseOrValue<BigNumberish>,
      fromChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      hToken: PromiseOrValue<string>,
      hTokenRecipient: PromiseOrValue<string>,
      hTokenValue: PromiseOrValue<BigNumberish>,
      doNotRevert: PromiseOrValue<boolean>,
      bridgeInPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    bridgeOutRequest(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBridgeOutRequestPayload(
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      gasLimit: PromiseOrValue<BigNumberish>,
      gasPrice: PromiseOrValue<BigNumberish>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getHolograph(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getJobNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMessageFee(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      initPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revertedBridgeOutRequest(
      sender: PromiseOrValue<string>,
      toChain: PromiseOrValue<BigNumberish>,
      holographableContract: PromiseOrValue<string>,
      bridgeOutPayload: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAdmin(
      adminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setHolograph(
      holograph: PromiseOrValue<string>,
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
  };
}
