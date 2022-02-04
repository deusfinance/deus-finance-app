import { INFURA_KEY } from './keys'

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  BSC = 56,
  POLYGON = 137,
  FANTOM = 250,
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
}
