export type EventInfo = {
  readonly topic: string
  readonly signature: string
}

export const HOLOGRAPH_EVENTS: Record<string, EventInfo> = {
  TransferERC721: {
    topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    signature: 'Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)',
  },
  BridgeableContractDeployed: {
    topic: '0xa802207d4c618b40db3b25b7b90e6f483e16b2c1f8d3610b15b345a718c6b41b',
    signature: 'BridgeableContractDeployed(address indexed contractAddress, bytes32 indexed hash)',
  },
  CrossChainMessageSent: {
    topic: '0x0f5759b4182507dcfc771071166f98d7ca331262e5134eaa74b676adce2138b7',
    signature: 'CrossChainMessageSent(bytes32 messageHash)',
  },
  LzPacket: {
    topic: '0xe9bded5f24a4168e4f3bf44e00298c993b22376aad8c58c7dda9718a54cbea82',
    signature: 'Packet(bytes payload)',
  },
  AvailableOperatorJob: {
    topic: '0x4422a85db963f113e500bc4ada8f9e9f1a7bcd57cbec6907fbb2bf6aaf5878ff',
    signature: 'AvailableOperatorJob(bytes32 jobHash, bytes payload)',
  },
}
