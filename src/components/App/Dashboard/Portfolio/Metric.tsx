import { RowBetween } from 'components/Row'
import React from 'react'
import styled from 'styled-components'

export const Wrap = styled(RowBetween)`
  text-align: left;
`
export const Label = styled.p`
  font-size: 18px;
  text-aligh: left;
  font-weight: bold;
  margin: 10px 0px 0px 30px;
  color: ${({ theme }) => theme.text1};
`
export const Value = styled.p`
  font-size: 18px;
  text-align: right;
  font-weight: bold;
  margin: 10px 30px 0px 0px;
  color: ${({ theme }) => theme.text1};
`

export default function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Wrap>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrap>
  )
}
