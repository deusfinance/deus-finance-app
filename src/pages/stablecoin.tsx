import React, { useState } from 'react'
import styled from 'styled-components'

import {
  Banner,
  Navigation,
  NavigationTypes,
  Mint,
  Statistics,
} from 'components/App/Stablecoin'

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: clamp(300px, 85%, 900px);
  margin: 0 auto;
  gap: 20px;

  & > * {
    &:nth-child(1) {
      margin-top: 75px;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  gap: 13px;
  min-height: 300px;
  transition: width 5s ease;

  & > * {
    &:nth-child(1) {
      flex: 1;
    }
  }
`

export default function Stablecoin() {
  const [selected, setSelected] = useState(NavigationTypes.MINT)

  const getAppComponent = ():JSX.Element => {
    if (selected == NavigationTypes.MINT) {
      return <Mint />
    }
    if (selected == NavigationTypes.REDEEM) {
      return <Mint /> // TODO
    }
    if (selected == NavigationTypes.ZAP) {
      return <Mint /> // TODO
    }
    return <Mint /> // TODO
  }
  
  return (
    <Container>
      <Banner/>
      <Navigation
        selected={selected}
        setSelected={setSelected}
      />
      <Row>
        {getAppComponent()}
        <Statistics/>
      </Row>
    </Container>
  )
}
