import { createReducer, nanoid } from '@reduxjs/toolkit'

import {
  addPopup,
  removePopup,
  setOpenModal,
  updateBlockNumber,
  updateChainId
} from './actions'

export enum ApplicationModal {
  WALLET = 'WALLET',
  NETWORK = 'NETWORK',
}

export type PopupContent = {
  txn: {
    hash: string,
    success: boolean,
    summary?: string,
  }
}

type PopupList = Array<{
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly chainId: number | null
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
}

const initialState: ApplicationState  = {
  blockNumber: {},
  chainId: null,
  openModal: null,
  popupList: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateChainId, (state, { payload }) => {
      const { chainId } = payload
      state.chainId = chainId
    })
    .addCase(updateBlockNumber, (state, { payload }) => {
      const { chainId, blockNumber } = payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, { payload }) => {
      state.openModal = payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 25000 }}) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload }) => {
      const { key } = payload
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
