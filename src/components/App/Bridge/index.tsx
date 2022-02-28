import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useAppDispatch } from 'state'
import styled from 'styled-components'
import Image from 'next/image'

import MUON_LOGO from 'assets/img/tokens/muon.svg'
import { Tokens } from 'constants/tokens'
import { SupportedChainId } from 'constants/chains'
import { BRIDGE__TOKENS } from 'constants/inputs'
import { Bridge as BridgeAddress } from 'constants/addresses'
import { ChainInfo } from 'constants/chainInfo'

import { IToken } from 'utils/token'
import { useWalletModalToggle } from 'state/application/hooks'
import { DeiSupportedChains } from 'state/dei/reducer'
import { useBridgeState } from 'state/bridge/hooks'
import { setAttemptingTxn } from 'state/bridge/reducer'

import useWeb3React from 'hooks/useWeb3'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'
import useDepositCallback from 'hooks/useBridgeCallback'
import useApproveCallback, { ApprovalState } from 'hooks/useApproveCallback'

import { Card } from 'components/Card'
import { ArrowBubble, DotFlashing, IconWrapper } from 'components/Icons'
import { PrimaryButton } from 'components/Button'
import TransactionSettings from 'components/TransactionSettings'
import InputBox from 'components/App/Bridge/InputBox'
import TokenSelect from 'components/App/Bridge/TokenSelect'
import { ExternalLink } from 'components/Link'

const BridgeWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
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
  align-items: center;
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

const MuonText = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  text-align: center;
  color: ${({ theme }) => theme.text2};
  &:hover {
    opacity: 0.7;
  }
`

export const DefaultWrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  width: 100%;
  /* max-width: 600px; */
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: ${({ theme }) => theme.boxShadow2};
`

