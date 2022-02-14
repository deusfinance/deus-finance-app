import { useState, useCallback, useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import debounce from 'lodash/debounce'

import { useCollateralRatio, useCollateralPrice, useDeusPrice, useRedemptionFee, useDeiStatus } from 'state/dei/hooks'
import { DeiStatus } from 'state/dei/reducer'
import toast from 'react-hot-toast'

export default function useRedeemAmounts(): {
  amountIn: string
  amountOut1: string
  amountOut2: string
  onUserInput: (amount: string) => void
  onUserOutput1: (amount: string) => void
  onUserOutput2: (amount: string) => void
} {
  const cPrice = useCollateralPrice()
  const cRatio = useCollateralRatio()
  const feePercentage = useRedemptionFee()
  const dPrice = useDeusPrice()
  const deiStatus = useDeiStatus()

  const [amountIn, setAmountIn] = useState<string>('')
  const [amountOut1, setAmountOut1] = useState<string>('')
  const [amountOut2, setAmountOut2] = useState<string>('')

  const [collateralRatio, collateralPrice, deusPrice]: BigNumber[] = useMemo(() => {
    return [new BigNumber(cRatio), new BigNumber(cPrice), new BigNumber(dPrice)]
  }, [cRatio, cPrice, dPrice])

  const feeFactorBN: BigNumber = useMemo(() => {
    return new BigNumber(1 - feePercentage / 100)
  }, [feePercentage])

  const debounceUserInput = useCallback(
    debounce((amount: string) => {
      if (amount === '') {
        setAmountOut1('')
        setAmountOut2('')
        return
      }
      if (deiStatus == DeiStatus.ERROR) {
        toast.error('Missing dependencies from oracle.')
        return
      }

      const inputAmount1 = new BigNumber(amount)
      let outputAmount1 = inputAmount1.times(collateralPrice).times(collateralRatio).times(feeFactorBN)
      let outputAmount2 = inputAmount1
        .times(1 - cRatio)
        .div(deusPrice)
        .times(feeFactorBN)

      if (cRatio === 0) {
        if (outputAmount1.isZero()) outputAmount1 = outputAmount2
        else if (outputAmount1.isZero()) outputAmount2 = outputAmount1
      }
      setAmountOut1(outputAmount1.toString())
      setAmountOut2(outputAmount2.toString())
    }, 300),
    [cRatio, collateralRatio, collateralPrice, deusPrice, feeFactorBN]
  )

  const debounceUserOutput1 = useCallback(
    debounce((amount: string) => {
      if (amount === '') {
        setAmountIn('')
        setAmountOut2('')
        return
      }
      if (deiStatus == DeiStatus.ERROR) {
        toast.error('Missing dependencies from oracle.')
        return
      }

      const outputAmount1 = new BigNumber(amount)
      let inputAmount = outputAmount1.div(collateralPrice).div(collateralRatio).div(feeFactorBN)
      const outputAmount2 = outputAmount1
        .div(collateralPrice)
        .div(collateralRatio)
        .times(1 - cRatio)
        .div(deusPrice)

      if (cRatio === 0) {
        inputAmount = outputAmount1.times(deusPrice).div(feeFactorBN)
      }
      setAmountIn(inputAmount.toString())
      setAmountOut2(outputAmount2.toString())
    }, 300),
    [cRatio, collateralRatio, collateralPrice, deusPrice, feeFactorBN]
  )

  const debounceUserOutput2 = useCallback(
    debounce((amount: string) => {
      if (amount === '') {
        setAmountIn('')
        setAmountOut1('')
        return
      }

      if (deiStatus == DeiStatus.ERROR) {
        toast.error('Missing dependencies from oracle.')
        return
      }

      const outputAmount2 = new BigNumber(amount)
      const inputAmount = outputAmount2
        .times(deusPrice)
        .div(1 - cRatio)
        .div(feeFactorBN)

      const outputAmount1 = outputAmount2
        .times(collateralPrice)
        .times(collateralRatio)
        .div(1 - cRatio)
        .times(deusPrice)

      setAmountIn(inputAmount.toString())
      setAmountOut1(outputAmount1.toString())
    }, 300),
    [cRatio, collateralRatio, collateralPrice, deusPrice, feeFactorBN]
  )

  const onUserInput = (amount: string): void => {
    setAmountIn(amount)
    debounceUserInput(amount)
  }
  const onUserOutput1 = (amount: string): void => {
    setAmountOut1(amount)
    debounceUserOutput1(amount)
  }
  const onUserOutput2 = (amount: string): void => {
    setAmountOut2(amount)
    debounceUserOutput2(amount)
  }

  return {
    amountIn,
    amountOut1,
    amountOut2,
    onUserInput,
    onUserOutput1,
    onUserOutput2,
  }
}
