import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { SupportedChainId } from 'constants/chains'
import { ORACLE_BASE_URL } from 'constants/muon'
import { makeHttpRequest } from 'utils/http'

/**
 * Primarily used by the /stablecoin/: route as an alternative to SUPPORTED_CHAIN_IDS
 * so people can still connect an unsupported chain (no user error) in our app, and 
 * then the wallet_switchEthereumChain still works. 
 */
export const DeiSupportedChains = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
]

export enum DeiStatus {
  OK = 'OK',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

const DEFAULT_SCALE = {
  collateralRatio: 1e6,
  fee: 1e4,
  poolCeiling: 1e6,
  poolBalance: 1e12,
}

export const Scales = {
  [SupportedChainId.MAINNET]: DEFAULT_SCALE,
  [SupportedChainId.POLYGON]: DEFAULT_SCALE,
  [SupportedChainId.BSC]: {
    ...DEFAULT_SCALE,
    poolCeiling: 1e12, // TODO CHECK IF THIS IS CORRECT
    poolBalance: 1e18, // TODO CHECK IF THIS IS CORRECT
  },
}

export const NUMBER_OF_POOLS: {[key: number]: number} = {
  [SupportedChainId.MAINNET]: 3,
  [SupportedChainId.POLYGON]: 4,
}

const initialState = {
  status: DeiStatus.LOADING,
  prices: {
    collateral: 0,
    dei: 0,
    deus: 0,
  },
  collateralRatio: 0,
  mintingFee: 0,
  redemptionFee: 0,
  poolBalance: 0,
  poolCeiling: 0,
}

interface OracleResponse {
  collateral_price: number,
  dei_price: number,
  deus_price: number,
}

export const fetchPrices = createAsyncThunk(
  'dei/fetchPrices',
  async ({ chainId }: { chainId: number }) => {
    if (!chainId) throw new Error('No chainId present')
    const { href: url } = new URL(`/dei/price?chainId=${chainId}`, ORACLE_BASE_URL)

    // Destruct the response directly so if these params don't exist it will throw an error.
    const { collateral_price, dei_price, deus_price }: OracleResponse = await makeHttpRequest(url)
    return {
      collateral: collateral_price,
      dei: dei_price,
      deus: deus_price,
    }
  }
)

const deiSlice = createSlice({
  name: 'dei',
  initialState,
  reducers: {
    updateStatus: (state, { payload }) => {
      state.status = payload
    },
    updateCollateralRatio: (state, { payload }) => {
      state.collateralRatio = payload
    },
    updatePoolBalance: (state, { payload }) => {
      state.poolBalance = payload
    },
    updatePoolCeiling: (state, { payload }) => {
      state.poolCeiling = payload
    },
    updateMintingFee: (state, { payload }) => {
      state.mintingFee = payload
    },
    updateRedemptionFee: (state, { payload }) => {
      state.redemptionFee = payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPrices.pending, (state) => {
        state.status = DeiStatus.LOADING
      })
      .addCase(fetchPrices.fulfilled, (state, { payload }) => {
        state.status = DeiStatus.OK
        state.prices = payload
      })
      .addCase(fetchPrices.rejected, () => {
        console.log('Unable to fetch DEI prices')
        return {
          ...initialState,
          status: DeiStatus.ERROR,
        }
      })
  }
})

const { actions, reducer } = deiSlice
export const { 
  updateStatus,
  updateCollateralRatio,
  updatePoolBalance, 
  updatePoolCeiling,
  updateMintingFee, 
  updateRedemptionFee, 
} = actions
export default reducer
