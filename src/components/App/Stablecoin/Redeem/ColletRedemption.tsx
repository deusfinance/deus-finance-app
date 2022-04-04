import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import Image from 'next/image'

import CLAIM_LOGO from 'assets/img/claim.svg'
import { IToken } from 'utils/token'
import { RedeemBalances } from 'state/redeem/reducer'
import { Card } from 'components/Card'
import { PrimaryButton } from 'components/Button'
import { TokenBox } from './TokenBox'

const ActionWrap = styled(Card)`
  padding: 0;
  max-height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow2};
  background-color: ${({ theme }) => theme.bg0};
  max-width: 250px;
  width: 233px;
  min-height: 250px;
  min-width: 200px;
`
const Title = styled.div`
  color: ${({ theme }) => theme.text2};
  margin-top: 15px;
  text-align: center;
`

export const ClaimBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  margin-top: 20px;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 5px;
  & > div {
    padding: 15px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.bg3};
  }
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
  color: ${({ theme }) => theme.text4};
`

const Button = styled(PrimaryButton)`
  height: 30px;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  font-size: 15px;
`

export default function ColletRedemption({
  showClaim,
  redeemBalances,
  collateralToken,
  deusToken,
  onClaim,
}: {
  showClaim: boolean
  redeemBalances: RedeemBalances
  collateralToken: IToken | null
  deusToken: IToken | null
  onClaim: () => Promise<void>
}) {
  return (
    <ActionWrap>
      <Title>Redeemed Token</Title>

      {!showClaim || !deusToken || !collateralToken ? (
        <ClaimBox style={{ justifyContent: 'center' }}>
          <Image src={CLAIM_LOGO} alt="claim" />
          <EmptyToken> - nothing to claim -</EmptyToken>
        </ClaimBox>
      ) : (
        <>
          <ClaimBox>
            <TokenBox symbol={collateralToken.symbol} logo={collateralToken.logo} amount={redeemBalances.collateral} />
            <TokenBox symbol={deusToken.symbol} logo={deusToken.logo} amount={redeemBalances.deus} />
          </ClaimBox>
          <Button onClick={onClaim}>Claim All</Button>
        </>
      )}
    </ActionWrap>
  )
}
