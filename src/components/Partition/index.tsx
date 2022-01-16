import styled from 'styled-components'

export const HorPartition = styled.div<{
  color?: string
}>`
  display: block;
  height: 0px;
  border-bottom: 1px solid ${props => props.color ?? 'rgba(0, 0, 0, 0.2)'};
  margin: 5px;
`
