import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: black; /* override radial background */
`

const Column = styled.div<{
  a: number
  disabled?: boolean
}>`
  display: flex;
  height: 100%;
  flex: 1;
  background: rgba(255, 255, 255, ${(props) => props.a});
  justify-content: center;
  align-items: center;
  font-size: 20px;
  transition: all 0.5s ease;
  transition-property: transform, font-size;

  &:focus,
  &:active,
  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0px 2px 20px rgba(255, 255, 255, 0.03);
    transform: translateY(-7px);
    font-size: 23px;
  }

  ${(props) =>
    props.disabled &&
    `
    pointer-events: none;
    opacity: 0.2
  `}
`

export default function Home() {
  return (
    <Container>
      <Link href={'/stablecoin'}>
        <Column a={0.01}>Stablecoin</Column>
      </Link>
      <Link href={'/swap'}>
        <Column a={0.02} disabled>
          Swap
        </Column>
      </Link>
      <Link href={'/bridge'}>
        <Column a={0.03} disabled>
          Bridge
        </Column>
      </Link>
    </Container>
  )
}
