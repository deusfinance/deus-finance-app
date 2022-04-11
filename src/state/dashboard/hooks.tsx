import { useMemo } from 'react'
import { useAppSelector, AppState } from 'state'

export const useDashboardState = () => {
  return useAppSelector((state: AppState) => state.dashboard)
}

export const useDeusPrice = () => {
  const {
    deusPrice,
    deusMarketCap,
    deusTotalSupply,
    deusFullyDilutedValuation,
    deusEmissions,
    deusBurnedEvents,
    deusDexLiquidity,
    stakedDeusLiquidity,
  } = useDashboardState()
  return useMemo(() => {
    return {
      deusPrice,
      deusMarketCap,
      deusTotalSupply,
      deusFullyDilutedValuation,
      deusEmissions,
      deusBurnedEvents,
      deusDexLiquidity,
      stakedDeusLiquidity,
    }
  }, [
    deusPrice,
    deusMarketCap,
    deusTotalSupply,
    deusFullyDilutedValuation,
    deusEmissions,
    deusBurnedEvents,
    deusDexLiquidity,
    stakedDeusLiquidity,
  ])
}

export const useDeiMarketCap = () => {
  const { deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity } = useDashboardState()
  return useMemo(() => {
    return { deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity }
  }, [deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity])
}
