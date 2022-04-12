import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { RowBetween } from 'components/Row'
import { ExternalLink } from 'components/Link'
import { formatAmount, formatDollarAmount } from 'utils/numbers'
import { useDeiMetrics, useDeusMetrics } from 'state/dashboard/hooks'

import CUBE_ICON_URL from 'assets/img/dashboard/cube.svg'
import SPIRIT_ICON_URL from 'assets/img/dashboard/spirit.svg'

const Wrap = styled.div`
  margin-top: 20px;
  background: ${({ theme }) => theme.bg0};
  width: 100%;
  border-radius: 20px;
`

const MetricsButton = styled(RowBetween)`
  border-radius: 25px;
  background: black;
  height: 100%;
  width: unset;
  padding: 15px 15px 15px 8px;
  & > * {
    &:last-child {
      margin-left: 10px;
    }
  }
`

const MetricsButtonWrap = styled.div`
  background: linear-gradient(93.61deg, #7d7beb 0.97%, #039ef1 103.64%);
  padding: 2px;
  border-radius: 43px;
  margin: 30px 50px 22px;
  height: 43px;
`

export const MetricWrap = styled(RowBetween)`
  text-align: left;
`

const Label = styled.p`
  font-size: 18px;
  text-aligh: left;
  font-weight: bold;
  margin: 10px 0px 0px 30px;
  color: ${({ theme }) => theme.text1};
`
const CenterLabel = styled(Label)`
  text-align: center;
  font-size: 22px;
  padding: 10px;
  margin: unset;
`

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: space-between;
`

const Text = styled.p`
  color: rgba(3, 158, 241, 1);
`

export const Value = styled.p`
  font-size: 18px;
  text-align: right;
  font-weight: bold;
  margin: 10px 30px 0px 0px;
  color: ${({ theme }) => theme.text1};
`

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <MetricWrap>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </MetricWrap>
  )
}

function GetMetricsButton(child: JSX.Element, link: string): JSX.Element | null {
  return (
    <MetricsButtonWrap>
      <ExternalLink href={link} style={{ textDecoration: 'none' }}>
        <MetricsButton>{child}</MetricsButton>
      </ExternalLink>
    </MetricsButtonWrap>
  )
}

function MakeMetrics({ label, metrics }: { label: string; metrics: Array<{ label: string; value: string }> }) {
  return (
    <Wrap>
      <CenterLabel>{label} Metrics</CenterLabel>
      {metrics.map((metric, index) => {
        return <Metric key={index} label={metric.label} value={metric.value} />
      })}

      <ButtonsWrap>
        {GetMetricsButton(
          <>
            <Image src={SPIRIT_ICON_URL} alt={`${label} logo`} />
            <Text>BUY {label}</Text>
          </>,
          'https://www.solidly.vision/swap'
        )}
        {GetMetricsButton(
          <>
            <Image src={CUBE_ICON_URL} alt={`${label} logo`} />
            <Text>VIEW FTMScan</Text>
          </>,
          'https://ftmscan.com/'
        )}
      </ButtonsWrap>
    </Wrap>
  )
}

export default function Metrics() {
  const { deusMarketCap, deusTotalSupply, deusFullyDilutedValuation, deusEmissions, deusBurnedEvents } =
    useDeusMetrics()
  const { deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity } = useDeiMetrics()

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
