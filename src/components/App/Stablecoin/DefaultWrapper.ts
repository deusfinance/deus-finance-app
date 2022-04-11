import styled from 'styled-components'
import { Card } from 'components/Card'

export const DefaultWrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  box-shadow: ${({ theme }) => theme.boxShadow2};
`
export default DefaultWrapper
