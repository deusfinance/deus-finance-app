import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { formatAmount } from 'utils/numbers'

import { useDeiStatus, useDeiPrice, useCollateralRatio, usePoolBalance, usePoolCeiling } from 'state/dei/hooks'
import { DeiStatus, DeiSupportedChains } from 'state/dei/reducer'
import { Card } from 'components/Card'
import useWeb3React from 'hooks/useWeb3'
import { DotFlashing } from 'components/Icons'

const Wrapper = styled(Card)`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-align: left;
  gap: 20px;
  background: ${({ theme }) => theme.bg0};
  height: 270px;
`

const Stat = styled.div`
  color: ${({ theme }) => theme.text1};

  & > * {
    &:nth-child(2) {
      margin-top: 3px;
      background-color: ${({ theme }) => theme.primary1};
      background-image: ${({ theme }) => theme.primary1};
      background-clip: text;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
  const theme = useTheme()

  const [isSupported, loading, error]: boolean[] = useMemo(() => {
    return [
      chainId ? Object.values(DeiSupportedChains).includes(chainId) : false,
      deiStatus == DeiStatus.LOADING,
      deiStatus == DeiStatus.ERROR,
    ]
  }, [deiStatus, chainId])

  const deiPriceLabel = useMemo(() => {
    return loading || !isSupported ? (
      <DotFlashing colour={theme.primary1} size={'10px'} gap={'3px'} />
    ) : error ? (
      'Error'
    ) : (
      `$${deiPrice.toFixed(5)}`
    )
  }, [deiPrice, isSupported, theme, loading, error])

  const collateralRatioLabel = useMemo(() => {
    return loading || !isSupported ? (
      <DotFlashing colour={theme.primary1} size={'10px'} gap={'3px'} />
    ) : error ? (
      'Error'
    ) : (
      `${(collateralRatio * 100).toFixed(2)}%`
    )
  }, [collateralRatio, isSupported, theme, loading, error])

  const poolLabel = useMemo(() => {
    return loading || !isSupported ? (
      <DotFlashing colour={theme.primary1} size={'10px'} gap={'3px'} />
    ) : error ? (
      'Error'
    ) : (
      `${formatAmount(poolBalance)} / ${formatAmount(poolCeiling)}`
    )
  }, [poolBalance, poolCeiling, isSupported, theme, loading, error])

  const mintLabel = useMemo(() => {
    return loading || !isSupported ? (
      <DotFlashing colour={theme.primary1} size={'10px'} gap={'3px'} />
    ) : error ? (
      'Error'
    ) : (
      `${formatAmount(poolCeiling - poolBalance)}`
    )
  }, [poolBalance, poolCeiling, isSupported, theme, loading, error])

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
