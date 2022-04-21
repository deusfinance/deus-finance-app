import React from 'react'
import styled from 'styled-components'

import { useDeusMetrics, useDeusPrice } from 'state/dashboard/hooks'
import { formatDollarAmount } from 'utils/numbers'
import useWeb3React from 'hooks/useWeb3'

import Portfolio, { PortfolioProps } from './Portfolio'
import Twitter from './Twitter'
import Dashbar from './Dashbar'
import Metrics from './Metrics'

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

export default function Dashboard() {
  const { deusDexLiquidity, stakedDeusLiquidity } = useDeusMetrics()
  const dPrice = useDeusPrice()
  const { account } = useWeb3React()

  const options = [
    {
      label: 'DEUS Price',
      value: `${formatDollarAmount(dPrice)}`,
    } as PortfolioProps,
    // TODO: add wallet connect for complete
    {
      label: 'Portfolio Value',
      value: account ? '-' : 'Locked',
    } as PortfolioProps,
    {
      label: 'DEUS in Wallet',
      value: account ? '-' : 'Locked',
    } as PortfolioProps,
    {
      label: 'DEI in Wallet',
      value: account ? '-' : 'Locked',
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
      value: `${formatDollarAmount(deusDexLiquidity)}`,
    } as PortfolioProps,
    {
      label: 'Staked Assets',
      value: `${formatDollarAmount(stakedDeusLiquidity)}`,
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
        <Twitter />
      </InfoWrapper>
    </Wrap>
  )
}
