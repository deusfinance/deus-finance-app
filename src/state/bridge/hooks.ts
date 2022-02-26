import { useMemo } from 'react'
import { useAppSelector, AppState } from 'state'

export const useBridgeState = () => {
  return useAppSelector((state: AppState) => state.bridge)
}

export const useClaimableTokens = () => {
  const { unClaimed } = useBridgeState()
  return useMemo(() => unClaimed, [unClaimed])
}
