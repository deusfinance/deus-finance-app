import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

import SWAP_ICON_URL from 'assets/img/dashboard/swap.svg'
import FARMS_ICON_URL from 'assets/img/dashboard/farms.svg'
import BRIDGE_ICON_URL from 'assets/img/dashboard/bridge.svg'
import MIGRATOR_ICON_URL from 'assets/img/dashboard/migrator.svg'
import FRONTENDS_ICON_URL from 'assets/img/dashboard/frontends.svg'
import STABLECOIN_ICON_URL from 'assets/img/dashboard/stablecoin.svg'

import { RowCenter } from 'components/Row'
import { ExternalLink } from 'components/Link'

const DashboardButtons = styled(RowCenter)`
  flex-wrap: wrap;
  width: 100%;
  margin: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin:20px auto;
  `};
`

const ButtonWrap = styled.div`
  height: 106px;
  padding: 2px;
  margin: 20px auto;
  border-radius: 0px 16px 16px 16px;
  background: linear-gradient(180deg, #de86d2 0%, rgba(0, 184, 242, 0.21) 100%);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin:10px;
  `};
`

const StyledButton = styled(RowCenter)`
  width: 165px;
  height: 100%;
  flex-direction: column;
  border-radius: 0px 16px 16px 16px;
  background: ${({ theme }) => theme.primary4};
  cursor: pointer;
`

const Label = styled.div`
  text-align: center;
  color: rgba(222, 134, 210, 1);
  margin-top: 10px;
  font-weight: 400;
  font-size: 20px;
`

const config = [
  { img: STABLECOIN_ICON_URL, label: 'Stablecoin', path: 'https://app.deus.finance/stable' },
  { img: BRIDGE_ICON_URL, label: 'Bridge', path: 'https://app.deus.finance/bridge' },
  { img: FRONTENDS_ICON_URL, label: 'Frontends', path: 'https://app.dsynths.com/trade' },
  { img: MIGRATOR_ICON_URL, label: 'Migrator', path: 'https://app.deus.finance/migrator' },
  { img: SWAP_ICON_URL, label: 'Swap', path: 'https://www.solidly.vision/swap' },
  { img: FARMS_ICON_URL, label: 'Farms', path: 'https://app.deus.finance/stable/farms' },
]

function DashButton({ icon, label, path }: { icon: string; label: string; path: string }) {
  return (
    <ButtonWrap>
      {path.charAt(0) === '/' ? (
        <Link href={path} passHref>
          <StyledButton>
            <Image src={icon} alt={`${label} logo`} />
            <Label>{label}</Label>
          </StyledButton>
        </Link>
      ) : (
        <ExternalLink href={path} style={{ textDecoration: 'none' }}>
          <StyledButton>
            <Image src={icon} alt={`${label} logo`} />
            <Label>{label}</Label>
          </StyledButton>
        </ExternalLink>
      )}
    </ButtonWrap>
  )
}

export default function Dashbar() {
  return (
    <DashboardButtons>
      {config.map((item, index) => (
        <DashButton key={index} icon={item.img} label={item.label} path={item.path} />
      ))}
    </DashboardButtons>
  )
}
