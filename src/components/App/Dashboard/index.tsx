import React from 'react'
import styled from 'styled-components'
import Portfolio, { PortfolioProps } from './Portfolio'
import Metrics from './Portfolio/Metrics'
import Button from './Portfolio/Button'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import BRIDGE_ICON_URL from 'assets/img/dashboard/bridge.svg'
import FARMS_ICON_URL from 'assets/img/dashboard/farms.svg'
import FRONTENDS_ICON_URL from 'assets/img/dashboard/frontends.svg'
import MIGRATOR_ICON_URL from 'assets/img/dashboard/migrator.svg'
import STABLECOIN_ICON_URL from 'assets/img/dashboard/stablecoin.svg'
import SWAP_ICON_URL from 'assets/img/dashboard/swap.svg'

export const Wrap = styled.div`
  width: 100%;
  max-width: 1150px;
  margin: auto;
  margin-top: 75px;
`

const BottomDiv = styled.div`
  width: 100%;
  // max-width: 1075px;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
`

const ButtonsBar = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1075px;
`

const MetricsDiv = styled.div`
  flex-grow: 3;
  flex-wrap: wrap;
  & > * {
    &:last-child {
      margin-left: 18px;
      flex-grow: 1;
      flex-wrap: wrap;
    }
  }
`

export default function Dashboard() {
  const options = [
    {
      label: 'DEUS Price',
      value: '$30',
    } as PortfolioProps,
    {
      label: 'Portfolio Value',
      value: '$12,000',
    } as PortfolioProps,
    {
      label: 'DEUS in Wallet',
      value: '12.56',
    } as PortfolioProps,
    {
      label: 'DEI in Wallet',
      value: '89.56',
    } as PortfolioProps,
  ]

  const liquidityOptions = [
    {
      label: 'Total Value Locked',
      value: '$440,89,456',
    } as PortfolioProps,
    {
      label: 'Liquidity on DEXs',
      value: '$440,89,456',
    } as PortfolioProps,
    {
      label: 'Staked Assets',
      value: '$440,89,456',
    } as PortfolioProps,
  ]

  const metrics = {
    DEUS: [
      {
        label: 'marketcap',
        value: '$440,89,456',
      },
      {
        label: 'total supply',
        value: '300,000 DEUS',
      },
      {
        label: 'fully diluted Marketcap',
        value: '$15,043,300',
      },
      {
        label: 'emission per day',
        value: '$300,000',
      },
      {
        label: 'burnt last week',
        value: '$300,000',
      },
    ],
    DEI: [
      {
        label: 'marketcap',
        value: '$440,89,456',
      },
      {
        label: 'total supply',
        value: '300,000 DEUS',
      },
      {
        label: 'fully diluted Marketcap',
        value: '$15,043,300',
      },
      {
        label: 'emission per day',
        value: '$300,000',
      },
      {
        label: 'burnt last week',
        value: '$300,000',
      },
    ],
  }

  const buttons = [
    { img: STABLECOIN_ICON_URL, label: 'Stablecoin' },
    { img: BRIDGE_ICON_URL, label: 'Bridge' },
    { img: FRONTENDS_ICON_URL, label: 'Frontends' },
    { img: MIGRATOR_ICON_URL, label: 'Migrator' },
    { img: SWAP_ICON_URL, label: 'Swap' },
    { img: FARMS_ICON_URL, label: 'Farms' },
  ]

  return (
    <>
      <Wrap>
        <Portfolio options={options} />

        <ButtonsBar>
          {buttons.map((button, index) => {
            return <Button key={index} icon={button.img} label={button.label} />
          })}
        </ButtonsBar>

        <BottomDiv>
          <MetricsDiv>
            <Portfolio options={liquidityOptions} />
            {Object.entries(metrics).map((metric) => {
              return <Metrics label={metric[0]} metrics={metric[1]} />
            })}
          </MetricsDiv>
          <MetricsDiv>
            <TwitterTimelineEmbed sourceType="profile" screenName="DeusDao" options={{ height: 652 }} theme="dark" />
          </MetricsDiv>
        </BottomDiv>
      </Wrap>
    </>
  )
}
