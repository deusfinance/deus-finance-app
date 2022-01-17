import styled, { css, keyframes } from 'styled-components'

type ButtonProps = {
  active?: boolean
  disabled?: boolean
}

const gradient = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

export const NavButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 35px;
  font-size: 15px;
  align-items: center;
  text-align: center;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;

  &:hover,
  &:focus {
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`

export const PrimaryButton = styled.div<ButtonProps>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  font-size: 1rem;
  background: #ffa76a;
  border: 1px solid #ff9c6f;
  border-radius: 10px;
  padding: 0 10px;
  color: #ffffff;

  ${(props) =>
    props.disabled &&
    `
    background: transparent;
    border: 1px solid gray;
    pointer-events: none;
  `}

  ${(props) =>
    props.active &&
    css`
      background: linear-gradient(88deg, #ffb463, #7b450a);
      background-size: 400% 400%;
      -webkit-animation: ${gradient} 8s ease infinite;
      -moz-animation: ${gradient} 8s ease infinite;
      animation: ${gradient} 8s ease infinite;
      border: 1px solid transparent;
      color: #ffffff;
    `}

  &:hover {
    cursor: pointer;
  }
`
