import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { RowBetween } from 'components/Row'

const StyledButton = styled(RowBetween)`
  width: 165px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 0px 16px 16px 16px;
  background: linear-gradient(238.61deg, #171615 56.45%, rgba(125, 123, 235, 0.65) 114.3%);
`

const StyledButtonWrap = styled.div`
  height: 106px;
  width: unset;
  padding: 2px;
  margin: 20px 6px;
  border-radius: 0px 16px 16px 16px;
  background: linear-gradient(180deg, #de86d2 0%, rgba(0, 184, 242, 0.21) 100%);
`

const Value = styled.div`
  text-align: center;
  color: rgba(222, 134, 210, 1);
  margin-top: 10px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 18px;
`

export default function Button({ icon, label }: { icon: string; label: string }) {
  return (
    <StyledButtonWrap>
      <StyledButton>
        <>
          <Image src={icon} alt={`${label} logo`} />
          <Value>{label}</Value>
        </>
      </StyledButton>
    </StyledButtonWrap>
  )
}
