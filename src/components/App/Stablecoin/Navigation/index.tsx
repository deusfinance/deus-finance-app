import React from 'react'
import styled from 'styled-components'
import { Row } from 'components/Row'

const Wrapper = styled(Row)`
  height: 34px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg0};
  border-radius: 12px;
  width: fit-content;
  margin: auto;
  margin-top: 21px;
  margin-bottom: 7px;
  padding: 0 5px;
`

const Item = styled.div<{
  selected: boolean
}>`
  font-size: 15px;
  transition: all 0.3s ease;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)};
  background-color: ${({ selected, theme }) => (selected ? theme.secondary2 : 'transparent')};
  overflow: hidden;
  outline: none;
  white-space: nowrap;
  border-radius: 8px;
  padding: 4px 8px;
  &:hover,
  :focus {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
`

export enum NavigationTypes {
  MINT = 'MINT',
  REDEEM = 'REDEEM',
  // ZAP = 'ZAP',
  // FARMS = 'FARMS',
}

const NavigationLabels = {
  [NavigationTypes.MINT]: 'Mint',
  [NavigationTypes.REDEEM]: 'Redeem',
  // [NavigationTypes.ZAP]: 'Zap',
  // [NavigationTypes.FARMS]: 'Farms',
}

export default function Navigation({
  selected,
  setSelected,
}: {
  selected: string
  setSelected: (value: NavigationTypes) => void
}) {
  return (
    <Wrapper>
      {(Object.keys(NavigationTypes) as Array<keyof typeof NavigationTypes>).map((key, index) => {
        const label = NavigationLabels[key]
        return (
          <Item selected={key == selected} onClick={() => setSelected(NavigationTypes[key])} key={index}>
            {label}
          </Item>
        )
      })}
    </Wrapper>
  )
}
