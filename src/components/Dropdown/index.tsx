import React, { useState, useRef, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import find from 'lodash/find'

import useOnOutsideClick from 'hooks/useOnOutsideClick'
import { ChevronDown } from 'components/Icons'

const Wrapper = styled.div`
  display: block;
  overflow: visible;
  color: ${({ theme }) => theme.text3};
`

const Header = styled.div<{
  noHover?: boolean
  isOpen?: boolean
}>`
  display: flex;
  justify-content: space-between;
  background: transparent;
  border: 1px solid transparent; /* this prevents border jumping */
  font-size: 1rem;
  border-radius: 15px;
  text-align: left;
  padding: 0 0.8rem;
  align-items: center;
  height: 50px;

  &:hover {
    cursor: ${({ noHover }) => (noHover ? 'default' : 'pointer')};
  }

  ${({ theme, isOpen }) =>
    isOpen &&
    `
    background: ${theme.bg1};
    border: 1px solid ${theme.border2};
    border-radius: 15px 15px 0px 0px;
  `}
`

const StyledChevron = styled(({ isOpen, ...props }) => <ChevronDown {...props} />)<{
  isOpen?: boolean
}>`
  transition: transform 0.5s ease-out;
  size: 2rem;
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
  background: ${({ theme }) => theme.bg0};
  border-radius: 0px 0px 10px 10px;
  border: 1px solid ${({ theme }) => theme.border2};
  border-top: none;
  overflow: hidden;
  position: absolute;
  width: 100%;
  z-index: 999;

  & > * {
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.border2};
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
  z-index: 999;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.bg1};
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
