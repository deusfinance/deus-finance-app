import React, { useCallback, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { formatAmount } from 'utils/numbers'

import { useCollateralRatio, useDeiPrice, useDeiStatus, usePoolBalance, usePoolCeiling } from 'state/dei/hooks'
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

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    max-width: 600px;
  `};
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
  const theme = useTheme()

  const [isSupported, loading, error]: boolean[] = useMemo(() => {
    return [
      chainId ? Object.values(DeiSupportedChains).includes(chainId) : false,
      deiStatus == DeiStatus.LOADING,
      deiStatus == DeiStatus.ERROR,
    ]
  }, [deiStatus, chainId])

  const renderLabel = useCallback(
    (labelData: string) => {
      return loading || !isSupported ? (
        <DotFlashing colour={theme.primary1} size={'10px'} gap={'3px'} />
      ) : error ? (
        'Error'
      ) : (
        labelData
      )
    },
    [isSupported, theme, loading, error]
  )

  const deiPriceLabel = useMemo(() => {
    return renderLabel(`$${deiPrice.toFixed(5)}`)
  }, [isSupported, theme, loading, error, deiPrice])

  const collateralRatioLabel = useMemo(() => {
    return renderLabel(`${(collateralRatio * 100).toFixed(2)}%`)
  }, [isSupported, theme, loading, error, collateralRatio])

  const poolLabel = useMemo(() => {
    return renderLabel(`${formatAmount(poolBalance)} / ${formatAmount(poolCeiling)}`)
  }, [isSupported, theme, loading, error, poolBalance, poolCeiling])

  const mintLabel = useMemo(() => {
    return renderLabel(`${formatAmount(poolCeiling - poolBalance)}`)
  }, [isSupported, theme, loading, error, poolBalance, poolCeiling])

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
