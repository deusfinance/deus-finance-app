import styled from 'styled-components'
import { X } from 'react-feather'

export const Close = styled(X)<{
  width?: string
  height?: string
  color?: string
}>`
  width: ${(props) => props.width ?? '15px'};
  height: ${(props) => props.height ?? '15px'};
  color: ${(props) => props.color ?? '#919191'};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
