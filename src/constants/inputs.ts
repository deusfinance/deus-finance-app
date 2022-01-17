import { IToken } from 'utils/token'
import { SupportedChainId } from './chains'
import { Tokens } from './tokens'

interface TokenMap {
  [chainId: number]: Array<IToken[]>
}

/* =====================================
                  MINT
===================================== */
export const MINT__INPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [
    [Tokens.USDC[SupportedChainId.MAINNET]],
    [Tokens.USDC[SupportedChainId.MAINNET], Tokens.DEUS[SupportedChainId.MAINNET]],
    [Tokens.ETH[SupportedChainId.MAINNET]],
    [Tokens.DAI[SupportedChainId.MAINNET]],
    [Tokens.WBTC[SupportedChainId.MAINNET]],
  ],
  [SupportedChainId.POLYGON]: [
    [Tokens.USDC[SupportedChainId.POLYGON]],
    [Tokens.USDC[SupportedChainId.POLYGON], Tokens.DEUS[SupportedChainId.POLYGON]],
    [Tokens.MATIC[SupportedChainId.POLYGON]],
    [Tokens.WETH[SupportedChainId.POLYGON]],
  ],
}

export const MINT__OUTPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens['DEI'][SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens['DEI'][SupportedChainId.POLYGON]]],
}

/* =====================================
                  REDEEM
===================================== */
export const REDEEM__INPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens['DEI'][SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens['DEI'][SupportedChainId.POLYGON]]],
}
export const REDEEM__OUTPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens.USDC[SupportedChainId.MAINNET], Tokens.DEUS[SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens.USDC[SupportedChainId.POLYGON], Tokens.DEUS[SupportedChainId.POLYGON]]],
}
