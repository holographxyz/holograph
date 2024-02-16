import {beforeAll, describe, expect, it} from 'vitest'

import {Config} from '../../services/config.service'
import {Providers} from '../../services'
import {ChainIdType, InterfaceType, Interfaces, TokenUriType} from '../../contracts'
import {Address} from 'abitype'

const NETWORKS_MOCK = {
  5: process.env.ETHEREUM_TESTNET_RPC ?? '',
  80001: process.env.POLYGON_TESTNET_RPC ?? '',
}

//NOTICE: the expected values are for the development env -> 0x8dd0A4D129f03F1251574E545ad258dE26cD5e97
const expectedValues = {
  contractAddress: '0xd9e5f062a539b421af91013a401f93677d439ee1',
  nameExample: 'Test',
  imageUrlExample: 'imageUrl',
  externalLinkExample: 'externalLink.com',
  bpsExample: 1,
  contractAddressExample: '0xe713aaa55cea11f7abfbdc894f4945b05c7c5690',
  contractUriExample:
    'data:application/json;base64,eyJuYW1lIjoiVGVzdCIsImRlc2NyaXB0aW9uIjoiVGVzdCIsImltYWdlIjoiaW1hZ2VVcmwiLCJleHRlcm5hbF9saW5rIjoiZXh0ZXJuYWxMaW5rLmNvbSIsInNlbGxlcl9mZWVfYmFzaXNfcG9pbnRzIjoxLCJmZWVfcmVjaXBpZW50IjoiMHhlNzEzYWFhNTVjZWExMWY3YWJmYmRjODk0ZjQ5NDViMDVjN2M1NjkwIn0',
  fromChainIdTypeExample: ChainIdType.EVM,
  fromChainIdExample: 5n,
  toChainIdTypeExample: ChainIdType.HOLOGRAPH,
  toChainIdExample: '4000000011',
}

const supportedPrepends: {type: number; prepend: string}[] = [
  {type: TokenUriType.UNDEFINED, prepend: ''},
  {type: TokenUriType.IPFS, prepend: 'ipfs://'},
  {type: TokenUriType.HTTPS, prepend: 'https://'},
  {type: TokenUriType.ARWEAVE, prepend: 'ar://'},
]

const EIP165_ID = '0x01ffc9a7'

describe('Contract class: Interfaces', () => {
  let config: Config
  let providersWrapper: Providers
  let interfaces: Interfaces
  const chainIds = Object.keys(NETWORKS_MOCK)

  beforeAll(() => {
    config = Config.getInstance(NETWORKS_MOCK)
    providersWrapper = new Providers(config)
    interfaces = new Interfaces(config)
  })

  it('should be able to get the Interfaces wrapper class', () => {
    expect(interfaces).toHaveProperty('contractURI')
    expect(interfaces).toHaveProperty('getUriPrepend')
    expect(interfaces).toHaveProperty('getChainIdByNetworks')
  })

  it('getAddress(): should be able to get the correct Interfaces contract address according to the environment and chainId', async () => {
    const address = (await interfaces.getAddress(Number(chainIds[1]))).toLowerCase()
    expect(address).toBe(expectedValues.contractAddress)
  })

  it('contractURI(): should be able to get the base64 encoded contract URI JSON string', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])
    const contractUri = await interfaces.contractURI(
      chainId,
      expectedValues.nameExample,
      expectedValues.imageUrlExample,
      expectedValues.externalLinkExample,
      expectedValues.bpsExample,
      expectedValues.contractAddressExample as Address,
    )

    expect(contractUri).toBe(expectedValues.contractUriExample)
  })

  it('contractURIByNetworks(): should be able to get the base64 encoded contract URI JSON string per network', async () => {
    const contractUriByNetworks = await interfaces.contractURIByNetworks(
      expectedValues.nameExample,
      expectedValues.imageUrlExample,
      expectedValues.externalLinkExample,
      expectedValues.bpsExample,
      expectedValues.contractAddressExample as Address,
    )

    Object.values(contractUriByNetworks).forEach(contractUri => {
      expect(contractUri).toBe(expectedValues.contractUriExample)
    })
  })

  it('getUriPrepend(): should be able to get the prepend to use for tokenURI', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    const uriPrepend = await interfaces.getUriPrepend(chainId, supportedPrepends[2].type)

    expect(uriPrepend).toBe(supportedPrepends[2].prepend)
  })

  it('getUriPrependByNetworks(): should be able to get the prepend to use for tokenURI per network', async () => {
    const uriPrependByNetworks = await interfaces.getUriPrependByNetworks(supportedPrepends[2].type)

    Object.values(uriPrependByNetworks).forEach(uriPrepend => {
      expect(uriPrepend).toBe(supportedPrepends[2].prepend)
    })
  })

  it('getChainId(): should be able to convert from EVM chainId to Holograph chainId', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    const toChainIdValue = await interfaces.getChainId(
      chainId,
      expectedValues.fromChainIdTypeExample,
      expectedValues.fromChainIdExample,
      expectedValues.toChainIdTypeExample,
    )

    expect(toChainIdValue).toBe(expectedValues.toChainIdExample)
  })

  it('getChainIdByNetworks(): should be able to convert from EVM chainId to Holograph chainId per network', async () => {
    const toChainIdValueByNetworks = await interfaces.getChainIdByNetworks(
      expectedValues.fromChainIdTypeExample,
      expectedValues.fromChainIdExample,
      expectedValues.toChainIdTypeExample,
    )

    Object.values(toChainIdValueByNetworks).forEach(toChainIdValue => {
      expect(toChainIdValue).toBe(expectedValues.toChainIdExample)
    })
  })

  it('supportsInterface(): should be able to validate if an interface is supported', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    const supportsInterface = await interfaces.supportsInterface(chainId, InterfaceType.ERC721, EIP165_ID)

    expect(supportsInterface).toBe('true')
  })

  it('supportsInterfaceByNetworks(): should be able to validate if an interface is supported per network', async () => {
    const supportsInterfaceByNetworks = await interfaces.supportsInterfaceByNetworks(InterfaceType.ERC721, EIP165_ID)

    Object.values(supportsInterfaceByNetworks).forEach(supportsInterface => {
      expect(supportsInterface).toBe('true')
    })
  })

  it.skip('updateInterface(): should be able to update if a interface is supported or nor', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    const supportsInterface = await interfaces.updateInterface(chainId, InterfaceType.ERC721, EIP165_ID, false)

    // expect(supportsInterface).toBe('true')
  })

  it.skip('updateInterfaces(): should be able to update if a list of supported interfaces', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    const supportsInterface = await interfaces.updateInterfaces(chainId, InterfaceType.ERC721, [EIP165_ID], false)

    // expect(supportsInterface).toBe('true')
  })

  it.skip('updateChainIdMap(): should be able to update the helper structure to convert between the different types of chainIds', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    // await interfaces.updateChainIdMap()
  })

  it.skip('updateUriPrepend(): should be able to update the the prepend string for a TokenUriType', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    //  await interfaces.updateUriPrepend()
  })

  it.skip('updateUriPrepends(): should be able to update the prepends strings for an array of TokenUriTypes', async () => {
    const chainId = Number(Object.keys(NETWORKS_MOCK)[0])

    //  await interfaces.updateUriPrepends()
  })
})
