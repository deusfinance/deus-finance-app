import React from 'react'
import styled from 'styled-components'
import Portfolio, { PortfolioProps } from './Portfolio'
import Metrics from './Portfolio/Metrics'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

import { useDeiMarketCap, useDeusPrice } from 'state/dashboard/hooks'
import Dashbar from './Dashbar'

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
  const {
    deusPrice,
    deusMarketCap,
    deusTotalSupply,
    deusFullyDilutedValuation,
    deusEmissions,
    deusBurnedEvents,
    deusDexLiquidity,
    stakedDeusLiquidity,
  } = useDeusPrice()
  const { deiMarketCap, deiTotalSupply, deiDexLiquidity, mintedDei, stakedDeiLiquidity } = useDeiMarketCap()
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

  const metrics = {
    DEUS: [
      {
        label: 'marketcap',
        value: `$ ${deusMarketCap}`,
      },
      {
        label: 'total supply',
        value: `${deusTotalSupply} DEUS`,
      },
      {
        label: 'fully diluted Marketcap',
        value: `$ ${deusFullyDilutedValuation}`,
      },
      {
        label: 'emission per day',
        value: `$ ${deusEmissions}`,
      },
      {
        label: 'burnt last week',
        value: `$ ${deusBurnedEvents}`,
      },
    ],
    DEI: [
      {
        label: 'marketcap',
        value: `$ ${deiMarketCap}`,
      },
      {
        label: 'total supply',
        value: `${deiTotalSupply} DEI`,
      },
      {
        label: 'staked DEI liquidity',
        value: `${stakedDeiLiquidity}`,
      },
      {
        label: 'dex liquidity',
        value: `$ ${deiDexLiquidity}`,
      },
      {
        label: 'minted DEI',
        value: `${mintedDei}`,
      },
    ],
  }

  return (
    <Wrap>
      <Portfolio options={options} />

      <Dashbar />

      <InfoWrapper>
        <InfoItem>
          <Portfolio options={liquidityOptions} />

          {Object.entries(metrics).map((metric, index) => {
            return <Metrics key={index} label={metric[0]} metrics={metric[1]} />
          })}
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
