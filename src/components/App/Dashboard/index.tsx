import React from 'react'
import styled from 'styled-components'
import Portfolio, { PortfolioProps } from './Portfolio'
import Metrics from './Portfolio/Metrics'
import Button from './Portfolio/Button'
import TwitterLogin from 'react-twitter-login'
import BRIDGE_ICON_URL from 'assets/img/dashboard/bridge.svg'

export const Wrap = styled.div`
  width: 100%;
  margin-top: 75px;
`

const BottomDiv = styled.div`
  display: flex;
  justify-content: center;
`

const ButtonsBar = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
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

  const DEUSmetrics = [
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
  ]

  const DEImetrics = [
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
  ]

  const buttons = [
    { img: '', label: 'Stablecoin' },
    { img: BRIDGE_ICON_URL, label: 'Bridge' },
    { img: '', label: 'Frontend' },
    { img: '', label: 'Migrator' },
    { img: '', label: 'Swap' },
    { img: '', label: 'Farms' },
  ]

  const authHandler = (err: string, data: string) => {
    console.log(err, data)
  }

  return (
    <React.Fragment>
      <Wrap>
        <Portfolio options={options} />
      </Wrap>

      <ButtonsBar>
        {buttons.map((button, index) => {
          return <Button key={index} img={button.img} label={button.label} />
        })}
      </ButtonsBar>

      <BottomDiv>
        <div>
          <Portfolio options={liquidityOptions} />
          <Metrics label={'DEUS'} metrics={DEUSmetrics} />
          <Metrics label={'DEI'} metrics={DEImetrics} />
        </div>
        <div>
          <TwitterLogin></TwitterLogin>
        </div>
      </BottomDiv>
    </React.Fragment>
  )
}
