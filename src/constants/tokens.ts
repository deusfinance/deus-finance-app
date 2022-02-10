import { duplicateTokenByAddressMap, duplicateTokenByChainId, Token, TokenMap } from 'utils/token'
import { SupportedChainId } from './chains'

import USDC_LOGO from 'assets/img/tokens/usdc.svg'
import USDT_LOGO from 'assets/img/tokens/usdt.svg'
import DAI_LOGO from 'assets/img/tokens/dai.svg'
import DEI_LOGO from 'assets/img/tokens/dei.svg'
import DEUS_LOGO from 'assets/img/tokens/deus.svg'
import ETH_LOGO from 'assets/img/tokens/ethereum.svg'
import WBTC_LOGO from 'assets/img/tokens/wbtc.svg'
import MATIC_LOGO from 'assets/img/tokens/matic.svg'
import FTM_LOGO from 'assets/img/tokens/ftm.svg'

/* =====================================
                WETH ADDRESS
===================================== */
export const WETH = {
  [SupportedChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SupportedChainId.POLYGON]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  [SupportedChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
}

/* =====================================
                USDC ADDRESS
===================================== */
export const USDC = {
  [SupportedChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [SupportedChainId.RINKEBY]: '0x49AC7cEDdb9464DA9274b164Cd6BA7129Da2C03E',
  [SupportedChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [SupportedChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [SupportedChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

/* =====================================
                WRAPPED NATIVE ADDRESS
===================================== */
export const WRAPPED_NATIVE = {
  [SupportedChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [SupportedChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [SupportedChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [SupportedChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [SupportedChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
}

//TODO: replace Matic and ETH with NATIVE in whole app
export const Tokens: { [key: string]: TokenMap } = {
  USDT: {
    1: new Token(1, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether', USDT_LOGO),
  },
  DAI: {
    1: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai', DAI_LOGO),
  },
  ETH: {
    1: new Token(1, '0x', 18, 'ETH', 'ETH', ETH_LOGO),
  },
  WBTC: {
    1: new Token(1, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'wBTC', WBTC_LOGO),
  },
  MATIC: {
    137: new Token(137, '0x', 18, 'MATIC', 'MATIC', MATIC_LOGO),
  },
  WMATIC: {
    137: new Token(137, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'wMATIC', MATIC_LOGO),
  },
  WETH: duplicateTokenByAddressMap(WETH, 18, 'WETH', 'wETH', ETH_LOGO),
  USDC: duplicateTokenByAddressMap(USDC, 6, 'USDC', 'USD//C', USDC_LOGO, { [SupportedChainId.BSC]: 18 }),
  DEI: duplicateTokenByChainId('0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3', 18, 'DEI', 'DEI', DEI_LOGO),
  DEUS: duplicateTokenByChainId('0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44', 18, 'DEUS', 'DEUS', DEUS_LOGO),
  WNATIVE: {
    [SupportedChainId.MAINNET]: new Token(1, WRAPPED_NATIVE[1], 18, 'WETH', 'Wrapped Ether', ETH_LOGO),
    [SupportedChainId.RINKEBY]: new Token(4, WRAPPED_NATIVE[4], 18, 'WETH', 'Wrapped Ether', ETH_LOGO),
    [SupportedChainId.POLYGON]: new Token(137, WRAPPED_NATIVE[137], 18, 'WMATIC', 'Wrapped Matic', MATIC_LOGO),
    [SupportedChainId.FANTOM]: new Token(250, WRAPPED_NATIVE[250], 18, 'WFTM', 'Wrapped Fantom', FTM_LOGO), //TODO: change logo
    [SupportedChainId.BSC]: new Token(56, WRAPPED_NATIVE[56], 18, 'WBNB', 'Wrapped BNB', MATIC_LOGO), //TODO: change logo
  },
  NATIVE: {
    [SupportedChainId.MAINNET]: new Token(1, '0x', 18, 'ETH', 'Ether', ETH_LOGO),
    [SupportedChainId.RINKEBY]: new Token(4, '0x', 18, 'ETH', 'Ether', ETH_LOGO),
    [SupportedChainId.POLYGON]: new Token(137, '0x', 18, 'MATIC', 'MATIC', MATIC_LOGO),
    [SupportedChainId.FANTOM]: new Token(250, '0x', 18, 'FTM', 'Fantom', FTM_LOGO), //TODO: change logo
    [SupportedChainId.BSC]: new Token(56, '0x', 18, 'BNB', 'BNB', MATIC_LOGO), //TODO: change logo
  },
}
