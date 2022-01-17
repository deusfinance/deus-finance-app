import { SupportedChainId } from './chains'
import { Tokens } from './tokens'

interface AddressMap {
  [chainId: number]: string
}

interface ProxyPath {
  [key: number]: {
    [key: string]: string[]
  }
}

function constructSameAddressMap(address: string, chainMapping: number[]): AddressMap {
  return chainMapping.reduce((acc: AddressMap, chainId: number) => {
    acc[chainId] = address
    return acc
  }, {})
}

export const Multicall2: AddressMap = {
  [SupportedChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [SupportedChainId.XDAI]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [SupportedChainId.HECO]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [SupportedChainId.POLYGON]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [SupportedChainId.FANTOM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
  // [SupportedChainId.AVALANCHE]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
}

/* =====================================
                DEI POOL
===================================== */
export const DeiPool: AddressMap = {
  ...constructSameAddressMap('0xc63eAf6BC162531b153Dfc61F225E62d2edB4488', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
  ]),
}

/* =====================================
              COLLATERAL
===================================== */
export const CollateralPool: AddressMap = {
  ...constructSameAddressMap('0xa0F395aD5df1Fceb319e162CCf1Ef6645dE8508f', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
  ]),
}

export const Collateral: AddressMap = {
  [SupportedChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  [SupportedChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
}

/* =====================================
              PROXIES
===================================== */
export const MintProxy: AddressMap = {
  [SupportedChainId.MAINNET]: '0xB095aA0A0A206ed943FAA7f5BD28A47Aaf2fEc09',
  [SupportedChainId.POLYGON]: '0x8E17742983CBa809bc554868D8a69A37e3a8a207',
}

export const MINT__PATHS: ProxyPath = {
  [SupportedChainId.MAINNET]: {
    DEUS: [
      Tokens.DEUS[SupportedChainId.MAINNET]['address'],
      Tokens.DEI[SupportedChainId.MAINNET]['address'],
      Collateral[SupportedChainId.MAINNET],
    ],
    ETH: [Tokens.WETH[SupportedChainId.MAINNET]['address'], Collateral[SupportedChainId.MAINNET]],
    USDC: [Collateral[SupportedChainId.MAINNET]],
    DAI: [Tokens.DAI[SupportedChainId.MAINNET]['address'], Collateral[SupportedChainId.MAINNET]],
    DEI: [Tokens.DEI[SupportedChainId.MAINNET]['address'], Collateral[SupportedChainId.MAINNET]],
    WBTC: [
      Tokens.WBTC[SupportedChainId.MAINNET]['address'],
      Tokens.WETH[SupportedChainId.MAINNET]['address'],
      Collateral[SupportedChainId.MAINNET],
    ],
  },

  [SupportedChainId.POLYGON]: {
    DEUS: [
      Tokens.DEUS[SupportedChainId.POLYGON]['address'],
      Tokens.DEI[SupportedChainId.POLYGON]['address'],
      Collateral[SupportedChainId.POLYGON],
    ],
    DEI: [Tokens.DEI[SupportedChainId.POLYGON]['address'], Collateral[SupportedChainId.POLYGON]],
    WETH: [Tokens.WETH[SupportedChainId.POLYGON]['address'], Collateral[SupportedChainId.POLYGON]],
    USDC: [Collateral[SupportedChainId.POLYGON]],
    MATIC: [Tokens.WMATIC[SupportedChainId.POLYGON]['address'], Collateral[SupportedChainId.POLYGON]],
  },
}
