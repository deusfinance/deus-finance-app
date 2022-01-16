import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'

import NAV_LOGO from 'assets/images/Nav_Logo.svg'
import NAV_TEXT from 'assets/images/Nav_Text.svg'

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
    &:nth-child(2) {
      @media only screen and (max-width: 480px) {
        display: none;
      }
    }
  }
`

export default function NavLogo () {
  return (
    <Link href="/">
      <Wrapper>
        <div>
          <Image
            src={NAV_LOGO}
            alt='App Logo'
            width={30}
            height={30}
          />
        </div>
        <div>
          <Image
            src={NAV_TEXT}
            alt='App Logo'
            height={22}
          />
        </div>
      </Wrapper>
    </Link>
  )
}
