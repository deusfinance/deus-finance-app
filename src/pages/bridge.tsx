import React from 'react'
import styled from 'styled-components'

import BridgeUpdater from 'state/bridge/updater'

import Banner from 'components/App/Bridge/Banner'
import BridgeComponent from 'components/App/Bridge'

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

export default function Bridge() {
  return (
    <Container>
      <BridgeUpdater />
      <Banner />
      <BridgeComponent />
    </Container>
  )
}
