import React from 'react'
import Image from 'next/image'

import CLAIM_LOGO from 'assets/img/claim.svg'
import { IToken } from 'utils/token'
import { RedeemBalances } from 'state/redeem/reducer'
import { TokenBox } from './TokenBox'
import { ActionWrap, Button, ClaimBox, EmptyToken, Title } from 'components/ClaimBox'
import styled from 'styled-components'

const StableCoinClaimActionWrap = styled(ActionWrap)`
  background-color: ${({ theme }) => theme.bg0};
`

const StableCoinClaimTitle = styled(Title)`
  margin-top: 15px;
  text-align: center;
`

const StableCoinClaimBox = styled(ClaimBox)`
  & > div {
    border-bottom: 1px solid ${({ theme }) => theme.bg3};
  }
`

export default function CollectRedemption({
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
    <StableCoinClaimActionWrap>
      <StableCoinClaimTitle>Redeemed Token</StableCoinClaimTitle>

      {!showClaim || !deusToken || !collateralToken ? (
        <StableCoinClaimBox style={{ justifyContent: 'center' }}>
          <Image src={CLAIM_LOGO} alt="claim" />
          <EmptyToken> - nothing to claim -</EmptyToken>
        </StableCoinClaimBox>
      ) : (
        <>
          <StableCoinClaimBox>
            <TokenBox symbol={collateralToken.symbol} logo={collateralToken.logo} amount={redeemBalances.collateral} />
            <TokenBox symbol={deusToken.symbol} logo={deusToken.logo} amount={redeemBalances.deus} />
          </StableCoinClaimBox>
          <Button onClick={onClaim}>Claim All</Button>
        </>
      )}
    </StableCoinClaimActionWrap>
  )
}
