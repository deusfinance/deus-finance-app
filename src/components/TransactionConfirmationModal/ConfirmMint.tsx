import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import BN from 'bignumber.js'
import Image from 'next/image'

import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { useMintingFee } from 'state/dei/hooks'

import { PrimaryButton } from 'components/Button'
import { IconWrapper, ChevronDown } from 'components/Icons'
import TransactionConfirmationModal, { ConfirmationContent, TransactionErrorContent } from './index'

import { IToken } from 'utils/token'
import { dynamicPrecision } from 'utils/numbers'

const MainWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 1.5rem 1.25rem;
`

const BottomWrapper = styled(MainWrapper)`
  gap: 0.5rem;
`

const InputsOutputs = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 0.25rem;
`

const TokenRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1.25rem;
  font-size: 1.1rem;
  background: ${({ theme }) => theme.bg1};
  padding: 0.5rem;
  border-radius: 10px;

  & > * {
    &:nth-child(2) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      font-weight: bold;
    }
  }
`

const InfoRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 5px;
  font-size: 0.8rem;

  & > * {
    &:last-child {
      color: ${({ theme }) => theme.text3};
    }
  }
`

const Disclaimer = styled.div`
  display: block;
  align-text: center;
  text-align: center;
  font-size: 0.7rem;
  border-radius: 5px;
  padding: 0.7rem;
`

export default function ConfirmMint({
  isOpen,
  onDismiss,
  onConfirm,
  attemptingTxn,
  txHash,
  mintErrorMessage,

  Token1,
  Token2,
  DEIToken,
  amount1,
  amount2,
  amountOut,
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  attemptingTxn: boolean
  txHash: string
  mintErrorMessage?: string

  Token1: IToken | null
  Token2: IToken | null
  DEIToken: IToken | null
  amount1: string
  amount2: string
  amountOut: string
}) {
  const theme = useTheme()
  const slippagePercentage = useUserSlippageToleranceWithDefault(0.5) // TODO upgrade to gas-dependent calculation
  const mintingFeePercentage = useMintingFee()

  const minimumAmountOut: string = useMemo(() => {
    const slippageFactor = new BN(1 - slippagePercentage / 100)
    return new BN(amountOut).times(slippageFactor).toFixed(3, 1) // ROUND_DOWN
  }, [slippagePercentage, amountOut])

  const feeAmount = useMemo(() => {
    return new BN(amountOut).times(mintingFeePercentage / 100).toFixed(3, 0) // ROUND_UP
  }, [amountOut, mintingFeePercentage])

  const summary = useMemo(() => {
    if (!amount1 || !amountOut || !Token1) return ''
    const base =
      Token2 && amount2
        ? `${dynamicPrecision(amount1, 0.99)} ${Token1.symbol} + ${dynamicPrecision(amount2, 0.99)} ${Token2.symbol}`
        : `${dynamicPrecision(amount1)} ${Token1.symbol}`
    return `Mint ${dynamicPrecision(amountOut)} DEI for ${base}`
  }, [Token1, Token2, amount1, amount2, amountOut])

  function getInputsOutputs(): JSX.Element {
    return (
      <InputsOutputs>
        {Token1 && (
          <TokenRow>
            <Image src={Token1.logo} alt={`${Token1.name} Logo`} width={40} height={40} />
            <div>{dynamicPrecision(amount1)}</div>
            <div>{Token1.symbol}</div>
          </TokenRow>
        )}
        {Token2 && (
          <TokenRow>
            <Image src={Token2.logo} alt={`${Token2.name} Logo`} width={40} height={40} />
            <div>{dynamicPrecision(amount2)}</div>
            <div>{Token2.symbol}</div>
          </TokenRow>
        )}
        <IconWrapper style={{ alignSelf: 'center' }} stroke={theme.text1}>
          <ChevronDown />
        </IconWrapper>
        {DEIToken && (
          <TokenRow>
            <Image src={DEIToken.logo} alt={`${DEIToken.name} Logo`} width={40} height={40} />
            <div>{dynamicPrecision(amountOut)}</div>
            <div>{DEIToken.symbol}</div>
          </TokenRow>
        )}
      </InputsOutputs>
    )
  }

  function getConfirmationContent() {
    return (
      <ConfirmationContent
        title="Confirm Mint"
        onDismiss={onDismiss}
        mainContent={
          <MainWrapper>
            {getInputsOutputs()}
            <InfoRow style={{ marginTop: '10px' }}>
              <div>Minimum DEI Received: </div>
              <div>{minimumAmountOut} DEI</div>
            </InfoRow>
            <InfoRow>
              {/* TODO calculate price impact (using Contract.callStatic) */}
              <div>Price Impact</div>
              <div>Unknown</div>
            </InfoRow>
            <InfoRow>
              <div>Protocol Fee: </div>
              <div>
                {mintingFeePercentage}% / {feeAmount} DEI
              </div>
            </InfoRow>
            <InfoRow>
              <div>Slippage Tolerance:</div>
              <div>{slippagePercentage}%</div>
            </InfoRow>
          </MainWrapper>
        }
        bottomContent={
          <BottomWrapper>
            <Disclaimer>Output is estimated, you will receive at least {minimumAmountOut} DEI.</Disclaimer>
            <PrimaryButton onClick={onConfirm}>Mint DEI</PrimaryButton>
          </BottomWrapper>
        }
      />
    )
  }

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      summary={summary}
      tokenToAdd={DEIToken}
      content={
        mintErrorMessage ? (
          <TransactionErrorContent onDismiss={onDismiss} message={mintErrorMessage} />
        ) : (
          getConfirmationContent()
        )
      }
    />
  )
}
