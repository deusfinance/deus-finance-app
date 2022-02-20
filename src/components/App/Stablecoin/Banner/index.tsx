import React, { useMemo } from 'react'
import styled from 'styled-components'

import Image from 'next/image'
import BannerImage from 'assets/img/MintBanner.svg'

import { Card } from 'components/Card'
import Copy from 'components/Copy'

import { truncateAddress } from 'utils/address'
import { Tokens } from 'constants/tokens'
import useWeb3React from 'hooks/useWeb3'

const Wrapper = styled(Card)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  height: 140px;
  padding: 1.25rem;
  width: 100%;
  background: ${({ theme }) => theme.specialBG2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: auto;
    padding: 1.5rem;
  `};
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
      gap: 1rem;
    }
  }
`

const Title = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 1.25rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1.2rem;
  `};

  & > * {
    &:first-child {
      font-weight: 700;
      color: ${({ theme }) => theme.text1};
    }
    &:nth-child(2) {
      font-weight: 500;
      margin-left: 1rem;
      color: ${({ theme }) => theme.text2};
    }
  }
`

const Stat = styled.div`
  margin: auto 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};

  color: ${({ theme }) => theme.text3};
  & > * {
    &:first-child {
      font-weight: 700;
      font-size: 0.75rem;
      color: ${({ theme }) => theme.text1};
    }
    &:nth-child(2) {
      font-size: 1rem;
      margin-top: 3px;
      color: ${({ theme }) => theme.primary1};
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
          <div>MultiChain fractional stablecoin</div>
        </Title>
        <div>
          <Stat>
            {/* TODO: calculate total market cap */}
            <div>Total Market Cap</div>
            <div>-</div>
          </Stat>
          <Stat>
            <div>Contract</div>
            <Copy toCopy={DEI_ADDRESS} text={truncateAddress(DEI_ADDRESS)} placement="right" />
          </Stat>
        </div>
      </Left>
      <Image src={BannerImage} alt="DEI Stablecoin" />
    </Wrapper>
  )
}
