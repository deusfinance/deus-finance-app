import React from 'react'
import styled from 'styled-components'
import Portfolio, { PortfolioProps } from './Portfolio'

export const Wrap = styled.div`
  width: 100%;
  margin-top: 75px;
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

  return (
    <Wrap>
      <Portfolio options={options} />
    </Wrap>
  )
}
