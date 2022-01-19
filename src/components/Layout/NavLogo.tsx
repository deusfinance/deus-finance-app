import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import NAV_LOGO from 'assets/img/DeusLogo.svg'
import NAV_TEXT_WHITE from 'assets/img/DeusWhiteText.svg'
import NAV_TEXT_BLACK from 'assets/img/DeusBlackText.svg'
import { useIsDarkMode } from 'state/user/hooks'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-right: auto;

  &:hover {
    cursor: pointer;
  }

  & > div {
    display: flex;
    align-items: center;
    &:first-child {
      margin-right: 13px;
    }
  }
`

export default function NavLogo() {
  const darkMode = useIsDarkMode()
  return (
    <Link href="/" passHref>
      <Wrapper>
        <div>
          <img src={NAV_LOGO.src} color='green' alt="App Logo" width={30} height={30} />
        </div>
        <div>
          <img src={darkMode ? NAV_TEXT_WHITE.src : NAV_TEXT_BLACK.src} alt="App Logo" height={22} />
        </div>
      </Wrapper>
    </Link>
  )
}
