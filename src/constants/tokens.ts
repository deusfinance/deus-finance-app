import { Token, IToken } from 'utils/token'
import { SUPPORTED_CHAIN_IDS } from './chains'

import USDC_LOGO from 'assets/images/network/MAINNET.jpg'
import USDT_LOGO from 'assets/images/network/MAINNET.jpg'
import DAI_LOGO from 'assets/images/network/MAINNET.jpg'
import DEI_LOGO from 'assets/images/network/MAINNET.jpg'
import DEUS_LOGO from 'assets/images/network/MAINNET.jpg'
import ETH_LOGO from 'assets/images/network/MAINNET.jpg'
import WBTC_LOGO from 'assets/images/network/MAINNET.jpg'
import MATIC_LOGO from 'assets/images/network/MAINNET.jpg'

type TokenMap = {
  [key: number]: IToken
}

function duplicateTokenByChainId(
  address: string,
  decimals: number,
  name: string,
  symbol: string,
  logo: StaticImageData
): TokenMap {
  return SUPPORTED_CHAIN_IDS.reduce((acc: TokenMap, chainId: number) => {
    acc[chainId] = new Token(chainId, address, decimals, name, symbol, logo)
    return acc
  }, {})
}

export const Tokens: { [key: string]: TokenMap } = {
  USDC: {
    1: new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USDC', USDC_LOGO),
    137: new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USDC', USDC_LOGO),
  },
  USDT: {
    1: new Token(1, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether', USDT_LOGO),
  },
  DAI: {
    1: new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai', DAI_LOGO),
  },
  ETH: {
    1: new Token(1, '0x', 18, 'ETH', 'ETH', ETH_LOGO),
  },
  WETH: {
    1: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'wETH', ETH_LOGO),
    137: new Token(137, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 18, 'WETH', 'wETH', ETH_LOGO),
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
  DEI: duplicateTokenByChainId('0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3', 18, 'DEI', 'DEI', DEI_LOGO),
  DEUS: duplicateTokenByChainId('0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44', 18, 'DEUS', 'DEUS', DEUS_LOGO),
}
