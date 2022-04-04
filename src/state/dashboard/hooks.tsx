import { useMemo } from 'react'
import { useAppSelector, AppState } from 'state'

export const useDashboardState = () => {
  return useAppSelector((state: AppState) => state.dashboard)
}

export const useDeusPrice = () => {
  const { deusPrice } = useDashboardState()
  return useMemo(() => deusPrice, [deusPrice])
}

export const useDeiMarketCap = () => {
  const { deiMarketCap } = useDashboardState()
  return useMemo(() => deiMarketCap, [deiMarketCap])
}
