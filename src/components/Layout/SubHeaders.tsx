import Link from 'next/link'
import styled from 'styled-components'
import { darken } from 'polished'
import { Row } from 'components/Row'

const SubHeaderWrap = styled(Row)`
  height: 40px;
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 12px;
  width: fit-content;
  margin: auto;
  margin-top: 14px;
  margin-bottom: 14px;
`

const NavItem = styled.div`
  margin: 0 4px;
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(Link).attrs({
  activeClassName,
})`
  color: ${({ theme }) => theme.text2};
  overflow: hidden;
  outline: none;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 16px;
  padding: 4px 8px;
  &.${activeClassName} {
    background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const SubHeader = () => {
  return (
    <SubHeaderWrap>
      <NavItem>
        <StyledNavLink href="/stable/mint" passHref>
          Mint
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink href="/stable/redeem" passHref>
          Redeem
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink href="/stable/zap" passHref>
          Zap
        </StyledNavLink>
      </NavItem>
    </SubHeaderWrap>
  )
}

export default SubHeader
