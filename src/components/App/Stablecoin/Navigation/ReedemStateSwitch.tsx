import { darken } from 'polished'
import styled from 'styled-components'
import { Row } from 'components/Row'

const HeaderFrame = styled.div`
  width: 100%;
  top: 0;
  position: relative;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: 0 0;
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px transparent;
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 2px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  margin: auto;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled.div.attrs({
  activeClassName,
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? darken(0.1, theme.text1) : theme.text2)};
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;

  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 600;
    justify-content: center;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export enum ReedemSwitchValues {
  REDEEM = 'REDEEM',
  CLAIM = 'CLAIM',
}

const NavigationLabels = {
  [ReedemSwitchValues.REDEEM]: 'Redeem',
  [ReedemSwitchValues.CLAIM]: 'Claim',
}

export default function ReedemStateSwitch({
  selected,
  setSelected,
  showClaim,
}: {
  selected: string
  setSelected: (value: ReedemSwitchValues) => void
  showClaim: boolean
}) {
  return (
    <HeaderFrame>
      <HeaderLinks>
        <StyledNavLink
          isActive={selected == ReedemSwitchValues.REDEEM}
          onClick={() => setSelected(ReedemSwitchValues.REDEEM)}
          id={`redeem-nav-link`}
        >
          <span>Redeem</span>
        </StyledNavLink>
        <StyledNavLink
          isActive={selected == ReedemSwitchValues.CLAIM}
          onClick={() => setSelected(ReedemSwitchValues.CLAIM)}
          id={`claim-nav-link`}
        >
          <span>Claim</span>
          <sup>{showClaim ? '*' : ''}</sup>
        </StyledNavLink>
      </HeaderLinks>
    </HeaderFrame>
  )
}
