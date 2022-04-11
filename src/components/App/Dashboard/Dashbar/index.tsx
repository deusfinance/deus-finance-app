import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { RowCenter } from 'components/Row'
import BRIDGE_ICON_URL from 'assets/img/dashboard/bridge.svg'
import FARMS_ICON_URL from 'assets/img/dashboard/farms.svg'
import FRONTENDS_ICON_URL from 'assets/img/dashboard/frontends.svg'
import MIGRATOR_ICON_URL from 'assets/img/dashboard/migrator.svg'
import STABLECOIN_ICON_URL from 'assets/img/dashboard/stablecoin.svg'
import SWAP_ICON_URL from 'assets/img/dashboard/swap.svg'

const DashboardButtons = styled(RowCenter)`
  flex-wrap: wrap;
  width: 100%;
  margin: auto;
`

const ButtonWrap = styled.div`
  height: 106px;
  padding: 2px;
  margin: 20px auto;
  border-radius: 0px 16px 16px 16px;
  background: linear-gradient(180deg, #de86d2 0%, rgba(0, 184, 242, 0.21) 100%);
`

const StyledButton = styled(RowCenter)`
  width: 165px;
  height: 100%;
  flex-direction: column;
  border-radius: 0px 16px 16px 16px;
  background: linear-gradient(238.61deg, #171615 56.45%, rgba(125, 123, 235, 0.65) 114.3%);
`

const Label = styled.div`
  text-align: center;
  color: rgba(222, 134, 210, 1);
  margin-top: 10px;
  font-weight: 400;
  font-size: 20px;
`

const buttons = [
  { img: STABLECOIN_ICON_URL, label: 'Stablecoin' },
  { img: BRIDGE_ICON_URL, label: 'Bridge' },
  { img: FRONTENDS_ICON_URL, label: 'Frontends' },
  { img: MIGRATOR_ICON_URL, label: 'Migrator' },
  { img: SWAP_ICON_URL, label: 'Swap' },
  { img: FARMS_ICON_URL, label: 'Farms' },
]

function DashButton({ icon, label }: { icon: string; label: string }) {
  return (
    <ButtonWrap>
      <StyledButton>
        <>
          <Image src={icon} alt={`${label} logo`} />
          <Label>{label}</Label>
        </>
      </StyledButton>
    </ButtonWrap>
  )
}

export default function Dashbar() {
  return (
    <DashboardButtons>
      {buttons.map((button, index) => (
        <DashButton key={index} icon={button.img} label={button.label} />
      ))}
    </DashboardButtons>
  )
}
