import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, useAppSelector } from 'state'

export interface RedeemState {
  attemptingTxn: boolean
  showReview: boolean
  error?: string
}

const initialState: RedeemState = {
  attemptingTxn: false,
  showReview: false,
  error: undefined,
}

export const redeemSlice = createSlice({
  name: 'redeem',
  initialState,
  reducers: {
    setRedeemState: (state, action: PayloadAction<RedeemState>) => {
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
})

export const { setRedeemState, setAttemptingTxn, setShowReview, setError } = redeemSlice.actions

export function useRedeemState(): RedeemState {
  return useAppSelector((state: AppState) => state.redeem)
}

export default redeemSlice.reducer
