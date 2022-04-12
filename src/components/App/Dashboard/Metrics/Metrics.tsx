import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import Metric from './Metric'
import { Label } from '../Portfolio/Option'
import GetMetricsButton from './GetMetricsButton'
import { formatAmount, formatDollarAmount } from 'utils/numbers'
import { useDeiMarketCap, useDeusPrice } from 'state/dashboard/hooks'

import CUBE_ICON_URL from 'assets/img/dashboard/cube.svg'
import SPIRIT_ICON_URL from 'assets/img/dashboard/spirit.svg'
import { ExternalLink } from 'components/Link'

const Wrap = styled.div`
  margin-top: 20px;
  background: ${({ theme }) => theme.bg0};
  width: 100%;
  border-radius: 20px;
`

const CenterLabel = styled(Label)`
  text-align: center;
  padding: 10px;
`

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const Value = styled.p`
  color: rgba(3, 158, 241, 1);
`

function MakeMetrics({ label, metrics }: { label: string; metrics: Array<{ label: string; value: string }> }) {
  return (
    <Wrap>
      <CenterLabel>{label} Metrics</CenterLabel>
      {metrics.map((metric, index) => {
        return <Metric key={index} label={metric.label} value={metric.value} />
      })}

      <ButtonsDiv>
        {GetMetricsButton(
          <>
            <Image src={SPIRIT_ICON_URL} alt={`${label} logo`} />
            <Value>BUY {label}</Value>
          </>,
          'https://www.solidly.vision/swap'
        )}
        {GetMetricsButton(
          <>
            <Image src={CUBE_ICON_URL} alt={`${label} logo`} />
            <Value>VIEW FTMScan</Value>
          </>,
          'https://ftmscan.com/'
        )}
      </ButtonsDiv>
    </Wrap>
  )
}

export default function Metrics() {
  const { deusMarketCap, deusTotalSupply, deusFullyDilutedValuation, deusEmissions, deusBurnedEvents } = useDeusPrice()
  const { deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity } = useDeiMarketCap()

  const metrics = {
    DEUS: [
      {
        label: 'marketcap',
        value: `${formatDollarAmount(deusMarketCap)}`,
      },
      {
        label: 'total supply',
        value: `${formatAmount(deusTotalSupply)} DEUS`,
      },
      {
        label: 'fully diluted Marketcap',
        value: `${formatDollarAmount(deusFullyDilutedValuation)}`,
      },
      {
        label: 'emission per day',
        value: `${formatAmount(deusEmissions)}`,
      },
      {
        label: 'burnt last week',
        value: `${formatAmount(deusBurnedEvents)}`,
      },
    ],
    DEI: [
      {
        label: 'marketcap',
        value: `${formatDollarAmount(deiMarketCap)}`,
      },
      {
        label: 'total supply',
        value: `${formatAmount(deiTotalSupply)} DEI`,
      },
      {
        label: 'staked DEI liquidity',
        value: `${formatDollarAmount(stakedDeiLiquidity)}`,
      },
      {
        label: 'dex liquidity',
        value: `${formatDollarAmount(deiDexLiquidity)}`,
      },
      {
        label: 'minted DEI',
        value: `${formatDollarAmount(mintedDei)}`,
      },
    ],
  }
  return (
    <>
      {Object.entries(metrics).map((metric, index) => {
        return <MakeMetrics key={index} label={metric[0]} metrics={metric[1]} />
      })}
    </>
  )
}
