import React, { useState, useMemo } from 'react'
import { useAppDispatch } from 'state'
import styled from 'styled-components'

import { Card } from 'components/Card'

import useWeb3React from 'hooks/useWeb3'

import { useWalletModalToggle } from 'state/application/hooks'
import { DeiSupportedChains } from 'state/dei/reducer'

import { IToken } from 'utils/token'

import { BRIDGE__INPUTS, BRIDGE__TOKENS } from 'constants/inputs'

import { ArrowBubble, IconWrapper } from 'components/Icons'
import { PrimaryButton } from 'components/Button'
import TransactionSettings from 'components/TransactionSettings'
import InputBox from 'components/App/Bridge/InputBox'
import TokenSelect from 'components/App/Bridge/TokenSelect'
import { Tokens } from 'constants/tokens'

const ToggleRow = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  overflow: visible;
`

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  overflow: visible;
  margin-top: 30px;
  z-index: 0;
`

const BoxesRow = styled(Row)`
  z-index: 1;
  margin-top: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-flow: column wrap;
    & > * {
      width: 100%;
    }
  `};
`

const ArrowWrapper = styled(IconWrapper)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    transform: rotate(90deg);
  `};
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

export const DefaultWrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  width: 100%;
  /* max-width: 600px; */
  background-color: ${({ theme }) => theme.bg3};
  height: 450px;
  box-shadow: ${({ theme }) => theme.boxShadow2};
`

export default function Bridge() {
  const dispatch = useAppDispatch()
  const { chainId, account } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const [selected, setSelected] = useState<string>('')
  const [Token1, setToken1] = useState<IToken | null>(null)
  const [TokenOut, setTokenOut] = useState<IToken | null>(null)

  const [awaitingApproveConfirmation, setAwaitingApproveConfirmation] = useState<boolean>(false)
  const [insufficientBalance1, setInsufficientBalance1] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  // Allow user to connect any chain globally, but restrict unsupported ones on this page
  const isSupportedChainId: boolean = useMemo(() => {
    if (!chainId || !account) return false
    return DeiSupportedChains.includes(chainId)
  }, [chainId, account])

  // Define dropdown options
  const [inputTokenOption, inputChainOptions, outputChainOptions] = useMemo(() => {
    // const DEFAULT_OPTIONS = [[], [], []]
    const tokens = Object.keys(BRIDGE__TOKENS).map((symbol) => {
      const token = BRIDGE__TOKENS[symbol]
      return {
        symbol,
        logo: Tokens[symbol][token.sourceChains[0]].logo,
      }
    })

    const inputChains = BRIDGE__TOKENS[tokens[0].symbol].sourceChains
    const outputChains = BRIDGE__TOKENS[tokens[0].symbol].destinationChains
    return [tokens, inputChains, outputChains]
  }, [chainId, account, isSupportedChainId])

  function getActionButton(): JSX.Element | null {
    if (!chainId || !account) {
      return <PrimaryButton onClick={toggleWalletModal}>Connect Wallet</PrimaryButton>
    }
    if (!isSupportedChainId) {
      return null
    }

    // TODO: do we really want this? E.g. with it users are unable to mint if tx is pending
    // if (mintCallbackState == MintCallbackState.PENDING) {
    //   return (
    //     <PrimaryButton active>
    //       Minting <DotFlashing style={{marginLeft: '10px'}}/>
    //     </PrimaryButton>
    //   )
    // }
    if (insufficientBalance1) {
      return <PrimaryButton disabled>Insufficient {Token1?.symbol} Balance</PrimaryButton>
    }
    // TODO: turn the next line into: (loading || proxyLoading).
    // With it, it will only show/blink for a split second which is undesired.
    // Instead, implement a debouncer/suspense of some kind in the event
    // of extended loading of the proxy values. Regardless, the callback
    // function reverts if internally proxyLoading so no harm there.
    // if (loading) {
    //   // global DEI data
    //   return (
    //     <PrimaryButton active>
    //       Loading <DotFlashing style={{ marginLeft: '10px' }} />
    //     </PrimaryButton>
    //   )
    // }
    return (
      <PrimaryButton
        onClick={() => {
          console.log('Bridge...')
          // if (amountOut && amountOut != '0') {
          //   dispatch(setShowReview(true))
          // }
        }}
      >
        Bridge
      </PrimaryButton>
    )
  }

  function getMainContent(): JSX.Element {
    if (!account || !chainId) {
      return <TextBlock>Please connect your wallet.</TextBlock>
    }
    if (!isSupportedChainId) {
      return <TextBlock>Please connect with one of our supported chains (see above).</TextBlock>
    }
    return (
      <>
        <TokenSelect
          options={inputTokenOption}
          // selected={selected}
          setSelected={(symbol: string) => setSelected(symbol)}
          disabled={false}
        />
        <BoxesRow style={{ gap: '6px' }}>
          <InputBox
            options={BRIDGE__TOKENS[selected].sourceChains}
            // selected={selected}
            setSelected={(chainId: number) => setSelected(chainId)}
            setInsufficientBalance1={setInsufficientBalance1}
            disabled={false}
          />
          <ArrowWrapper size={'30px'} style={{ alignSelf: 'center' }}>
            <ArrowBubble size={30} />
          </ArrowWrapper>
          {/* <InputBox options={outputOptions} selected={[TokenOut?.address ?? '']} /> */}
        </BoxesRow>
      </>
    )
  }

  return (
    <DefaultWrapper>
      <ToggleRow>
        <p>Bridge</p>
        <TransactionSettings style={{ marginLeft: '20px' }} />
      </ToggleRow>
      {getMainContent()}
      <Row>{getActionButton()}</Row>
    </DefaultWrapper>
  )
}
