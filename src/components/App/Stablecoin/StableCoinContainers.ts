import styled from 'styled-components'
import { Card } from 'components/Card'
import { RowCenter } from 'components/Row'

export const DefaultWrapper = styled(Card)`
  justify-content: flex-start;
  overflow: visible;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  box-shadow: ${({ theme }) => theme.boxShadow2};
`

export const StableCoinRow = styled(RowCenter)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-wrap: wrap;
  `};
  align-items: flex-start;
  gap: 20px;
`
