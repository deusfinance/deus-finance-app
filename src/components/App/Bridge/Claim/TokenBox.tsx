import styled from 'styled-components'
import Image from 'next/image'

import { ChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { RowBetween, RowStart } from 'components/Row'

import ClaimButton from './ClaimButton'
import { formatBalance } from 'utils/numbers'

const TokenInfo = styled.div`
  color: ${({ theme }) => theme.bg0};
  &:hover {
    color: ${({ theme }) => theme.bg1};
  }
`

const TokenName = styled.div`
  font-size: 14px;
  margin-left: 5px;
  color: ${({ theme }) => theme.text1};
`
const Amount = styled.div`
  font-size: 12px;
  margin-left: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
`

const Chain = styled.div`
  font-size: 10px;
  margin-left: 7px;
  border-radius: 4px;
  padding: 2px 4px 3px 4px;
  color: ${({ theme }) => theme.blue1};
  background: ${({ theme }) => theme.bg0};
`

export const TokenBox = ({
  symbol,
  logo,
  toChainId,
  claimableBlock,
  currentBlock,
  amount,
  onSwitchNetwork,
  onClaim,
}: {
  symbol: string | null
  logo: StaticImageData | string
  toChainId?: SupportedChainId
  claimableBlock?: number
  currentBlock?: number
  amount?: number | null
  onSwitchNetwork?: () => void
  onClaim?: () => void
}): JSX.Element => {
  if (!symbol || !toChainId || !claimableBlock || !currentBlock) {
    return <></>
  }

  return (
    <>
      <TokenInfo>
        <RowBetween>
          <RowStart alignItems="center">
            <Image width="20px" height="20px" src={logo} alt={'DEUS'} />
            <TokenName>{symbol}</TokenName>
            <Chain>{ChainInfo[toChainId].label}</Chain>
          </RowStart>
          <Amount>{formatBalance(amount)}</Amount>
        </RowBetween>
        <RowBetween mt={'15px'}>
          <ClaimButton
            toChainId={toChainId}
            claimableBlock={claimableBlock}
            currentBlock={currentBlock}
            onClaim={onClaim}
            onSwitchNetwork={onSwitchNetwork}
          />
        </RowBetween>
      </TokenInfo>
    </>
  )
}
