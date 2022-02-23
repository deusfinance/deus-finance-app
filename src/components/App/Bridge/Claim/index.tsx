import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { Card } from 'components/Card'
import { Row, RowBetween } from 'components/Row'
import { Tokens } from 'constants/tokens'
import { TokenBox } from './TokenBox'

const ActionWrap = styled(Card)`
  padding: 0;
  height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow2};
  background-color: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.border2};
  max-width: 320px;
  width: 320px;
  min-width: 200px;
`
const Title = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
`

export const ClaimBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  /* height: 295px; */
  overflow: hidden;
  overflow-y: auto;
  & > * {
    padding: 15px 10px;
    border-bottom: 1px solid ${({ theme }) => lighten(0.3, theme.blue2)};
  }
`

export const BottomRow = styled(Row)`
  flex-wrap: wrap;
  padding: 10px 10px;
  position: relative;
  background: ${({ theme }) => theme.bg2};
  margin-bottom: auto;
`

const BottomWrap = styled.div`
  text-align: center;
`

export const InfoHeader = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text1};
`

export const InfoSubHeader = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text3};
`

const getInfoComponent = (): JSX.Element => {
  return (
    <BottomWrap>
      <InfoHeader>Change to the destination Network</InfoHeader>
      <InfoSubHeader>to claim your token on respective networks.</InfoSubHeader>
    </BottomWrap>
  )
}

export default function BridgeClaim() {
  return (
    <ActionWrap>
      <RowBetween mb="12px" margin="10px" marginBottom={0}>
        <Title>Claim tokens</Title>
      </RowBetween>

      <ClaimBox>
        <TokenBox
          symbol="DEUS"
          logo={Tokens.DEUS[137].logo}
          toChainId={137}
          claimableBlock={100}
          currentBlock={80}
          amount={15.268}
        />
        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
        <TokenBox
          symbol="DEUS"
          logo={Tokens.DEUS[137].logo}
          toChainId={137}
          claimableBlock={100}
          currentBlock={800}
          amount={15.268}
        />

        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
        <TokenBox
          symbol="DEI"
          logo={Tokens.DEUS[56].logo}
          toChainId={56}
          claimableBlock={100}
          currentBlock={110}
          amount={105.8}
        />
      </ClaimBox>

      <BottomRow>{getInfoComponent()}</BottomRow>
    </ActionWrap>
  )
}
