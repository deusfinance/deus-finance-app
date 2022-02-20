import React, { useState } from 'react'
import styled from 'styled-components'

import { Banner, Navigation, NavigationTypes, Mint, ComingSoon, Redeem } from 'components/App/Stablecoin'
import { RowCenter } from 'components/Row'
import Bridge from 'components/App/Bridge'

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
const Row = styled(RowCenter)``

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
      return <Bridge /> // TODO
    }
    // NavigationTypes.FARMS
    return <ComingSoon /> // TODO
  }

  return (
    <Container>
      <Banner />
      {/* <SubHeader /> */}
      <Navigation selected={selected} setSelected={setSelected} />
      <Row>{getAppComponent()}</Row>
    </Container>
  )
}
