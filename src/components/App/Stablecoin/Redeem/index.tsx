import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import find from 'lodash/find'
import flattenDeep from 'lodash/flattenDeep'
import useWeb3React from 'hooks/useWeb3'
import { useAppDispatch } from 'state'

import { IToken } from 'utils/token'
import { REDEEM__INPUTS, REDEEM__OUTPUTS } from 'constants/inputs'

import { CollateralPool } from 'constants/addresses'
import { useWalletModalToggle } from 'state/application/hooks'
import { useDeiStatus, useRedeemPaused } from 'state/dei/hooks'
import { DeiStatus, DeiSupportedChains } from 'state/dei/reducer'
import { useRedeemBalances, useRedeemState, useShowClaim } from 'state/redeem/hooks'
import { setAttemptingTxn, setRedeemState, setShowReview } from 'state/redeem/reducer'

import useRedeemAmounts from 'hooks/useRedeemAmounts'
import useRedeemCallback, { useCollectRedemptionCallback } from 'hooks/useRedeemCallback'
import useApproveCallback, { ApprovalState } from 'hooks/useApproveCallback'

import { PrimaryButton } from 'components/Button'
import { ArrowBubble, DotFlashing, IconWrapper } from 'components/Icons'
import DefaultConfirmation from 'components/TransactionConfirmationModal/DefaultConfirmation'
import { DefaultWrapper as Wrapper } from '../DefaultWrapper'
import NetworkSelect from 'components/App/Stablecoin/NetworkSelect'
import InputBox from 'components/App/Stablecoin/InputBox'
import TransactionSettings from 'components/TransactionSettings'
import ColletRedemption from './ColletRedemption'
import ReedemStateSwitch, { ReedemSwitchValues } from 'components/App/Stablecoin/Redeem/ReedemStateSwitch'
import { useMediaQuery } from 'react-responsive'
import { MEDIA_WIDTHS } from 'theme'
import { StableCoinRow } from '../StableCoinRow'

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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-flow: column wrap;
    & > * {
      width: 100%;
    }
  `};
`

const RedeemBodyWrapper = styled(Wrapper)`
  margin: 0;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: auto;
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

const FeeWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0px 10px;

  & > * {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.text2};

    &:first-child {
      color: ${({ theme }) => theme.text3};
    }
  }
`

