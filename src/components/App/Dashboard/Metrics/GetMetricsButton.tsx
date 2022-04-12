import React from 'react'
import styled from 'styled-components'
import { RowBetween } from 'components/Row'
import { ExternalLink } from 'components/Link'

const MetricsButton = styled(RowBetween)`
  border-radius: 25px;
  background: black;
  height: 100%;
  width: unset;
  padding: 15px 15px 15px 8px;
  & > * {
    &:last-child {
      margin-left: 10px;
    }
  }
`

const MetricsButtonWrap = styled.div`
  background: linear-gradient(93.61deg, #7d7beb 0.97%, #039ef1 103.64%);
  padding: 2px;
  border-radius: 43px;
  margin: 30px 50px 22px;
  height: 43px;
`

export default function GetMetricsButton(child: JSX.Element, link: string): JSX.Element | null {
  return (
    <MetricsButtonWrap>
      <ExternalLink href={link} style={{ textDecoration: 'none' }}>
        <MetricsButton>{child}</MetricsButton>
      </ExternalLink>
    </MetricsButtonWrap>
  )
}
