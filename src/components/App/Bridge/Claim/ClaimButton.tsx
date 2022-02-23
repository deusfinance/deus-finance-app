import React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from 'components/Button'
import useWeb3React from 'hooks/useWeb3'
import { ChainInfo } from 'constants/chainInfo'
import { BridgeMinimumBlockNeed, SupportedChainId } from 'constants/chains'
import { RowCenter } from 'components/Row'

const RemainingWrap = styled(RowCenter)`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  opacity: 0.4;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  height: 25px;
  font-size: 12px;
`

const RemainingBlock = styled.div<{ width?: string }>`
  background-color: ${({ theme }) => theme.primary1};
  height: 2px;
  left: 0;
  bottom: 0;
  z-index: 10;
  position: absolute;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  width: ${({ width }) => width ?? 'unset'};
`

const Button = styled(PrimaryButton)`
  height: 25px;
  padding: 0;
  font-size: 12px;
`

export default function ClaimButton({
  toChainId,
  claimableBlock,
  currentBlock,
}: {
  toChainId?: SupportedChainId
  claimableBlock?: number
  currentBlock?: number
}): JSX.Element {
  const { chainId } = useWeb3React()
  if (toChainId && chainId !== toChainId) {
    return <Button>Switch to {ChainInfo[toChainId].label}</Button>
  }

  if (!toChainId || !claimableBlock || !currentBlock) {
    return <Button disabled>Claim</Button>
  }

  const diff = claimableBlock - currentBlock
  if (diff > 0) {
    const elapsed = (100 * (BridgeMinimumBlockNeed[toChainId] - diff)) / BridgeMinimumBlockNeed[toChainId]
    return (
      <RemainingWrap>
        <p>
          Remaining Block {Math.abs(diff)} / {BridgeMinimumBlockNeed[toChainId]}{' '}
        </p>
        <RemainingBlock width={elapsed.toFixed(2) + '%'}></RemainingBlock>
      </RemainingWrap>
    )
  }
  return <Button>Claim</Button>
}
