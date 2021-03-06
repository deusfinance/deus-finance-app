import { useEffect } from 'react'
import { useAppDispatch, AppThunkDispatch } from 'state'

import { autoRefresh } from 'utils/retry'
import { fetchCurrentBlocks, fetchInfo, fetchUnClaimed } from './reducer'
import useWeb3React from 'hooks/useWeb3'
import { useClaimableTokens } from './hooks'

export default function Updater(): null {
  const { account } = useWeb3React()
  const thunkDispatch: AppThunkDispatch = useAppDispatch()
  const unClaimed = useClaimableTokens()

  useEffect(() => {
    if (account) {
      return autoRefresh(() => thunkDispatch(fetchUnClaimed({ address: account })), 20)
    }
  }, [thunkDispatch, account])

  useEffect(() => {
    if (account && unClaimed && unClaimed.length > 0) {
      return autoRefresh(() => thunkDispatch(fetchCurrentBlocks()), 15)
    }
  }, [unClaimed, thunkDispatch, account])

  useEffect(() => {
    return autoRefresh(() => thunkDispatch(fetchInfo()), 60)
  }, [thunkDispatch])

  return null
}
