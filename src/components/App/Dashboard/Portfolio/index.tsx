import React from 'react'
import styled from 'styled-components'

import Option from './Option'

import { RowBetween } from 'components/Row'

export const Row = styled(RowBetween)`
  width: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.bg0};
  padding: 20px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`

export type PortfolioProps = {
  label: string
  value: string
}

export default function Portfolio({ options = [] }: { options?: Array<PortfolioProps> }) {
  return (
    <Row>
      {options.map((option, index) => {
        return <Option key={index} label={option.label} value={option.value} />
      })}
    </Row>
  )
}
