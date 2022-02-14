import { useMemo, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import find from 'lodash/find'
import flattenDeep from 'lodash/flattenDeep'
import useWeb3React from 'hooks/useWeb3'

import { DeiStatus, DeiSupportedChains } from 'state/dei/reducer'
import { IToken } from 'utils/token'
import { REDEEM__INPUTS, REDEEM__OUTPUTS } from 'constants/inputs'
import { useDeiStatus } from 'state/dei/hooks'
import useRedeemAmounts from 'hooks/useRedeemAmounts'
import { ArrowBubble, DotFlashing, IconWrapper } from 'components/Icons'
import { Card } from 'components/Card'
import InputBox from '../InputBox'
import useRedeemCallback from 'hooks/useRedeemCallback'
import { PrimaryButton } from 'components/Button'
import useApproveCallback, { ApprovalState } from 'hooks/useApproveCallback'
import { CollateralPool } from 'constants/addresses'
import { useWalletModalToggle } from 'state/application/hooks'
import NetworkSelect from '../NetworkSelect'
import TransactionSettings from 'components/TransactionSettings'

const Wrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  box-shadow: ${({ theme }) => theme.boxShadow2};
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
  const { chainId, account } = useWeb3React()
  const [TokenIn, setTokenIn] = useState<IToken | null>(null)
  const [TokenOut1, setTokenOut1] = useState<IToken | null>(null)
  const [TokenOut2, setTokenOut2] = useState<IToken | null>(null)
  const [awaitingApproveConfirmation, setAwaitingApproveConfirmation] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const toggleWalletModal = useWalletModalToggle()

  const deiStatus = useDeiStatus()

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
    // dispatch(setAttemptingTxn(true))

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
  }, [redeemCallbackState, redeemCallback, redeemCallbackError])

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
            handleRedeem()
            // dispatch(setShowReview(true))
          }
        }}
      >
        Redeem DEI
      </PrimaryButton>
    )
  }

  function getMainContent(): JSX.Element {
    if (!account || !chainId) {
      return <TextBlock>Please connect your wallet.</TextBlock>
    }

    return (
      <>
        <BoxesRow style={{ gap: '6px' }}>
          <InputBox
            options={inputOptions}
            selected={[TokenIn?.address ?? '']}
            setSelected={(addresses: string[]) => setSelected(addresses)}
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
      <Row>
        {getApproveButton()}
        {getActionButton()}
        {/* <PrimaryButton onClick={handleRedeem}>Redeem {TokenIn?.symbol}</PrimaryButton> */}
      </Row>
    </Wrapper>
  )
}
