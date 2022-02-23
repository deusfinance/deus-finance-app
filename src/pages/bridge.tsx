import React from 'react'
import styled from 'styled-components'

import { Banner } from 'components/App/Stablecoin'
import { RowBetween } from 'components/Row'
import BridgeComponent from 'components/App/Bridge'
import BridgeClaim from 'components/App/Bridge/Claim'

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
const Row = styled(RowBetween)`
  /* flex-wrap: wrap; */
  gap: 20px;
`

export default function Bridge() {
  return (
    <Container>
      <Banner />
      <Row height={'450px'}>
        <BridgeComponent />
        <BridgeClaim />
      </Row>
    </Container>
  )
}
