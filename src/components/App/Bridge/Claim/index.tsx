import React, { useCallback } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import Image from 'next/image'

import CLAIM_LOGO from 'assets/img/claim.svg'
import { RowBetween } from 'components/Row'
import { TokenBox } from './TokenBox'
import { IClaimToken, setAttemptingTxn } from 'state/bridge/reducer'
import { useClaimableTokens, useCurrentBlocks } from 'state/bridge/hooks'
import { useClaimCallback } from 'hooks/useBridgeCallback'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'
import { useAppDispatch } from 'state'
import {
  ActionWrap,
  BottomRow,
  BottomWrap,
  ClaimBox,
  EmptyToken,
  InfoHeader,
  InfoSubHeader,
  Title,
} from 'components/ClaimBox'

const BridgeClaimActionWrap = styled(ActionWrap)`
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.border2};
`

const BridgeClaimTitle = styled(Title)`
  font-size: 12px;
`

export const BridgeClaimBox = styled(ClaimBox)`
  & > div {
    border-bottom: 1px solid ${({ theme }) => lighten(0.3, theme.blue2)};
  }
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
    [dispatch, claimCallback]
  )

  return (
    <BridgeClaimActionWrap>
      <RowBetween mb="12px" margin="10px" marginBottom={0} width={'unset'}>
        <BridgeClaimTitle>Claim tokens</BridgeClaimTitle>
      </RowBetween>

      {!unClaimed || unClaimed.length == 0 ? (
        <BridgeClaimBox style={{ justifyContent: 'center' }}>
          <Image src={CLAIM_LOGO} alt="claim" />
          <EmptyToken> - nothing to claim -</EmptyToken>
        </BridgeClaimBox>
      ) : (
        <BridgeClaimBox>
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
        </BridgeClaimBox>
      )}

      {unClaimed.length > 0 && <BottomRow>{getInfoComponent()}</BottomRow>}
    </BridgeClaimActionWrap>
  )
}
