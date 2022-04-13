import { HeaderFrame, HeaderLinks, StyledNavLink } from 'components/PageStateSwitch'

export enum ReedemSwitchValues {
  REDEEM = 'REDEEM',
  CLAIM = 'CLAIM',
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
