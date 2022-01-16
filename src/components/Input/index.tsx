import React, { useMemo } from 'react'
import styled from 'styled-components'

const InputWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 3px;
  white-space: nowrap;
  overflow: hidden;
  background: rgb(28,28,28);
  border-radius: 5px;
  padding: 5px;
  align-items: center;
  font-size: 0.8rem;
  color: gray;
  height: 100%;
`

export const InputField = styled.input<{
  disabled?: boolean
}>`
  display: inline-flex;
  justify-content: flex-end;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 1rem;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  text-overflow: ellipsis;
  margin-right: 5px;
  &:focus {
    outline: none;
  }
  &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 255, 255, 0.4);
    opacity: 1; /* Firefox */
  }
  &:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, 0.4);
  }
  &::-ms-input-placeholder { /* Microsoft Edge */
    color: rgba(255, 255, 255, 0.4);
  }

  ${props => props.disabled && `
    cursor: not-allowed;
  `}
`

export default function Input({
  placeholder,
  value,
  onChange,
  onBlur,
  showError,
  showWarning,
  disabled,
  ...rest
} : {
  placeholder: string
  value: string
  onChange: (val: string) => void
  onBlur?: () => void
  disabled?: boolean
  showError?: boolean
  showWarning?: boolean
  [x: string]: any
}) {
  const onChangeProxy = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters but allow points
    let output = evt.target.value.replace(/[^\d.]/g, '')
    // Remove additional commas (for decimals), to prevent stuff like: 19.800.9 => 19.800
    output = output.replace( /^([^.]*\.)(.*)$/, ( a, b, c ) => {
      return b + c.replace( /\./g, '' )
    })
    onChange(output)
  }
  const nonZeroValue = useMemo(() => {
    return !value ? '' : value
  }, [value])

  return (
    <InputWrapper>
      <InputField
        onChange={onChangeProxy}
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        value={nonZeroValue}
        placeholder={placeholder}
        minLength={1}
        maxLength={99}
        spellCheck="false"
        disabled={disabled}
        {...rest}
      />
    </InputWrapper>
  )
}
