import { IToken } from 'utils/token'
import { SupportedChainId } from './chains'
import { Tokens } from './tokens'

interface TokenMap {
  [chainId: number]: Array<IToken[]>
}
interface BridgeToken {
  symbol: string
  tokenId: number
  sourceChains: SupportedChainId[]
  destinationChains: SupportedChainId[]
}

/* =====================================
                  MINT
===================================== */
export const MINT__INPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [
    [Tokens.USDC[SupportedChainId.MAINNET]],
    [Tokens.USDC[SupportedChainId.MAINNET], Tokens.DEUS[SupportedChainId.MAINNET]],
    [Tokens.NATIVE[SupportedChainId.MAINNET]],
    [Tokens.DAI[SupportedChainId.MAINNET]],
    [Tokens.WBTC[SupportedChainId.MAINNET]],
  ],
  [SupportedChainId.POLYGON]: [
    [Tokens.USDC[SupportedChainId.POLYGON]],
    [Tokens.USDC[SupportedChainId.POLYGON], Tokens.DEUS[SupportedChainId.POLYGON]],
    [Tokens.NATIVE[SupportedChainId.POLYGON]],
    [Tokens.WETH[SupportedChainId.POLYGON]],
  ],
  [SupportedChainId.FANTOM]: [
    [Tokens.USDC[SupportedChainId.FANTOM]],
    [Tokens.USDC[SupportedChainId.FANTOM], Tokens.DEUS[SupportedChainId.FANTOM]],
    [Tokens.NATIVE[SupportedChainId.FANTOM]],
    [Tokens.WETH[SupportedChainId.FANTOM]],
  ],
}

export const MINT__OUTPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens['DEI'][SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens['DEI'][SupportedChainId.POLYGON]]],
  [SupportedChainId.FANTOM]: [[Tokens['DEI'][SupportedChainId.FANTOM]]],
}

/* =====================================
                  REDEEM
===================================== */
export const REDEEM__INPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens['DEI'][SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens['DEI'][SupportedChainId.POLYGON]]],
  [SupportedChainId.FANTOM]: [[Tokens['DEI'][SupportedChainId.FANTOM]]],
}
export const REDEEM__OUTPUTS: TokenMap = {
  [SupportedChainId.MAINNET]: [[Tokens.USDC[SupportedChainId.MAINNET], Tokens.DEUS[SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[Tokens.USDC[SupportedChainId.POLYGON], Tokens.DEUS[SupportedChainId.POLYGON]]],
  [SupportedChainId.FANTOM]: [[Tokens.USDC[SupportedChainId.FANTOM], Tokens.DEUS[SupportedChainId.FANTOM]]],
}

/* =====================================
                  BRIDGE
===================================== */
export const BRIDGE__TOKENS: { [symbol: string]: BridgeToken } = {
  [Tokens.DEI[SupportedChainId.MAINNET].symbol]: {
    symbol: Tokens.DEI[SupportedChainId.MAINNET].symbol,
    tokenId: 0,
    sourceChains: [SupportedChainId.MAINNET, SupportedChainId.POLYGON, SupportedChainId.FANTOM],
    destinationChains: [SupportedChainId.MAINNET, SupportedChainId.POLYGON, SupportedChainId.FANTOM],
  },
  [Tokens.DEUS[SupportedChainId.MAINNET].symbol]: {
    symbol: Tokens.DEUS[SupportedChainId.MAINNET].symbol,
    tokenId: 1,
    sourceChains: [SupportedChainId.POLYGON, SupportedChainId.MAINNET, SupportedChainId.FANTOM],
    destinationChains: [SupportedChainId.FANTOM, SupportedChainId.MAINNET, SupportedChainId.POLYGON],
  },
}
