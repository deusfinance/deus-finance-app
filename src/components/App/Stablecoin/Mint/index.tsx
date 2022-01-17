import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useAppDispatch } from 'state'
import styled from 'styled-components'
import find from 'lodash/find'

import useWeb3React from 'hooks/useWeb3'
import useApproveCallback, { ApprovalState } from 'hooks/useApproveCallback'
import useMintCallback from 'hooks/useMintCallback'
import useMintPage from 'hooks/useMintPage'

import { useWalletModalToggle } from 'state/application/hooks'
import { useDeiStatus, useMintingFee } from 'state/dei/hooks'
import { DeiStatus, DeiSupportedChains } from 'state/dei/reducer'
import { useMintState, setMintState, setAttemptingTxn, setShowReview } from 'state/mint/reducer'

import { IToken } from 'utils/token'

import { CollateralPool, MintProxy } from 'constants/addresses'
import { MINT__INPUTS, MINT__OUTPUTS } from 'constants/inputs'

import { Card } from 'components/Card'
import { ArrowBubble, DotFlashing } from 'components/Icons'
import { PrimaryButton } from 'components/Button'
import TransactionSettings from 'components/TransactionSettings'
import ConfirmMintModal from 'components/TransactionConfirmationModal/ConfirmMint'

import InputBox from '../InputBox'
import NetworkSelect from '../NetworkSelect'

const Wrapper = styled(Card)`
  min-width: 540px;
  min-height: 340px;
  gap: 30px;
  overflow: visible;
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
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  overflow: visible;
`

const TextBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  text-align: center;
  justify-content: center;
  font-size: 0.8rem;
`

const Fee = styled.div`
  font-size: 0.6rem;
  margin-left: 10px;
