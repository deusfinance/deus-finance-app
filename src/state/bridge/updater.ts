import { useEffect } from 'react'
import { useAppDispatch, AppThunkDispatch } from 'state'

import { autoRefresh } from 'utils/retry'
import { fetchCurrentBlocks, fetchUnClaimed } from './reducer'
import useWeb3React from 'hooks/useWeb3'

export default function Updater(): null {
  const { account } = useWeb3React()
  const thunkDispatch: AppThunkDispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      return autoRefresh(() => thunkDispatch(fetchUnClaimed({ address: account })), 30)
    }
  }, [thunkDispatch, account])

  useEffect(() => {
    if (account) {
      return autoRefresh(() => thunkDispatch(fetchCurrentBlocks()), 15)
    }
  }, [thunkDispatch, account])

  return null
}
