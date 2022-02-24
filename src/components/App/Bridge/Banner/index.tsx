import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import BannerImage from 'assets/img/MintBanner.svg'
import { Card } from 'components/Card'

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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1.1rem;
    flex-flow: column nowrap;
    & > * {
      &:nth-child(2) {
        margin-left: 0;
        margin-top: 1rem;
        color: ${({ theme }) => theme.text2};
      }
  }
  `};
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
  return (
    <Wrapper>
      <Left>
        <Title>
          <div>DEUS Bridge</div>
          <div>bridge between the all networks</div>
        </Title>
        <div>
          <Stat>
            {/* TODO: calculate total market cap */}
            <div>Total DEI Bridged</div>
            <div>15,335</div>
          </Stat>
          <Stat>
            <div>Total DEUS Bridged</div>
            <div>15,335</div>
          </Stat>
        </div>
      </Left>
      <Image src={BannerImage} alt="DEI Stablecoin" width={'200px'} />
    </Wrapper>
  )
}
