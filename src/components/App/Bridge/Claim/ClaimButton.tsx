import React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from 'components/Button'
import useWeb3React from 'hooks/useWeb3'
import { ChainInfo } from 'constants/chainInfo'
import { BridgeMinimumBlockNeed, SupportedChainId } from 'constants/chains'

const RemainingBlock = styled.div<{ width?: string }>`
  background-color: ${({ theme }) => theme.blue2};
  height: 100%;
  left: 0;
  opacity: 0.5;
  position: absolute;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  width: ${({ width }) => width ?? 'unset'};
`
const RemainingText = styled.div<{ width?: string }>`
  position: absolute;
  z-index: 10;
`

const Button = styled(PrimaryButton)`
  overflow: hidden;
  height: 30px;
`

export default function ClaimButton({
  toChainId,
  claimableBlock,
  currentBlock,
}: {
  toChainId: SupportedChainId
  claimableBlock: number
  currentBlock: number
}): JSX.Element {
  const { chainId } = useWeb3React()
  if (chainId !== toChainId) {
    return <Button>Switch to {ChainInfo[toChainId].label}</Button>
  }
  console.log({ toChainId, claimableBlock, currentBlock })

  const diff = claimableBlock - currentBlock
  if (diff > 0) {
    const elapsed = (100 * (BridgeMinimumBlockNeed[toChainId] - diff)) / BridgeMinimumBlockNeed[toChainId]
    return (
      <Button disabled>
        <RemainingText>
          Remaining Block {Math.abs(diff)} / {BridgeMinimumBlockNeed[toChainId]}
        </RemainingText>
        <RemainingBlock width={elapsed.toFixed(2) + '%'}></RemainingBlock>
      </Button>
    )
  }
  return <Button>Claim</Button>
}
