import styled from 'styled-components'
import { Info } from 'react-feather'

export const DeiInfo = styled(Info)`
  color: ${(props) => props.color ?? '#919191'};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
