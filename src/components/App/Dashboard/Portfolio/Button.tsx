import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  width: 100px;
  margin: 10px;
  text-align: center;
  background: ${({ theme }) => theme.blue1};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(238.61deg, #171615 56.45%, rgba(125, 123, 235, 0.65) 114.3%);
  border-radius: 0px 16px 16px 16px;
  width: 165px;
  height: 106px;
  left: 544px;
  top: 245px;
`

export default function Button({ img, label }: { img: string; label: string }) {
  return (
    <StyledButton>
      <img src={img} /> {label}
    </StyledButton>
  )
}
