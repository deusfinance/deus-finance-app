import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isMobileOnly as isMobile } from 'react-device-detect'

import { Z_INDEX } from 'theme'
import { useDarkModeManager } from 'state/user/hooks'

import { ThemeToggle } from 'components/Icons'
import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import NavLogo from './NavLogo'
import Menu from './Menu'

const Wrapper = styled.div`
  padding: 0px 2rem;
  height: 55px;
  align-items: center;
  background: ${({ theme }) => theme.bg1};
  gap: 5px;
  z-index: ${Z_INDEX.fixed};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px 1.25rem;
  `};
`

const DefaultWrapper = styled(Wrapper)`
  display: flex;
  flex-flow: row nowrap;
  & > * {
    &:first-child {
      flex: 1;
    }
    &:last-child {
      flex: 1;
    }
  }
`

const MobileWrapper = styled(Wrapper)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`

const Routes = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  gap: 5px;
`

const ItemWrap = styled.div`
  display: inline-flex;
  align-items: center;
`

const Items = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  gap: 5px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    & > * {
      &:first-child {
        display: none;
      }
    }
  `}
`

const NavLink = styled.div<{
  active: boolean
}>`
  font-size: 1rem;
  padding: 0.25rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  ${({ active, theme }) =>
    active &&
    `
    pointer-events: none;
    text-decoration: underline;
    text-decoration-color: ${theme.primary2};
    text-underline-offset: 6px;
  `};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.primary1};
  }
`

export default function NavBar() {
  const router = useRouter()
  const [, toggleDarkMode] = useDarkModeManager()

  function getMobileContent() {
    return (
      <MobileWrapper>
        <NavLogo />
        <Web3Status />
        <Menu />
      </MobileWrapper>
    )
  }

  function getDefaultContent() {
    return (
      <DefaultWrapper>
        <NavLogo />
        <Routes>
          <Link href="/stablecoin" passHref>
            <NavLink active={router.route === '/stablecoin'}>Stablecoin</NavLink>
          </Link>
          <Link href="/bridge" passHref>
            <NavLink active={router.route === '/bridge'}>Bridge</NavLink>
          </Link>
        </Routes>
        <Items>
          <ItemWrap>
            <NavLink active={false} onClick={() => toggleDarkMode()}>
              <ThemeToggle size={20} />
            </NavLink>
          </ItemWrap>
          <Web3Network />
          <Web3Status />
          <Menu />
        </Items>
      </DefaultWrapper>
    )
  }

  return isMobile ? getMobileContent() : getDefaultContent()
}