export default function Bridge() {
  const dispatch = useAppDispatch()
  const { chainId, account } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const switchRpcCallback = useRpcChangerCallback()

  const [tokenSymbol, setTokenSymbol] = useState<string>('DEI')
  const [sourceChainId, setSourceChainId] = useState<SupportedChainId | null | undefined>(chainId)
  const [destinationChainId, setDestinationChainId] = useState<SupportedChainId | null>(null)
  const [TokenIn, setTokenIn] = useState<IToken | null>(null)
  const [TokenOut, setTokenOut] = useState<IToken | null>(null)

  const [TokenAmountIn, setTokenAmountIn] = useState<string>('')

  const [awaitingApproveConfirmation, setAwaitingApproveConfirmation] = useState<boolean>(false)
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const bridgeState = useBridgeState()
  const { attemptingTxn, showReview, error: bridgeStateError } = bridgeState

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
  }, [])

  useEffect(() => {
    if (tokenSymbol != '' && chainId && sourceChainId) {
      const pickSourceChainId = inputChainOptions.includes(sourceChainId) ? sourceChainId : inputChainOptions[0]
      const filterDestinationOptions = outputChainOptions.filter((chainId) => chainId != pickSourceChainId)
      const pickDestinationChainId = destinationChainId
        ? filterDestinationOptions.includes(destinationChainId)
          ? destinationChainId
          : filterDestinationOptions[0]
        : filterDestinationOptions[0]

      setSourceChainId(pickSourceChainId)
      setDestinationChainId(pickDestinationChainId)

      setTokenIn(Tokens[tokenSymbol][pickSourceChainId])
      setTokenOut(Tokens[tokenSymbol][destinationChainId ?? pickDestinationChainId])
    }
  }, [tokenSymbol, inputChainOptions, outputChainOptions, sourceChainId, destinationChainId, chainId])

  const {
    state: depositCallbackState,
    callback: depositCallback,
    error: depositCallbackError,
  } = useDepositCallback(TokenIn, TokenOut, TokenAmountIn)

  // Claim data
  // const [loading, error] = useMemo(() => {
  //   return [deiStatus == bridgeState.LOADING, deiStatus == DeiStatus.ERROR]
  // }, [deiStatus])

  const spender = useMemo(() => {
    return chainId ? BridgeAddress[chainId] : null
  }, [chainId])

  const [approvalState, approveCallback] = useApproveCallback(TokenIn, spender)

  const [showApprove, showApproveLoader] = useMemo(() => {
    const show = approvalState !== ApprovalState.APPROVED
    return [show, show && approvalState === ApprovalState.PENDING]
  }, [approvalState])

  const handleApprove = async () => {
    setAwaitingApproveConfirmation(true)
    await approveCallback()
    setAwaitingApproveConfirmation(false)
  }

  const handleDeposit = useCallback(async () => {
    console.log('called handleDeposit')
    console.log(depositCallbackState, depositCallback, depositCallbackError)

    if (!depositCallback) return
    dispatch(setAttemptingTxn(true))

    let error = ''
    try {
      const txHash = await depositCallback()
      setTxHash(txHash)
    } catch (e) {
      if (e instanceof Error) {
        error = e.message
      } else {
        console.error(e)
        error = 'An unknown error occurred.'
      }
    }
  }, [dispatch, depositCallbackState, depositCallback, depositCallbackError])

  function getApproveButton(): JSX.Element | null {
    if (!account || (TokenIn && chainId != TokenIn.chainId)) {
      return null
    }
    if (awaitingApproveConfirmation) {
      return (
        <PrimaryButton active>
          Awaiting Confirmation <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    if (showApproveLoader || showApproveLoader) {
      return (
        <PrimaryButton active>
          Approving <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    if (showApprove) {
      return <PrimaryButton onClick={handleApprove}>Allow DEUS to spend your {TokenIn?.symbol}</PrimaryButton>
    }
    return null
  }

  function getActionButton(): JSX.Element | null {
    if (!chainId || !account) {
      return <PrimaryButton onClick={toggleWalletModal}>Connect Wallet</PrimaryButton>
    }
    if (TokenIn && chainId != TokenIn.chainId) {
      return (
        <PrimaryButton onClick={() => switchRpcCallback(TokenIn.chainId)}>
          Switch to {ChainInfo[TokenIn.chainId as SupportedChainId].label}{' '}
        </PrimaryButton>
      )
    }
    if (showApprove || showApprove) {
      return null
    }
    // if (error) {
    //   return <PrimaryButton disabled>Critical Error</PrimaryButton>
    // }

    // TODO: do we really want this? E.g. with it users are unable to mint if tx is pending
    // if (mintCallbackState == MintCallbackState.PENDING) {
    //   return (
    //     <PrimaryButton active>
    //       Minting <DotFlashing style={{marginLeft: '10px'}}/>
    //     </PrimaryButton>
    //   )
    // }
    if (insufficientBalance) {
      return <PrimaryButton disabled>Insufficient {TokenIn?.symbol} Balance</PrimaryButton>
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
          handleDeposit()
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
          setSelected={(symbol: string) => setTokenSymbol(symbol)}
          disabled={false}
        />
        <BoxesRow style={{ gap: '6px' }}>
          <InputBox
            options={inputChainOptions}
            token={TokenIn}
            amount={TokenAmountIn}
            setAmount={setTokenAmountIn}
            setSelected={(chainId: SupportedChainId) => setSourceChainId(chainId)}
            setInsufficientBalance={setInsufficientBalance}
            disabled={false}
          />
          <ArrowWrapper size={'30px'} style={{ alignSelf: 'center' }}>
            <ArrowBubble size={30} />
          </ArrowWrapper>
          <InputBox
            options={outputChainOptions}
            token={TokenOut}
            amount={TokenAmountIn}
            setAmount={setTokenAmountIn}
            setSelected={(chainId: SupportedChainId) => setDestinationChainId(chainId)}
            disableBalance={true}
            disabled={false}
          />
        </BoxesRow>
      </>
    )
  }

  return (
    <BridgeWrap>
      <DefaultWrapper>
        <ToggleRow>
          <p>Bridge</p>
          <TransactionSettings style={{ marginLeft: '20px' }} />
        </ToggleRow>
        {getMainContent()}
        <Row>
          {getApproveButton()}
          {getActionButton()}
        </Row>
      </DefaultWrapper>
      <ExternalLink href="https://muon.net/">
        <MuonText>
          <Image src={MUON_LOGO} width="20px" height="20px" alt="muon" />
          <p style={{ marginLeft: '0.5rem' }}>Powered by Muon Network</p>
        </MuonText>
      </ExternalLink>
    </BridgeWrap>
  )
}
