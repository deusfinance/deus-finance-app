import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { SupportedChainId } from 'constants/chains'
import { INFO_URL } from 'constants/keys'
import { StaticImageData } from 'next/image'
import { makeHttpRequest } from 'utils/http'

export enum UnClaimBridgeState {
  OK = 'OK',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}
export interface BridgeState {
  status: UnClaimBridgeState
  attemptingTxn: boolean
  showReview: boolean
  unClaimed: []
  currentBlocks: []
  info: null
  error?: string
}

const initialState: BridgeState = {
  status: UnClaimBridgeState.OK,
  attemptingTxn: false,
  showReview: false,
  unClaimed: [],
  currentBlocks: [],
  info: null,
  error: undefined,
}

export interface IClaimToken {
  symbol: string
  tokenId: number
  fromChainId: number | SupportedChainId
  toChainId: number | SupportedChainId
  amount: number
  decimals: number
  txId: string
  depositedBlock: number
  claimableBlock: number
  isClaimed?: boolean
  logo: StaticImageData | string
}

export const fetchUnClaimed = createAsyncThunk('bridge/fetchUnClaimed', async ({ address }: { address: string }) => {
  if (!address) throw new Error('No address present')
  const { href: url } = new URL(`/bridge/deposits?address=${address}&isClaimed=false`, INFO_URL)

  // Destruct the response directly so if these params don't exist it will throw an error.
  const unClaimed = await makeHttpRequest(url)
  return unClaimed ?? []
})

export const fetchCurrentBlocks = createAsyncThunk('bridge/fetchCurrentBlocks', async () => {
  const { href: url } = new URL(`bridge/currentBlocks`, INFO_URL)
  const currentBlocks = await makeHttpRequest(url)
  return currentBlocks ?? []
})

export const fetchInfo = createAsyncThunk('bridge/totals', async () => {
  const { href: url } = new URL(`bridge/totals`, INFO_URL)
  const currentBlocks = await makeHttpRequest(url)
  return currentBlocks
})

const bridgeSlice = createSlice({
  name: 'bridge',
  initialState,
  reducers: {
    setBridgeState: (state, action: PayloadAction<BridgeState>) => {
      state.attemptingTxn = action.payload.attemptingTxn
      state.showReview = action.payload.showReview
      state.error = action.payload.error
    },
    setAttemptingTxn: (state, action: PayloadAction<boolean>) => {
      state.attemptingTxn = action.payload
    },
    setShowReview: (state, action: PayloadAction<boolean>) => {
      state.showReview = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnClaimed.pending, (state) => {
        state.status = UnClaimBridgeState.LOADING
      })
      .addCase(fetchUnClaimed.fulfilled, (state, { payload }) => {
        state.status = UnClaimBridgeState.OK
        state.unClaimed = payload
      })
      .addCase(fetchUnClaimed.rejected, () => {
        console.log('Unable to fetch unclaimed tokens')
        return {
          ...initialState,
          status: UnClaimBridgeState.ERROR,
        }
      })
      .addCase(fetchCurrentBlocks.fulfilled, (state, { payload }) => {
        state.currentBlocks = payload
      })
      .addCase(fetchCurrentBlocks.rejected, () => {
        console.log('Unable to fetch current blocks')
      })
      .addCase(fetchInfo.fulfilled, (state, { payload }) => {
        state.info = payload
      })
      .addCase(fetchInfo.rejected, () => {
        console.log('Unable to fetch info')
      })
  },
})
const { reducer, actions } = bridgeSlice
export const { setBridgeState, setAttemptingTxn, setShowReview, setError } = actions
export default reducer
