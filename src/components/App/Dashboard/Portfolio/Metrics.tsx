import React from 'react'
import styled from 'styled-components'
import { Label } from './Option'
import Metric from './Metric'
import Image from 'next/image'
import CUBE_ICON_URL from 'assets/img/dashboard/cube.svg'
import SPIRIT_ICON_URL from 'assets/img/dashboard/spirit.svg'
import GetMetricsButton from './GetMetricsButton'

const Wrap = styled.div`
  margin-top: 20px;
  background: ${({ theme }) => theme.bg0};
  width: 100%;
`

const CenterLabel = styled(Label)`
  text-align: center;
  margin-top: 20px;
`

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const Value = styled.p`
  color: rgba(3, 158, 241, 1);
`

export default function Metrics({
  label,
  metrics,
}: {
  label: string
  metrics: Array<{ label: string; value: string }>
}) {
  return (
    <Wrap>
      <CenterLabel>{label} Metrics</CenterLabel>
      {metrics.map((metric, index) => {
        return <Metric key={index} label={metric.label} value={metric.value} />
      })}

      <ButtonsDiv>
        {GetMetricsButton(
          <>
            <Image src={SPIRIT_ICON_URL} alt={`${label} logo`} />
            <Value>BUY {label}</Value>
          </>
        )}
        {GetMetricsButton(
          <>
            <Image src={CUBE_ICON_URL} alt={`${label} logo`} />
            <Value>VIEW FTMScan</Value>
          </>
        )}
      </ButtonsDiv>
    </Wrap>
  )
}