export default function Redeem() {
  const dispatch = useAppDispatch()
  const { chainId, account } = useWeb3React()
  const [TokenIn, setTokenIn] = useState<IToken | null>(null)
  const [TokenOut1, setTokenOut1] = useState<IToken | null>(null)
  const [TokenOut2, setTokenOut2] = useState<IToken | null>(null)
  const [awaitingApproveConfirmation, setAwaitingApproveConfirmation] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const toggleWalletModal = useWalletModalToggle()

  const deiStatus = useDeiStatus()
  const redeemState = useRedeemState()
  const { attemptingTxn, showReview, error: redeemStateError } = redeemState
  const redeemBalances = useRedeemBalances()
  const showClaim = useShowClaim()
  const redeemPaused = useRedeemPaused()

  const [selected, setSelected] = useState<string[]>([]) // [address1, optionalAddress2]
  const [insufficientBalance1, setInsufficientBalance1] = useState<boolean>(false)

  // Define dropdown options
  const [inputOptions, outputOptions] = useMemo(() => {
    const DEFAULT_OPTIONS = [[], []]
    return chainId && account ? [REDEEM__INPUTS[chainId], REDEEM__OUTPUTS[chainId]] : DEFAULT_OPTIONS
  }, [chainId, account])

  // Flatten all options and their respective nested maps for easy IToken lookup
  const tokensFlat = useMemo(() => flattenDeep([...inputOptions, ...outputOptions]), [inputOptions, outputOptions])

  //set default select
  useEffect(() => {
    if (outputOptions) setSelected(outputOptions[0].map((token) => token.address))
  }, [outputOptions])

  const { amountIn, amountOut1, amountOut2, onUserInput, onUserOutput1, onUserOutput2 } = useRedeemAmounts()

  const {
    state: redeemCallbackState,
    callback: redeemCallback,
    error: redeemCallbackError,
  } = useRedeemCallback(TokenIn, TokenOut1, TokenOut2, amountIn)

  const {
    state: collectRedemptionCallbackState,
    callback: collectRedemptionCallback,
    error: collectRedemptionCallbackError,
  } = useCollectRedemptionCallback(TokenOut1, TokenOut2, redeemBalances.collateral, redeemBalances.deus)

  const spender = useMemo(() => {
    return chainId ? CollateralPool[chainId] : null
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

  const handleRedeem = useCallback(async () => {
    console.log('called handleRedeem')
    console.log(redeemCallbackState, redeemCallback, redeemCallbackError)

    if (!redeemCallback) return
    dispatch(setAttemptingTxn(true))

    let error = ''
    try {
      const txHash = await redeemCallback()
      setTxHash(txHash)
    } catch (e) {
      if (e instanceof Error) {
        error = e.message
      } else {
        console.error(e)
        error = 'An unknown error occurred.'
      }
    }

    //  dispatch(setMintState({ ...mintState, error, attemptingTxn: false }))
  }, [dispatch, redeemCallbackState, redeemCallback, redeemCallbackError])

  const handleCollectRedemption = useCallback(async () => {
    console.log('called handleRedeem')
    console.log(collectRedemptionCallbackState, collectRedemptionCallback, collectRedemptionCallbackError)

    if (!collectRedemptionCallback) return

    let error = ''
    try {
      const txHash = await collectRedemptionCallback()
      setTxHash(txHash)
    } catch (e) {
      if (e instanceof Error) {
        error = e.message
      } else {
        console.error(e)
        error = 'An unknown error occurred.'
      }
    }

    //  dispatch(setMintState({ ...mintState, error, attemptingTxn: false }))
  }, [collectRedemptionCallbackState, collectRedemptionCallback, collectRedemptionCallbackError])

  const handleOnDismiss = useCallback(() => {
    setTxHash('')
    dispatch(setRedeemState({ ...redeemState, showReview: false, attemptingTxn: false, error: undefined }))
  }, [dispatch, redeemState])

  // On user select
  useEffect(() => {
    const [address1, address2] = selected
    const TokenOut1: IToken | undefined = find(tokensFlat, (token: IToken) => token.address == address1)
    const TokenOut2: IToken | undefined = find(tokensFlat, (token: IToken) => token.address == address2)
    const DeiToken: IToken | undefined = find(tokensFlat, (token: IToken) => token.symbol == 'DEI')

    setTokenIn(DeiToken ?? null)
    setTokenOut1(TokenOut1 ?? null)
    setTokenOut2(TokenOut2 ?? null)

    onUserInput('')
  }, [tokensFlat, selected])

  // Oracle + global DEI data
  const [loading, error] = useMemo(() => {
    return [deiStatus == DeiStatus.LOADING, deiStatus == DeiStatus.ERROR]
  }, [deiStatus])

  function getApproveButton(): JSX.Element | null {
    if (!account) {
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
    if (showApprove || showApprove) {
      return null
    }
    if (error) {
      return <PrimaryButton disabled>Critical Error</PrimaryButton>
    }
    if (redeemPaused) {
      return <PrimaryButton disabled>Redeem Paused</PrimaryButton>
    }

    if (insufficientBalance1) {
      return <PrimaryButton disabled>Insufficient {TokenIn?.symbol} Balance</PrimaryButton>
    }

    if (loading) {
      // global DEI data
      return (
        <PrimaryButton active>
          Loading <DotFlashing style={{ marginLeft: '10px' }} />
        </PrimaryButton>
      )
    }
    return (
      <PrimaryButton
        onClick={() => {
          if (amountOut1 && amountOut1 != '0' && amountOut2 && amountOut2 != '0') {
            // handleRedeem()
            dispatch(setShowReview(true))
          }
        }}
      >
        Redeem DEI
      </PrimaryButton>
    )
  }

  const TokensIn = []
  if (TokenIn) TokensIn.push(TokenIn)
  const TokensOut = []
  if (TokenOut1 && TokenOut2) TokensOut.push(...[TokenOut1, TokenOut2])

  function getMainContent(): JSX.Element {
    if (!account || !chainId) {
      return <TextBlock>Please connect your wallet.</TextBlock>
    }

    return (
      <BoxesRow style={{ gap: '6px' }}>
        <InputBox
          options={inputOptions}
          selected={[TokenIn?.address ?? '']}
          // setSelected={(addresses: string[]) => setSelected(addresses)}
          amount1={amountIn}
          setAmount1={onUserInput}
          setInsufficientBalance1={setInsufficientBalance1}
          disabled={loading}
        />
        <ArrowWrapper size={'30px'} style={{ alignSelf: 'center' }}>
          <ArrowBubble size={30} />
        </ArrowWrapper>
        <InputBox
          options={outputOptions}
          selected={selected}
          amount1={amountOut1}
          amount2={amountOut2}
          setAmount1={onUserOutput1}
          setAmount2={onUserOutput2}
          disabled={loading}
        />
      </BoxesRow>
    )
  }

  const [redeemSwitchState, setRedeemSwitchState] = useState<ReedemSwitchValues>(ReedemSwitchValues.REDEEM)

  function getRedeemBodyComponent() {
    return (
      <RedeemBodyWrapper>
        <ToggleRow>
          <NetworkSelect chains={DeiSupportedChains} />
          <TransactionSettings style={{ marginLeft: '20px' }} />
        </ToggleRow>
        {getMainContent()}
        <Row>
          {getApproveButton()}
          {getActionButton()}
        </Row>

        <DefaultConfirmation
          title="Redeem DEI"
          isOpen={showReview}
          onDismiss={handleOnDismiss}
          onConfirm={handleRedeem}
          onConfirmTitle="Redeem DEI"
          attemptingTxn={attemptingTxn}
          errorMessage={redeemStateError}
          txHash={txHash}
          TokensIn={TokensIn}
          TokensOut={TokensOut}
          amountsIn={[amountIn]}
          amountsOut={[amountOut1, amountOut2]}
          summary={`Redeem `}
        />
      </RedeemBodyWrapper>
    )
  }

  function getRedeemMobileComponent() {
    return (
      <>
        <ReedemStateSwitch selected={redeemSwitchState} setSelected={setRedeemSwitchState} showClaim={showClaim} />
        {redeemSwitchState === ReedemSwitchValues.REDEEM ? (
          getRedeemBodyComponent()
        ) : (
          <ColletRedemption
            collateralToken={TokenOut1}
            deusToken={TokenOut2}
            redeemBalances={redeemBalances}
            showClaim={showClaim}
            onClaim={handleCollectRedemption}
          />
        )}
      </>
    )
  }

  function getRedeemDesktopComponent() {
    return (
      <StableCoinRow>
        {getRedeemBodyComponent()}
        <ColletRedemption
          collateralToken={TokenOut1}
          deusToken={TokenOut2}
          redeemBalances={redeemBalances}
          showClaim={showClaim}
          onClaim={handleCollectRedemption}
        />
      </StableCoinRow>
    )
  }

  const upToMedium = useMediaQuery({ query: `(max-width: ${MEDIA_WIDTHS.upToMedium}px)` })

  return upToMedium ? getRedeemMobileComponent() : getRedeemDesktopComponent()
}
