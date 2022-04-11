import styled from 'styled-components'
import { RowCenter } from 'components/Row'

export const StableCoinRow = styled(RowCenter)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-wrap: wrap;
  `};
  align-items: flex-start;
  gap: 20px;
`

export default StableCoinRow
