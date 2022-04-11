import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

import { RowCenter } from 'components/Row'
import { ExternalLink } from 'components/Link'
import SWAP_ICON_URL from 'assets/img/dashboard/swap.svg'
import FARMS_ICON_URL from 'assets/img/dashboard/farms.svg'
import BRIDGE_ICON_URL from 'assets/img/dashboard/bridge.svg'
import MIGRATOR_ICON_URL from 'assets/img/dashboard/migrator.svg'
import FRONTENDS_ICON_URL from 'assets/img/dashboard/frontends.svg'
import STABLECOIN_ICON_URL from 'assets/img/dashboard/stablecoin.svg'

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

const InternalLink = styled.a`
  text-decoration: none;
`

const buttons = [
  { img: STABLECOIN_ICON_URL, label: 'Stablecoin', link: '/stablecoin' },
  { img: BRIDGE_ICON_URL, label: 'Bridge', link: '/bridge' },
  // TODO: Add frontend & migrator links
  { img: FRONTENDS_ICON_URL, label: 'Frontends', link: '' },
  { img: MIGRATOR_ICON_URL, label: 'Migrator', link: '' },
  { img: SWAP_ICON_URL, label: 'Swap', link: 'https://www.solidly.vision/swap' },
  { img: FARMS_ICON_URL, label: 'Farms', link: 'https://app.deus.finance/stable/farms' },
]

function DashButton({ icon, label, link }: { icon: string; label: string; link: string }) {
  return (
    <ButtonWrap>
      {link.charAt(0) === '/' ? (
        <Link href={link} passHref>
          <InternalLink>
            <StyledButton>
              <>
                <Image src={icon} alt={`${label} logo`} />
                <Label>{label}</Label>
              </>
            </StyledButton>
          </InternalLink>
        </Link>
      ) : (
        <ExternalLink href={link} style={{ textDecoration: 'none' }}>
          <StyledButton>
            <>
              <Image src={icon} alt={`${label} logo`} />
              <Label>{label}</Label>
            </>
          </StyledButton>
        </ExternalLink>
      )}
    </ButtonWrap>
  )
}

export default function Dashbar() {
  return (
    <DashboardButtons>
      {buttons.map((button, index) => (
        <DashButton key={index} icon={button.img} label={button.label} link={button.link} />
      ))}
    </DashboardButtons>
  )
}
