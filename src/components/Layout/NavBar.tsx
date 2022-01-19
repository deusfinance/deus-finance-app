import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { ThemeToggle, NavToggle as NavToggleIcon } from 'components/Icons'
import { NavButton } from 'components/Button'
import { useDarkModeManager } from 'state/user/hooks'

import { Sidebar } from './Sidebar'
import NavLogo from './NavLogo'
import { Z_INDEX } from 'theme'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 0px 2rem;
  height: 55px;
  align-items: center;
  background: ${({ theme }) => theme.bg2};
  border-bottom: ${({ theme }) => theme.border2};
  gap: 5px;
  z-index: ${Z_INDEX.fixed};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px 1.25rem;
  `};
`

const NavItems = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 5px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > * {
      display: none;
    }
`};
`

const NavToggle = styled(NavToggleIcon)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

export default function NavBar() {
  const { pathname } = useRouter()
  const [, toggleDarkMode] = useDarkModeManager()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const toggleSidebar = (isOpen: boolean) => {
    setSidebarOpen((prev) => isOpen ?? !prev)
  }

  const isHomePage = useMemo(() => {
    return pathname === '/'
  }, [pathname])

  return (
    <Wrapper>
      <NavLogo />
      <NavItems>
        {isHomePage ? (
          <Link href="/stablecoin" passHref>
            <NavButton>OPEN APP</NavButton>
          </Link>
        ) : (
          <>
            <NavButton onClick={() => toggleDarkMode()}>
              <ThemeToggle size={20} />
            </NavButton>
            <Web3Status />
            <Web3Network />
          </>
        )}
      </NavItems>
      <NavToggle onClick={() => toggleSidebar(true)} />
      <Sidebar toggled={sidebarOpen} onToggle={toggleSidebar} />
    </Wrapper>
  )
}
