import React from 'react'
import styled from 'styled-components'

import { ExplorerDataType, getExplorerLink } from 'utils/explorers'

const Link = styled.a`
  text-decoration: none;
  color: inherit;

  &:focus,
  &:hover,
  &:active {
    cursor: pointer;
    outline: none;
  }
`

export const ExternalLink = ({
  href ='#',
  target = '_blank',
  rel ='noopener noreferrer',
  children,
} : {
  href: string
  target?: string
  rel?: string
  children?: React.ReactNode
}) => {
  return (
    <Link href={href} target={target} rel={rel}>
      {children}
    </Link>
  )
}

export const ExplorerLink = ({ 
  chainId, 
  type, 
  value, 
  children 
} : {
  chainId: number
  type: ExplorerDataType
  value: string
  children: React.ReactNode
}) => {
  return (
    <ExternalLink href={getExplorerLink(chainId, type, value)}>
      {children}
    </ExternalLink>
  )
}
