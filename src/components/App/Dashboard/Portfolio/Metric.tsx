import React from 'react'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: left;
  column-gap: 5px;
`
export const Label = styled.p`
  font-weight: bold;
  font-size: 22px;
  text-aligh: left;
  margin-left: 30px;
  color: ${({ theme }) => theme.text1};
`
export const Value = styled.p`
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
  margin-top: 9px;
  margin-right: 50px;
  text-align: right;
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
