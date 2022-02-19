import React from 'react'
import styled, { useTheme } from 'styled-components'
import Image from 'next/image'
import { PrimaryButton } from 'components/Button'
import { IconWrapper, ChevronDown } from 'components/Icons'
import TransactionConfirmationModal, { ConfirmationContent, TransactionErrorContent } from './index'

import { IToken } from 'utils/token'
import { dynamicPrecision } from 'utils/numbers'

export type ConfirmationInfo = {
  title: string
  amount: string
}

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
  text-align: center;
  font-size: 0.7rem;
  border-radius: 5px;
  padding: 0.7rem;
`

export default function DefaultConfirmation({
  title,
  isOpen,
  onDismiss,
  onConfirm,
  onConfirmTitle,
  TokensIn,
  TokensOut,
  amountsIn,
  amountsOut,
  attemptingTxn,
  txHash,
  summary,
  errorMessage,
  disclaimer,
  info,
  tokenToAdd,
}: {
  title: string
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  onConfirmTitle: string
  TokensIn: IToken[] | null
  TokensOut?: IToken[] | null
  amountsIn: string[]
  amountsOut?: string[]
  attemptingTxn: boolean
  txHash: string
  summary: string
  errorMessage?: string
  disclaimer?: string
  info?: ConfirmationInfo[]
  tokenToAdd?: IToken | null | undefined
}) {
  const theme = useTheme()

  function getInputsOutputs(): JSX.Element {
    return (
      <InputsOutputs>
        {TokensIn &&
          TokensIn.map((token, index) => (
            <TokenRow key={index}>
              <Image src={token.logo} alt={`${token.name} Logo`} width={40} height={40} />
              <div>{dynamicPrecision(amountsIn[index])}</div>
              <div>{token.symbol}</div>
            </TokenRow>
          ))}
        {TokensOut && (
          <IconWrapper style={{ alignSelf: 'center' }} stroke={theme.text1}>
            <ChevronDown />
          </IconWrapper>
        )}
        {TokensOut &&
          TokensOut.map((token, index) => (
            <TokenRow key={index}>
              <Image src={token.logo} alt={`${token.name} Logo`} width={40} height={40} />
              {amountsOut && <div>{dynamicPrecision(amountsOut[index])}</div>}
              <div>{token.symbol}</div>
            </TokenRow>
          ))}
      </InputsOutputs>
    )
  }

  function getConfirmationContent() {
    return (
      <ConfirmationContent
        title={title}
        onDismiss={onDismiss}
        mainContent={
          <MainWrapper>
            {getInputsOutputs()}
            {info &&
              info.map((item, index) => (
                <InfoRow key={`item-${index}`} style={{ marginTop: '10px' }}>
                  <div>{item.title} </div>
                  <div>{item.amount}</div>
                </InfoRow>
              ))}
          </MainWrapper>
        }
        bottomContent={
          <BottomWrapper>
            {disclaimer && <Disclaimer>{disclaimer}</Disclaimer>}
            <PrimaryButton onClick={onConfirm}>{onConfirmTitle}</PrimaryButton>
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
      tokenToAdd={tokenToAdd}
      content={
        errorMessage ? (
          <TransactionErrorContent onDismiss={onDismiss} message={errorMessage} />
        ) : (
          getConfirmationContent()
        )
      }
    />
  )
}
