export type EventInfo = {
  readonly topic: string
  readonly signature: string
  readonly name: string
}

export enum HolographEventName {
  // TransferERC20 = 'TransferERC20',
  TransferERC721 = 'TransferERC721',
  HolographableContractEvent = 'HolographableContractEvent',
  BridgeableContractDeployed = 'BridgeableContractDeployed',
  CrossChainMessageSent = 'CrossChainMessageSent',
  AvailableOperatorJob = 'AvailableOperatorJob',
  FinishedOperatorJob = 'FinishedOperatorJob',
  // FailedOperatorJob = 'FailedOperatorJob',
  // SecondarySaleFees = 'SecondarySaleFees',
  // EditionInitialized = 'EditionInitialized',
  // PacketReceived = 'PacketReceived',
  // RelayerParams = 'RelayerParams',
  // MintFeePayout = 'MintFeePayout',
  // AssignJob = 'AssignJob',
  LzPacket = 'LzPacket',
  // Sale = 'Sale',
}

export const HOLOGRAPH_EVENTS: {readonly [key in HolographEventName]: EventInfo} = {
  [HolographEventName.TransferERC721]: {
    name: HolographEventName.TransferERC721,
    topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    signature: 'event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)',
  },
  [HolographEventName.BridgeableContractDeployed]: {
    name: HolographEventName.BridgeableContractDeployed,
    topic: '0xa802207d4c618b40db3b25b7b90e6f483e16b2c1f8d3610b15b345a718c6b41b',
    signature: 'event BridgeableContractDeployed(address indexed contractAddress, bytes32 indexed hash)',
  },
  [HolographEventName.CrossChainMessageSent]: {
    name: HolographEventName.CrossChainMessageSent,
    topic: '0x0f5759b4182507dcfc771071166f98d7ca331262e5134eaa74b676adce2138b7',
    signature: 'event CrossChainMessageSent(bytes32 messageHash)',
  },
  [HolographEventName.LzPacket]: {
    name: HolographEventName.LzPacket,
    topic: '0xe9bded5f24a4168e4f3bf44e00298c993b22376aad8c58c7dda9718a54cbea82',
    signature: 'event Packet(bytes payload)',
  },
  [HolographEventName.AvailableOperatorJob]: {
    name: HolographEventName.AvailableOperatorJob,
    topic: '0x4422a85db963f113e500bc4ada8f9e9f1a7bcd57cbec6907fbb2bf6aaf5878ff',
    signature: 'event AvailableOperatorJob(bytes32 jobHash, bytes payload)',
  },
  [HolographEventName.FinishedOperatorJob]: {
    name: HolographEventName.FinishedOperatorJob,
    topic: '0xfc3963369d694e97f35e33cc03fcd382bfa4dbb688ae43d318fcf344f479425e',
    signature: 'event FinishedOperatorJob(bytes32 _jobHash, address _operator)',
  },
  [HolographEventName.HolographableContractEvent]: {
    name: HolographEventName.HolographableContractEvent,
    topic: '0xb4d3a3f85e85fdbd1d39f939d8c75355ec33ef437522432fe1a7b8b20bb4fab4',
    signature: 'event HolographableContractEvent(address indexed _holographableContract, bytes _payload)',
  },
}
