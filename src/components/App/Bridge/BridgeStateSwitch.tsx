import { HeaderFrame, HeaderLinks, StyledNavLink } from 'components/PageStateSwitch'

export enum BridgeSwitchValues {
  BRIDGE = 'BRIDGE',
  CLAIM = 'CLAIM',
}

export default function BridgeStateSwitch({
  selected,
  setSelected,
}: {
  selected: string
  setSelected: (value: BridgeSwitchValues) => void
}) {
  return (
    <HeaderFrame>
      <HeaderLinks>
        <StyledNavLink
          isActive={selected == BridgeSwitchValues.BRIDGE}
          onClick={() => setSelected(BridgeSwitchValues.BRIDGE)}
          id={`redeem-nav-link`}
        >
          <span>Bridge</span>
        </StyledNavLink>
        <StyledNavLink
          isActive={selected == BridgeSwitchValues.CLAIM}
          onClick={() => setSelected(BridgeSwitchValues.CLAIM)}
          id={`claim-nav-link`}
        >
          <span>Claim</span>
        </StyledNavLink>
      </HeaderLinks>
    </HeaderFrame>
  )
}
