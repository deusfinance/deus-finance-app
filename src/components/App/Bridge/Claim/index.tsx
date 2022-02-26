import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import Image from 'next/image'

import CLAIM_LOGO from 'assets/img/claim.svg'
import { Card } from 'components/Card'
import { Row, RowBetween } from 'components/Row'
import { TokenBox } from './TokenBox'
import { IClaimToken } from 'state/redeem/reducer'

const ActionWrap = styled(Card)`
  padding: 0;
  max-height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow2};
  background-color: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.border2};
  max-width: 320px;
  width: 320px;
  min-height: 370px;
  min-width: 200px;
`
const Title = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
`

export const ClaimBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  & > div {
    padding: 15px 10px;
    border-bottom: 1px solid ${({ theme }) => lighten(0.3, theme.blue2)};
  }
`

export const BottomRow = styled(Row)`
  flex-wrap: wrap;
  padding: 10px 10px;
  /* align-items: flex-end; */
  position: relative;
  background: ${({ theme }) => theme.bg2};
  margin-bottom: auto;
`

const BottomWrap = styled.div`
  text-align: center;
  /* vertical-align: bottom; */
`

export const InfoHeader = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.text1};
`

export const InfoSubHeader = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.text3};
`

const EmptyToken = styled.p`
  margin-top: 0.75rem;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text2};
`

const getInfoComponent = (): JSX.Element => {
  return (
    <BottomWrap>
      <InfoHeader>Change to the destination Network</InfoHeader>
      <InfoSubHeader>to claim your token on respective networks.</InfoSubHeader>
    </BottomWrap>
  )
}

export default function BridgeClaim({ unClaimed = [] }: { unClaimed?: Array<IClaimToken> }) {
  return (
    <ActionWrap>
      <RowBetween mb="12px" margin="10px" marginBottom={0} width={'unset'}>
        <Title>Claim tokens</Title>
      </RowBetween>

      {!unClaimed || unClaimed.length == 0 ? (
        <ClaimBox style={{ justifyContent: 'center' }}>
          <Image src={CLAIM_LOGO} alt="claim" />
          <EmptyToken>No Token to claim</EmptyToken>
        </ClaimBox>
      ) : (
        <ClaimBox>
          {unClaimed.map((token: IClaimToken, index: number) => {
            const { symbol, toChainId, amount, claimableBlock, logo } = token
            return (
              <TokenBox
                key={index}
                symbol={symbol}
                toChainId={toChainId}
                claimableBlock={claimableBlock}
                currentBlock={80}
                logo={logo}
                amount={amount}
              />
            )
          })}
        </ClaimBox>
      )}

      {/* <TokenBox
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
          /> */}

      {unClaimed.length > 0 && <BottomRow>{getInfoComponent()}</BottomRow>}
    </ActionWrap>
  )
}
