import { useEffect } from 'react'
import { useAppDispatch, AppThunkDispatch } from 'state'

import useWeb3React from 'hooks/useWeb3'

import { fetchCurrentBlocks, fetchUnClaimed } from './reducer'

export default function Updater(): null {
  const { account } = useWeb3React()
  const thunkDispatch: AppThunkDispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      thunkDispatch(fetchUnClaimed({ address: account })) // TODO do we need to poll every block?
    }
  }, [thunkDispatch, account])

  useEffect(() => {
    if (account) {
      thunkDispatch(fetchCurrentBlocks()) // TODO do we need to poll every block?
    }
  }, [thunkDispatch, account])

  return null
}