`

export default function Mint() {
  const dispatch = useAppDispatch()
  const { chainId, account } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const deiStatus = useDeiStatus()
  const mintingFee = useMintingFee()
  const mintState = useMintState()

  const { isProxyMinter, attemptingTxn, showReview, error: mintStateError } = mintState

  const [selected, setSelected] = useState<string[]>([]) // [address1, optionalAddress2]
  const [Token1, setToken1] = useState<IToken | null>(null)
  const [Token2, setToken2] = useState<IToken | null>(null)
  const [TokenOut, setTokenOut] = useState<IToken | null>(null)

  const [awaitingApproveConfirmation, setAwaitingApproveConfirmation] = useState<boolean>(false)
  const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  // Allow user to connect any chain globally, but restrict unsupported ones on this page
  const isSupportedChainId: boolean = useMemo(() => {
    if (!chainId || !account) return false
    return DeiSupportedChains.includes(chainId)
  }, [chainId, account])

  // Oracle + global DEI data
  const [loading, error] = useMemo(() => {
    return [deiStatus == DeiStatus.LOADING, deiStatus == DeiStatus.ERROR]
  }, [deiStatus])

  // Define dropdown options
  const [inputOptions, outputOptions] = useMemo(() => {
    const DEFAULT_OPTIONS = [[], []]
    return isSupportedChainId && chainId && account ? [MINT__INPUTS[chainId], MINT__OUTPUTS[chainId]] : DEFAULT_OPTIONS
  }, [chainId, account, isSupportedChainId])

  // Flatten all options and their respective nested maps for easy IToken lookup
  const tokensFlat = useMemo(() => {
    return [...inputOptions, ...outputOptions].reduce((acc: IToken[], options) => {
      acc.push(...options)
      return acc
    }, [])
  }, [inputOptions, outputOptions])

  const { amount1, amount2, amountOut, onUserInput1, onUserInput2, onUserOutput } = useMintPage(
    Token1,
    Token2,
    TokenOut
  )

  // On user select
  useEffect(() => {
    const [address1, address2] = selected
    const Token1: IToken | undefined = find(tokensFlat, (token: IToken) => token.address == address1)
    const Token2: IToken | undefined = find(tokensFlat, (token: IToken) => token.address == address2)
    const DeiToken: IToken | undefined = find(tokensFlat, (token: IToken) => token.symbol == 'DEI')

    setToken1(Token1 ?? null)
    setToken2(Token2 ?? null)
    setTokenOut(DeiToken ?? null)

    // Reset amounts
    onUserInput1('')
  }, [tokensFlat, selected])

  const spender = useMemo(() => {
    return isSupportedChainId && chainId ? (isProxyMinter ? MintProxy[chainId] : CollateralPool[chainId]) : null
  }, [chainId, isSupportedChainId, isProxyMinter])

  const [approvalState1, approveCallback1] = useApproveCallback(Token1, spender)
  const [approvalState2, approveCallback2] = useApproveCallback(Token2, spender)

  const { state: mintCallbackState, callback: mintCallback } = useMintCallback(
    Token1,
    Token2,
    TokenOut,
    amount1,
    amount2,
    amountOut
  )

  const [showApprove1, showApproveLoader1, showApprove2, showApproveLoader2] = useMemo(() => {
    const show1 = approvalState1 !== ApprovalState.APPROVED
    const show2 = Token2 && approvalState2 !== ApprovalState.APPROVED
    return [
      show1,
      show1 && approvalState1 === ApprovalState.PENDING,
      show2,
      show2 && approvalState2 === ApprovalState.PENDING,
    ]
  }, [approvalState1, approvalState2, Token2])

  const handleApprove1 = async () => {
    setAwaitingApproveConfirmation(true)
    await approveCallback1()
    setAwaitingApproveConfirmation(false)
  }
  const handleApprove2 = async () => {
    setAwaitingApproveConfirmation(true)
    await approveCallback2()
    setAwaitingApproveConfirmation(false)
  }

  const handleMint = useCallback(async () => {
    if (!mintCallback) return
    dispatch(setAttemptingTxn(true))

    let error = ''
    try {
      const txHash = await mintCallback()
      setTxHash(txHash)
    } catch (e) {
      if (e instanceof Error) {
        error = e.message
      } else {
        console.error(e)
        error = 'An unknown error occured.'
      }
    }

    dispatch(setMintState({ ...mintState, error, attemptingTxn: false }))
  }, [mintCallback, dispatch, mintState])

  const handleOnDismiss = useCallback(() => {
    setTxHash('')
    dispatch(setMintState({ ...mintState, showReview: false, attemptingTxn: false, error: undefined }))
  }, [dispatch, mintState])

  function getApproveButton(): JSX.Element | null {
    if (!isSupportedChainId || !account) {
      return null
    }
    if (awaitingApproveConfirmation) {
      return (
        <PrimaryButton active>
          Awaiting Confirmation <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    if (showApproveLoader1 || showApproveLoader2) {
      return (
        <PrimaryButton active>
          Approving <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    if (showApprove1) {
      return <PrimaryButton onClick={handleApprove1}>Allow DEUS to spend your {Token1?.symbol}</PrimaryButton>
    }
    if (showApprove2) {
      return <PrimaryButton onClick={handleApprove2}>Allow DEUS to spend your {Token2?.symbol}</PrimaryButton>
    }
    return null
  }

  function getActionButton(): JSX.Element | null {
    if (!chainId || !account) {
      return <PrimaryButton onClick={toggleWalletModal}>Connect Wallet</PrimaryButton>
    }
    if (!isSupportedChainId) {
      return null
    }
    if (showApprove1 || showApprove2) {
      return <PrimaryButton disabled>Mint DEI</PrimaryButton>
    }
    if (error) {
      return <PrimaryButton disabled>Critical Error</PrimaryButton>
    }
    // TODO: do we really need this?
    // if (mintCallbackState == MintCallbackState.PENDING) {
    //   return (
    //     <PrimaryButton active>
    //       Minting <DotFlashing style={{marginLeft: '10px'}}/>
    //     </PrimaryButton>
    //   )
    // }
    if (insufficientBalance) {
      return <PrimaryButton disabled>Insufficient Balance</PrimaryButton>
    }
    // TODO: turn the next line into: (loading || proxyLoading).
    // With it, it will only show/blink for a split second which is undesired.
    // Instead, implement a debouncer/suspense of some kind in the event
    // of extended loading of the proxy values.
    if (loading) {
      // global DEI data
      return (
        <PrimaryButton active>
          Loading <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    return <PrimaryButton onClick={() => amountOut && dispatch(setShowReview(true))}>Mint DEI</PrimaryButton>
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
        <Row style={{ gap: '6px' }}>
          <InputBox
            options={inputOptions}
            selected={selected}
            setSelected={(addresses: string[]) => setSelected(addresses)}
            amount1={amount1}
            amount2={amount2}
            setAmount1={onUserInput1}
            setAmount2={onUserInput2}
            setInsufficientBalance={setInsufficientBalance}
            disabled={loading}
          />
          <ArrowBubble size={50} style={{ alignSelf: 'center' }} />
          <InputBox
            options={outputOptions}
            selected={[TokenOut?.address ?? '']}
            amount1={amountOut}
            setAmount1={onUserOutput}
            disabled={loading || isProxyMinter}
          />
        </Row>
        <Fee>Minting Fee: {mintingFee}%</Fee>
      </>
    )
  }

  return (
    <Wrapper>
      <ToggleRow>
        <NetworkSelect chains={DeiSupportedChains} />
        <TransactionSettings style={{ marginLeft: '20px' }} />
      </ToggleRow>
      {getMainContent()}
      <Row style={{ marginTop: 'auto' }}>
        {getApproveButton()}
        {getActionButton()}
      </Row>
      <ConfirmMintModal
        isOpen={showReview}
        onDismiss={handleOnDismiss}
        onConfirm={handleMint}
        attemptingTxn={attemptingTxn}
        mintErrorMessage={mintStateError}
        txHash={txHash}
        Token1={Token1}
        Token2={Token2}
        DEIToken={TokenOut}
        amount1={amount1}
        amount2={amount2}
        amountOut={amountOut}
      />
    </Wrapper>
  )
}
