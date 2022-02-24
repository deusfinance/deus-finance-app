import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BRIDGE_URL } from 'constants/keys'
import { makeHttpRequest } from 'utils/http'

export enum UnClaimBridgeState {
  OK = 'OK',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

const initialState = {
  status: UnClaimBridgeState.OK,
  unClaimed: [],
}

export const fetchUnClaimed = createAsyncThunk('bridge/fetchUnClaimed', async ({ address }: { address: string }) => {
  if (!address) throw new Error('No address present')
  const { href: url } = new URL(`/deposit?address=${address}&isClaimed=true`, BRIDGE_URL)

  // Destruct the response directly so if these params don't exist it will throw an error.
  const unClaimed = await makeHttpRequest(url)
  return unClaimed
})

const bridgeSlice = createSlice({
  name: 'bridge',
  initialState,
  reducers: {},
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
  },
})

const { reducer } = bridgeSlice
export default reducer
