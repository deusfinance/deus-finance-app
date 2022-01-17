import React, { useState, useRef, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import find from 'lodash/find'

import useOnOutsideClick from 'hooks/useOnOutsideClick'
import { ChevronDown } from 'components/Icons'

const Wrapper = styled.div`
  display: block;
  overflow: hidden;
  color: #888c92;
  z-index: 1000;
`

const Header = styled.div<{
  noHover?: boolean
  isOpen?: boolean
}>`
  display: flex;
  justify-content: space-between;
  background: transparent;
  border: 1px solid transparent; /* this prevents border jumping */
  font-size: 17px;
  border-radius: 10px;
  text-align: left;
  padding: 0 10px;
  align-items: center;
  height: 40px;

  ${(props) =>
    !props.noHover &&
    `
    &:hover {
      cursor: pointer;
    }
  `}

  ${(props) =>
    props.isOpen &&
    `
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: none;
    border-radius: 10px 10px 0px 0px;
  `}
`

const StyledChevron = styled(({ isOpen, ...props }) => <ChevronDown {...props} />)<{
  isOpen?: boolean
}>`
  transition: transform 0.5s ease-out;
  width: 15px;
  ${(props) =>
    props.isOpen &&
    css`
      transform: scaleY(-1);
    `};
`

const List = styled.ul<{
  isOpen?: boolean
}>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  background: rgba(0, 0, 0, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0px 0px 10px 10px;
  border-top: none;
  overflow: hidden;
  position: absolute;
  width: calc(100% - 10px);

  & > * {
    &:not(:last-child) {
      border-bottom: 1.5px solid #000000;
    }
  }
`

const ListItem = styled.li`
  list-style: none;
  text-align: left;
  height: 40px;
  border-top: none;
  line-height: 40px;
  padding: 0 10px;
  font-size: 13px;

  &:hover {
    cursor: pointer;
    background: #ffb463;
  }
`

interface Option {
  value: string
  label: JSX.Element | string
}

export default function Dropdown({
  options = [],
  placeholder = 'Select',
  onSelect,
  disabled = false,
}: {
  options: Option[]
  placeholder: string
  onSelect: (addresses: string[]) => void
  disabled?: boolean
}) {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string[]>([])

  useOnOutsideClick(ref, () => setIsOpen(false))

  useEffect(() => {
    if (options.length > 0) {
      const defaultValue = options[0].value.split(':')
      onSelect(defaultValue)
      setSelectedOption(defaultValue)
    }
  }, [options])

  const header: JSX.Element | string = useMemo(() => {
    const option: Option | undefined = find(options, (obj) => obj.value == selectedOption.join(':'))
    return option?.label ?? placeholder
  }, [options, selectedOption, placeholder])

  const toggle = () => {
    !disabled && setIsOpen(!isOpen)
  }

  if (!options.length) {
    return (
      <Wrapper ref={ref}>
        <Header noHover>No options available</Header>
      </Wrapper>
    )
  }

  if (options.length == 1) {
    return (
      <Wrapper ref={ref}>
        <Header noHover>{options[0].label}</Header>
      </Wrapper>
    )
  }

  return (
    <Wrapper ref={ref}>
      <Header onClick={toggle} isOpen={isOpen}>
        {header}
        {!disabled && <StyledChevron isOpen={isOpen} />}
      </Header>
      <List isOpen={isOpen}>
        {options.map((option, i) => (
          <ListItem
            key={i}
            onClick={() => {
              const selected = option.value.split(':')
              onSelect(selected)
              setSelectedOption(selected)
              toggle()
            }}
          >
            {option.label}
          </ListItem>
        ))}
      </List>
    </Wrapper>
  )
}
