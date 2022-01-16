import { createAction } from '@reduxjs/toolkit'

import { ApplicationModal, PopupContent } from './reducer'

export const updateChainId = createAction<{ chainId: number }>('application/updateChainId')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const updateBlockNumber = createAction<{ chainId: number, blockNumber: number}>('application/updateBlockNumber')
export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{ key?: string }>('application/removePopup')
