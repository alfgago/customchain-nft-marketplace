import {
  arbitrum,
  goerli,
  mainnet,
  polygon,
  optimism,
  Chain,
} from 'wagmi/chains'

//CONFIGURABLE: The default export controls the supported chains for the marketplace. Removing
// or adding chains will result in adding more or less chains to the marketplace.
// They are an extension of the wagmi chain objects

type ReservoirChain = Chain & {
  lightIconUrl: string
  darkIconUrl: string
  reservoirBaseUrl: string
  proxyApi: string
  routePrefix: string
  apiKey?: string
  coingeckoId?: string
  collectionSetId?: string
  community?: string
}

export const DefaultChain: ReservoirChain = {
  ...goerli,
    lightIconUrl: '/icons/goerli-icon-dark.svg',
    darkIconUrl: '/icons/goerli-icon-light.svg',
    reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    proxyApi: '/api/reservoir/goerli',
    routePrefix: 'goerli',
    apiKey: process.env.GOERLI_RESERVOIR_API_KEY,
    coingeckoId: 'goerli-eth',
    collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COLLECTION_SET_ID ?? "bf5e3dab21d886a9049ecfec1c28b569d9317f836f980148bff2b7742d837afa",
}

export default [
  DefaultChain,
  /*
  {
    ...polygon,
    lightIconUrl: '/icons/polygon-icon-dark.svg',
    darkIconUrl: '/icons/polygon-icon-light.svg',
    reservoirBaseUrl: 'https://api-polygon.reservoir.tools',
    proxyApi: '/api/reservoir/polygon',
    routePrefix: 'polygon',
    apiKey: process.env.POLYGON_RESERVOIR_API_KEY,
    coingeckoId: 'matic-network',
    collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID ?? "bf5e3dab21d886a9049ecfec1c28b569d9317f836f980148bff2b7742d837afa",
  },
  */
  {
    ...goerli,
    lightIconUrl: '/icons/goerli-icon-dark.svg',
    darkIconUrl: '/icons/goerli-icon-light.svg',
    reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    proxyApi: '/api/reservoir/goerli',
    routePrefix: 'goerli',
    apiKey: process.env.GOERLI_RESERVOIR_API_KEY,
    coingeckoId: 'goerli-eth',
    collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COLLECTION_SET_ID ?? "bf5e3dab21d886a9049ecfec1c28b569d9317f836f980148bff2b7742d837afa",
  },
] as ReservoirChain[]
