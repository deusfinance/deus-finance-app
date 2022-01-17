import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state'

import { updateUserSlippageTolerance } from './actions'

export function useSetUserSlippageTolerance(): (slippageTolerance: number | 'auto') => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (userSlippageTolerance: number | 'auto') => {
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance,
        })
      )
    },
    [dispatch]
  )
}

/**
 * Return the user's slippage tolerance
 */
export function useUserSlippageTolerance(): number | 'auto' {
  return useAppSelector((state) => {
    return state.user.userSlippageTolerance
  })
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: number): number {
  const allowedSlippage = useUserSlippageTolerance()
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance]
  )
}
