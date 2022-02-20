import React from 'react'
import styled from 'styled-components'

import { DeiSupportedChains } from 'state/dei/reducer'
import TransactionSettings from 'components/TransactionSettings'
import NetworkSelect from '../NetworkSelect'
import { DefaultWrapper as Wrapper } from 'components/App/Stablecoin'

const ToggleRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  overflow: visible;
`

const TextBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  text-align: center;
  justify-content: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text2};
`

export default function ComingSoon() {
  return (
    <Wrapper>
      <ToggleRow>
        <NetworkSelect chains={DeiSupportedChains} />
        <TransactionSettings style={{ marginLeft: '20px' }} />
      </ToggleRow>
      <TextBlock>Coming Soon. In the meantime, enjoy the minting!</TextBlock>
    </Wrapper>
  )
}
