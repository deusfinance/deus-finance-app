import React from 'react'
import styled from 'styled-components'
import { Label } from './Option'
import Metric from './Metric'

const Wrap = styled.div`
  margin-top: 10px;
  background: ${({ theme }) => theme.bg0};
`

const CenterLabel = styled(Label)`
  text-align: center;
`

const BuyButton = styled.button`
  height: 43px;
  width: 126px;
  border-radius: 100px;
  border: 2px solid;
  text-align: center;
  margin-left: 10px;
`

const ViewButton = styled(BuyButton)`
  height: 43px;
  width: 165px;
  align: right;
  margin-left: 0px;
  margin-right: 10px;
`

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: center;
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
        <BuyButton>Buy {label}</BuyButton>
        <ViewButton>View</ViewButton>
      </ButtonsDiv>
    </Wrap>
  )
}
