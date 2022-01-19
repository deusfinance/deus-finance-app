import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 20px;
  margin-left: 10px;
`

const Item = styled.div<{
  selected: boolean
}>`
  font-size: 15px;
  transition: all 0.3s ease;
  border-bottom: 1px solid ${({ selected, theme }) => (selected ? theme.text1 : 'transparent')};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)};

  &:hover {
    cursor: pointer;
  }
`

export enum NavigationTypes {
  MINT = 'MINT',
  REDEEM = 'REDEEM',
  ZAP = 'ZAP',
  FARMS = 'FARMS',
}

const NavigationLabels = {
  [NavigationTypes.MINT]: 'Mint',
  [NavigationTypes.REDEEM]: 'Redeem',
  [NavigationTypes.ZAP]: 'Zap',
  [NavigationTypes.FARMS]: 'Farms',
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
