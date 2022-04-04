import { INFURA_KEY } from './keys'

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  BSC = 56,
  POLYGON = 137,
  FANTOM = 250,
  ARBITRUM = 42161,
  METIS = 1088,
}

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export const NETWORK_URLS = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.BSC]: 'https://bsc-dataseed1.binance.org',
  [SupportedChainId.POLYGON]: 'https://polygon-rpc.com',
  [SupportedChainId.FANTOM]: 'https://rpc.ftm.tools',
  [SupportedChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [SupportedChainId.METIS]: 'https://andromeda.metis.io/?owner=1088',
}

export const BridgeMinimumBlockNeed = {
  [SupportedChainId.MAINNET]: 24,
  [SupportedChainId.POLYGON]: 256,
  [SupportedChainId.RINKEBY]: 24,
  [SupportedChainId.BSC]: 30,
  [SupportedChainId.FANTOM]: 6,
  [SupportedChainId.METIS]: 35,
  [SupportedChainId.ARBITRUM]: 12,
}
