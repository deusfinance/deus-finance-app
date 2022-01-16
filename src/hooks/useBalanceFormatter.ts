import { useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

const DEFAULT_PRECISION = 9

export default function useBalanceFormatter(balanceBN: BigNumber, decimals: number) {
  const balanceUser: string = useMemo(() => {
    return (balanceBN && balanceBN.gt(0)) ? formatUnits(balanceBN, decimals) : '0'
  }, [balanceBN, decimals])

  const PRECISION = useMemo(() => {
    return Math.min(decimals, DEFAULT_PRECISION)
  }, [decimals])

  const balanceLabel: string = useMemo(() => {
    return !balanceUser
      ? '0.00'
      : parseFloat(balanceUser).toFixed(PRECISION).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
  }, [balanceUser, PRECISION])

  return {
    balanceUser,
    balanceLabel,
    balanceBN,
  }
}
