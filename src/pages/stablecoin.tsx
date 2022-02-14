import React, { useState } from 'react'
import styled from 'styled-components'

import { Banner, Navigation, NavigationTypes, Mint, ComingSoon, Statistics, Redeem } from 'components/App/Stablecoin'

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: clamp(300px, 85%, 900px);
  margin: 0 auto;
  gap: 20px;
  overflow: visible;
  margin-top: 75px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 30px;
  `};
`

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  gap: 13px;
  transition: width 5s ease;
  margin-top: 15px;
  overflow: visible;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-flow: column wrap;
  `};

  & > * {
    &:nth-child(1) {
      flex: 1;
    }
  }
`

export default function Stablecoin() {
  const [selected, setSelected] = useState<NavigationTypes>(NavigationTypes.MINT)

  const getAppComponent = (): JSX.Element => {
    if (selected == NavigationTypes.MINT) {
      return <Mint />
    }
    if (selected == NavigationTypes.REDEEM) {
      return <Redeem /> // TODO
    }
    if (selected == NavigationTypes.ZAP) {
      return <ComingSoon /> // TODO
    }
    // NavigationTypes.FARMS
    return <ComingSoon /> // TODO
  }

  return (
    <Container>
      <Banner />
      <Navigation selected={selected} setSelected={setSelected} />
      <Row>
        {getAppComponent()}
        <Statistics />
      </Row>
    </Container>
  )
}
