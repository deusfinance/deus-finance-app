import styled from 'styled-components'
import { Card } from 'components/Card'

export { default as Banner } from './Banner'
export { default as Navigation, NavigationTypes } from './Navigation'
export { default as Mint } from './Mint'
export { default as Redeem } from './Redeem'
export { default as Statistics } from './Statistics'
export { default as ComingSoon } from './ComingSoon'

export const DefaultWrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  box-shadow: ${({ theme }) => theme.boxShadow2};
`
