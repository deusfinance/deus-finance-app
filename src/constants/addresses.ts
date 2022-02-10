import { constructSameAddressMap, AddressMap, ProxyPath } from 'utils/address'
import { SupportedChainId } from './chains'
import { Tokens, USDC } from './tokens'

export const Multicall2: AddressMap = {
  [SupportedChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [SupportedChainId.POLYGON]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [SupportedChainId.FANTOM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
}

/* =====================================
                DEI POOL
===================================== */
export const DeiPool: AddressMap = {
  ...constructSameAddressMap('0xc63eAf6BC162531b153Dfc61F225E62d2edB4488', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
    SupportedChainId.FANTOM,
  ]),
}

/* =====================================
              COLLATERAL
===================================== */
export const CollateralPool: AddressMap = {
  ...constructSameAddressMap('0xa0F395aD5df1Fceb319e162CCf1Ef6645dE8508f', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
    SupportedChainId.FANTOM,
    SupportedChainId.BSC,
  ]),
}

export const Collateral: AddressMap = USDC

/* =====================================
              PROXIES
===================================== */
export const MintProxy: AddressMap = {
  [SupportedChainId.MAINNET]: '0xB095aA0A0A206ed943FAA7f5BD28A47Aaf2fEc09',
  [SupportedChainId.POLYGON]: '0x8E17742983CBa809bc554868D8a69A37e3a8a207',
  [SupportedChainId.FANTOM]: '0x9cB18f11DdEfbDEb8766fc52B1d7E384036eB0fc',
}

export const MINT__PATHS: ProxyPath = {
  [SupportedChainId.MAINNET]: {
    DEUS: [
      Tokens.DEUS[SupportedChainId.MAINNET]['address'],
      Tokens.DEI[SupportedChainId.MAINNET]['address'],
      Collateral[SupportedChainId.MAINNET],
    ],
    ETH: [Tokens.WNATIVE[SupportedChainId.MAINNET]['address'], Collateral[SupportedChainId.MAINNET]],
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
    MATIC: [Tokens.WNATIVE[SupportedChainId.POLYGON]['address'], Collateral[SupportedChainId.POLYGON]],
  },

  [SupportedChainId.FANTOM]: {
    DEUS: [Tokens.DEUS[SupportedChainId.FANTOM]['address'], Collateral[SupportedChainId.FANTOM]],
    DEI: [Tokens.DEI[SupportedChainId.FANTOM]['address'], Collateral[SupportedChainId.FANTOM]],
    WETH: [Tokens.WETH[SupportedChainId.FANTOM]['address'], Collateral[SupportedChainId.FANTOM]],
    USDC: [Collateral[SupportedChainId.FANTOM]],
    FTM: [Tokens.WNATIVE[SupportedChainId.FANTOM]['address'], Collateral[SupportedChainId.FANTOM]],
  },
}
