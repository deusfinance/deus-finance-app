import { createReducer } from '@reduxjs/toolkit'

import { updateUserSlippageTolerance } from './actions'

export interface UserState {
  userSlippageTolerance: number | 'auto'
}

export const initialState: UserState = {
  userSlippageTolerance: 'auto',
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateUserSlippageTolerance, (state, action) => {
    state.userSlippageTolerance = action.payload.userSlippageTolerance
  })
)
