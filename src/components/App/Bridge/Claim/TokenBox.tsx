import styled from 'styled-components'
import Image from 'next/image'

import { RowBetween, RowStart } from 'components/Row'
import { Tokens } from 'constants/tokens'
import ClaimButton from './ClaimButton'

const Wrapper = styled.div`
  width: 100%;
  padding: 7px 18px 7px 18px;
  border-radius: 16px;
`

const TokenInfo = styled.div`
  /* margin-right: 8px; */
  color: ${({ theme }) => theme.bg0};
  &:hover {
    color: ${({ theme }) => theme.bg1};
  }
`

const TokenName = styled.div`
  font-size: 16px;
  margin-left: 10px;
  color: ${({ theme }) => theme.text1};
`

const NetworkName = styled.div`
  font-size: 12px;
  margin-left: 10px;
  border-radius: 4px;
  padding: 2px 4px 3px 4px;
  color: ${({ theme }) => theme.blue1};
  background: ${({ theme }) => theme.bg0};
`

export const TokenBox = () => {
  return (
    <Wrapper>
      <TokenInfo>
        <RowBetween>
          <RowStart alignItems="center">
            <Image width="25px" height="25px" src={Tokens.DEUS[1].logo} alt={'DEUS'} />
            <TokenName>DEUS</TokenName>
            <NetworkName>Matic</NetworkName>
          </RowStart>
          <TokenName>{'1000000000'}</TokenName>
        </RowBetween>
        <RowBetween mt={'10px'}>
          <ClaimButton toChainId={137} claimableBlock={180} currentBlock={150} />
        </RowBetween>
      </TokenInfo>
    </Wrapper>
  )
}

export const RedeemTokenBox = () => {
  return (
    <Wrapper>
      <TokenInfo>
        <RowBetween>
          <RowStart alignItems="center">
            <Image width="25px" height="25px" src={Tokens.DEUS[1].logo} alt={'DEUS'} />
            <TokenName>DEUS</TokenName>
            <NetworkName>Matic</NetworkName>
          </RowStart>
          <TokenName>{'1000000000'}</TokenName>
        </RowBetween>
        <RowBetween mt={'10px'}>
          <ClaimButton toChainId={137} claimableBlock={180} currentBlock={150} />
        </RowBetween>
      </TokenInfo>
    </Wrapper>
  )
}
