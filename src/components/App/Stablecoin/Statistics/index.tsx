import React, { useMemo } from 'react'
import styled from 'styled-components'

import { formatAmount } from 'utils/numbers'

import { useDeiStatus, useDeiPrice, useCollateralRatio, usePoolBalance, usePoolCeiling } from 'state/dei/hooks'
import { DeiStatus, DeiSupportedChains } from 'state/dei/reducer'
import { Card } from 'components/Card'
import useWeb3React from 'hooks/useWeb3'

const Wrapper = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-align: left;
  gap: 20px;
  background: ${({ theme }) => theme.bg3};
  height: 270px;
`

const Stat = styled.div`
  color: ${({ theme }) => theme.text2};
  & > * {
    &:nth-child(2) {
      margin-top: 3px;
      color: ${({ theme }) => theme.primary1};
    }
  }
`
export default function Statistics() {
  const { chainId } = useWeb3React()
  const deiStatus = useDeiStatus()
  const deiPrice = useDeiPrice()
  const collateralRatio = useCollateralRatio()
  const poolBalance = usePoolBalance()
  const poolCeiling = usePoolCeiling()

  const [isSupported, loading, error]: boolean[] = useMemo(() => {
    return [
      chainId ? Object.values(DeiSupportedChains).includes(chainId) : false,
      deiStatus == DeiStatus.LOADING,
      deiStatus == DeiStatus.ERROR,
    ]
  }, [deiStatus, chainId])

  const deiPriceLabel = useMemo(() => {
    return loading || !isSupported ? 'Loading' : error ? 'Error' : `$${deiPrice.toFixed(5)}`
  }, [deiPrice, isSupported, loading, error])

  const collateralRatioLabel = useMemo(() => {
    return loading || !isSupported ? 'Loading' : error ? 'Error' : `${(collateralRatio * 100).toFixed(2)}%`
  }, [collateralRatio, isSupported, loading, error])

  const poolLabel = useMemo(() => {
    return loading || !isSupported
      ? 'Loading'
      : error
      ? 'Error'
      : `${formatAmount(poolBalance)} / ${formatAmount(poolCeiling)}`
  }, [poolBalance, poolCeiling, isSupported, loading, error])

  const mintLabel = useMemo(() => {
    return loading || !isSupported ? 'Loading' : error ? 'Error' : `${formatAmount(poolCeiling - poolBalance)}`
  }, [poolBalance, poolCeiling, isSupported, loading, error])

  return (
    <Wrapper>
      <Stat>
        <div>DEI PRICE</div>
        <div>{deiPriceLabel}</div>
      </Stat>
      <Stat>
        <div>COLLATERAL RATIO</div>
        <div>{collateralRatioLabel}</div>
      </Stat>
      <Stat>
        <div>POOL BALANCE / CEILING</div>
        <div>{poolLabel}</div>
      </Stat>
      <Stat>
        <div>AVAILABLE TO MINT</div>
        <div>{mintLabel}</div>
      </Stat>
    </Wrapper>
  )
}
