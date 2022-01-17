import React, { useMemo } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import BannerImage from 'assets/images/mint_ceremony.png'
import { Card } from 'components/Card'
import Copy from 'components/Copy'

import { truncateAddress } from 'utils/account'
import { Tokens } from 'constants/tokens'
import useWeb3React from 'hooks/useWeb3'

const Wrapper = styled(Card)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 250px;
  width: 100%;
  padding: 32px;
`

const Left = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  & > * {
    &:nth-child(2) {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      gap: 30px;
    }
  }
`

const Title = styled.div`
  display: flex;
  flex-flow: column nowrap;
  font-size: 30px;
  & > * {
    &:nth-child(2) {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`

const Stat = styled.div`
  color: rgba(255, 255, 255, 0.7);
  & > * {
    &:nth-child(2) {
      margin-top: 3px;
      color: #ffb463;
    }
  }
`

export default function Banner() {
  const { chainId } = useWeb3React()
  const DEI_ADDRESS = useMemo(() => {
    const token = Tokens['DEI'][chainId ?? 1]
    return token.address
  }, [chainId])

  return (
    <Wrapper>
      <Left>
        <Title>
          <div>DEI</div>
          <div>Cross-chain Stablecoin</div>
        </Title>
        <div>
          <Stat>
            <div>Total Market Cap</div>
            <div>-</div>
          </Stat>
          <Stat>
            <div>Contract</div>
            <Copy toCopy={DEI_ADDRESS} text={truncateAddress(DEI_ADDRESS)} placement="right" />
          </Stat>
        </div>
      </Left>
      <Image src={BannerImage} width={260} height={190} alt="DEI Stablecoin" />
    </Wrapper>
  )
}
