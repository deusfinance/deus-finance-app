import React from 'react'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  column-gap: 5px;
`
export const Label = styled.p`
  font-weight: bold;
  font-size: 22px;
  color: ${({ theme }) => theme.text1};
`
export const Value = styled.p`
  font-size: 18px;
  line-height: 18px;
  margin-top: 9px;
  color: ${({ theme }) => theme.text2};
`

export default function Option({ label, value }: { label: string; value: string }) {
  return (
    <Wrap>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrap>
  )
}
