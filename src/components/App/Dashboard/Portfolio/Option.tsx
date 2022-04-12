import React from 'react'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  column-gap: 5px;
  margin: 5px;
`
export const Label = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.text1};
  background: ${({ theme }) => theme.specialBG3};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
  `};
`
export const Value = styled.p`
  font-size: 16px;
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
