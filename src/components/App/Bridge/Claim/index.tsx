import React, { Children } from 'react'
import styled from 'styled-components'
import { Card } from 'components/Card'
import { Row, RowBetween, AutoRow } from 'components/Row'
import { Tokens } from 'constants/tokens'
import { SupportedChainId } from 'constants/chains'
import { TokenBox } from './TokenBox'

export const InfoHeader = styled.div`
  padding-left: 20px;
  background: ${({ theme }) => theme.bg0};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const InfoSubHeader = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.text3};
`

const getInfoComponent = (): JSX.Element => {
  return (
    <>
      <InfoHeader>Change to the destination Network</InfoHeader>
      <InfoSubHeader>to claim your token on respective networks.</InfoSubHeader>
    </>
  )
}

export const ClaimBox = styled(AutoRow)`
  height: 295px;
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: -21px;
`

export const BottomRow = styled(Row)`
  flex-wrap: wrap;
  padding: 12px 0;
  position: relative;
  margin: 20px -20px -20px -20px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background: ${({ theme }) => theme.bg3};
  border-top: 1px solid ${({ theme }) => theme.bg2};
`

export const ActionWrap = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
  max-width: 320px;
  padding: 14px 18px 18px 18px;
`

export default function BridgeClaim() {
  const claimCurrency = [
    {
      currency: Tokens.DEI[SupportedChainId.MAINNET],
      network: [SupportedChainId.MAINNET],
    },
    {
      currency: Tokens.DEUS[SupportedChainId.FANTOM],
      network: [SupportedChainId.FANTOM],
    },
    {
      currency: Tokens.DEI[SupportedChainId.BSC],
      network: [SupportedChainId.BSC],
    },
  ]

  return (
    <ActionWrap>
      <RowBetween mb="12px" paddingX="10px">
        <p>Claim tokens</p>
      </RowBetween>

      <ClaimBox>
        {Children.toArray(
          claimCurrency.map(({ currency, network }) => (
            <TokenBox
              key={network[0]}
              //   setActive={() => console.log('hi')}
              //   currency={currency[network]}
              //   currencyNetwork={network}
              //   amountIn={'242.24'}
              //   account={account}
              //   waitingBlocks={30}
              //   passedBlocks={2}
            />
          ))
        )}
      </ClaimBox>

      <BottomRow mb="12px">{getInfoComponent()}</BottomRow>
    </ActionWrap>
  )
}
