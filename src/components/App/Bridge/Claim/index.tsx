import React, { useCallback } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import Image from 'next/image'

import CLAIM_LOGO from 'assets/img/claim.svg'
import { Card } from 'components/Card'
import { Row, RowBetween } from 'components/Row'
import { TokenBox } from './TokenBox'
import { IClaimToken, setAttemptingTxn } from 'state/bridge/reducer'
import { useClaimableTokens, useCurrentBlocks } from 'state/bridge/hooks'
import { useClaimCallback } from 'hooks/useBridgeCallback'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'
import { useAppDispatch } from 'state'

const ActionWrap = styled(Card)`
  padding: 0;
  max-height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow2};
  background-color: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.border2};
  max-width: 320px;
  width: 320px;
  min-height: 370px;
  min-width: 220px;
`
const Title = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text2};
`

export const ClaimBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  & > div {
    padding: 15px 10px;
    border-bottom: 1px solid ${({ theme }) => lighten(0.3, theme.blue2)};
  }
`

export const BottomRow = styled(Row)`
  flex-wrap: wrap;
  padding: 10px 10px;
  /* align-items: flex-end; */
  position: relative;
  background: ${({ theme }) => theme.bg2};
  margin-bottom: auto;
`

const BottomWrap = styled.div`
  text-align: center;
  /* vertical-align: bottom; */
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
  color: ${({ theme }) => theme.text2};
`

const getInfoComponent = (): JSX.Element => {
  return (
    <BottomWrap>
      <InfoHeader>Change to the destination Network</InfoHeader>
      <InfoSubHeader>to claim your token on respective networks.</InfoSubHeader>
    </BottomWrap>
  )
}

export default function BridgeClaim() {
  const unClaimed = useClaimableTokens()
  const currentBlocks = useCurrentBlocks()
  const dispatch = useAppDispatch()
  const onSwitchNetwork = useRpcChangerCallback()
  // const [token, setToken] = useState<IClaimToken | null>(null)
  const { state: claimCallbackState, callback: claimCallback, error: claimCallbackError } = useClaimCallback()

  const handleClaim = useCallback(
    async (token: IClaimToken | null) => {
      // console.log('called handleClaim')
      // console.log(claimCallbackState, claimCallback, claimCallbackError)

      if (!claimCallback) return
      dispatch(setAttemptingTxn(true))

      let error = ''
      try {
        const txHash = await claimCallback(token)
        // setTxHash(txHash)
      } catch (e) {
        if (e instanceof Error) {
          error = e.message
        } else {
          console.error(e)
          error = 'An unknown error occurred.'
        }
      }
    },
    [dispatch, claimCallbackState, claimCallback, claimCallbackError]
  )

  return (
    <ActionWrap>
      <RowBetween mb="12px" margin="10px" marginBottom={0} width={'unset'}>
        <Title>Claim tokens</Title>
      </RowBetween>

      {!unClaimed || unClaimed.length == 0 ? (
        <ClaimBox style={{ justifyContent: 'center' }}>
          <Image src={CLAIM_LOGO} alt="claim" />
          <EmptyToken>No Token to claim</EmptyToken>
        </ClaimBox>
      ) : (
        <ClaimBox>
          {unClaimed.map((token: IClaimToken, index: number) => {
            const { symbol, toChainId, fromChainId, amount, claimableBlock, logo } = token
            return (
              <TokenBox
                key={index}
                symbol={symbol}
                toChainId={toChainId}
                claimableBlock={claimableBlock}
                currentBlock={currentBlocks[fromChainId]}
                logo={logo}
                amount={amount}
                onSwitchNetwork={() => onSwitchNetwork(toChainId)}
                onClaim={() => handleClaim(token)}
              />
            )
          })}
        </ClaimBox>
      )}

      {unClaimed.length > 0 && <BottomRow>{getInfoComponent()}</BottomRow>}
    </ActionWrap>
  )
}
