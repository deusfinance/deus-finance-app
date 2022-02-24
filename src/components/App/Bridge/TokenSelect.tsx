import { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import Dropdown from 'components/Dropdown'

interface MinTokenInfo {
  symbol: string
  logo: StaticImageData | string
}

const Wrapper = styled.div<{
  autoHeight: boolean
}>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  justify-content: flex-start;
  min-width: 230px;
  background: ${({ theme }) => theme.bg1};
  border-radius: 15px;
  overflow: visible;
  margin-top: 1rem;

  & > * {
    &:not(:first-child) {
      padding: 0.7rem;
    }
    &:first-child {
      margin-bottom: auto;
    }
  }
`

const StyledDropdownOption = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: flex-start;
  gap: 5px;
  align-items: center;
  & > div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }
`

function DropdownOption(token: MinTokenInfo): JSX.Element {
  return (
    <StyledDropdownOption>
      <div>
        <Image src={token.logo} alt={`${token.symbol} Logo`} width={25} height={25} />
        {token.symbol}
      </div>
    </StyledDropdownOption>
  )
}

export default function TokenSelect({
  options = [],
  setSelected = () => null,
  disabled = false,
}: {
  options: Array<MinTokenInfo>
  setSelected?: (symbol: string) => void
  disabled: boolean
}) {
  // Map option values as addresses for the dropdown
  const dropdownOptions = useMemo(() => {
    return options.map((token) => {
      return {
        value: token.symbol,
        label: DropdownOption(token),
      }
    })
  }, [options])

  // Pick initial options
  useEffect(() => {
    const value = dropdownOptions.length > 0 ? dropdownOptions[0]['value'] : null
    if (value) {
      setSelected(value)
    } else {
      setSelected('')
    }
  }, [dropdownOptions])

  const onSelect = (addresses: string[]) => {
    setSelected(addresses[0])
  }

  return (
    <Wrapper autoHeight={dropdownOptions.length == 1}>
      <div>
        <Dropdown options={dropdownOptions} placeholder={'Select token'} onSelect={onSelect} disabled={disabled} />
      </div>
    </Wrapper>
  )
}
