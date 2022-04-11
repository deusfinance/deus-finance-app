import React from 'react'
import styled from 'styled-components'

import Dashbar from './Dashbar'
import Metrics from './Metrics/Metrics'
import { useDeusPrice } from 'state/dashboard/hooks'
import Portfolio, { PortfolioProps } from './Portfolio'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

export const Wrap = styled.div`
  width: 100%;
  max-width: 1150px;
  margin: auto;
  margin-top: 75px;
`

const InfoWrapper = styled.div`
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
`

const InfoItem = styled.div`
  flex-grow: 2;
  flex-wrap: wrap;
`

const Twitter = styled.div`
  border: 1px solid #14181e;
  border-radius: 10px;
  flex-grow: 1;
  margin-left: 18px;
`

export default function Dashboard() {
  const { deusDexLiquidity, stakedDeusLiquidity } = useDeusPrice()

  const options = [
    {
      label: 'DEUS Price',
      value: '$',
    } as PortfolioProps,
    {
      label: 'Portfolio Value',
      value: '$',
    } as PortfolioProps,
    {
      label: 'DEUS in Wallet',
      value: '0',
    } as PortfolioProps,
    {
      label: 'DEI in Wallet',
      value: '0',
    } as PortfolioProps,
  ]

  const liquidityOptions = [
    // TODO: get TVL from defi llama
    // {
    //   label: 'Total Value Locked',
    //   value: '$',
    // } as PortfolioProps,
    {
      label: 'Liquidity on DEXs',
      value: `$ ${deusDexLiquidity}`,
    } as PortfolioProps,
    {
      label: 'Staked Assets',
      value: `$ ${stakedDeusLiquidity}`,
    } as PortfolioProps,
  ]

  return (
    <Wrap>
      <Portfolio options={options} />
      <Dashbar />
      <InfoWrapper>
        <InfoItem>
          <Portfolio options={liquidityOptions} />
          <Metrics />
        </InfoItem>
        <Twitter>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="DeusDao"
            options={{ height: 652 }}
            transparent
            slug="breakingnews"
          />
        </Twitter>
      </InfoWrapper>
    </Wrap>
  )
}
