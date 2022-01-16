import { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { find } from 'lodash'

import useWeb3React from 'hooks/useWeb3'
import useERC20Balance from 'hooks/useERC20Balances'
import useBalanceFormatter from 'hooks/useBalanceFormatter'

import { IToken } from 'utils/token'
import { toWei } from 'utils/web3'

import Dropdown from 'components/Dropdown'
import { HorPartition } from 'components/Partition'
import { Balance } from 'components/Label'
import Input from 'components/Input'

const Wrapper = styled.div<{
  autoHeight: boolean
}>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  justify-content: flex-start;
  width: 100%;
  min-height: ${props => props.autoHeight ? 'auto' : '100px'};
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 5px;
  overflow: visible;

  & > * {
    &:first-child {
      margin-bottom: auto;
    }
  }
`

const Option = styled.div`
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

const BalanceLabel = styled(Balance)`
  text-align: right;
  margin-right: 5px;
  &:hover {
    cursor: pointer;
  }
`

const InputWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background: rgb(28, 28, 28);
  border-radius: 10px;
  height: 50px;
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;

  & > * {
    &:last-child {
      margin-left: auto
    }
  }
`

const MaxButton = styled.div<{
  disabled?: boolean
}>`
  width: 40px;
  text-align: center;
  background: rgb(39, 39, 39);
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  border-radius: 6px;
  transition: transform 0.4s ease;
  &:hover {
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-size: 13px;
  }
`

function DropdownOption(tokens: IToken[]): JSX.Element {
  return (
    <Option>
      {tokens.map((token, index) => (
        <div key={index}>
          {index > 0 && <div>+</div>}
          <Image
            src={token.logo}
            alt={`${token.name} Logo`}
            width={20}
            height={20}
          />
          {token.symbol}
        </div>
      ))}
    </Option>
  )
}

const InputOption = ({ 
  token, 
  amount, 
  setAmount,
  setInsufficientBalance,
  disabled, 
} : {
  token: IToken,
  amount: string,
  setAmount: (amount: string) => void,
  setInsufficientBalance: (val: boolean) => void,
  disabled?: boolean
}): JSX.Element => {
  const { address, symbol, decimals, isToken } = token
  const balanceBN = useERC20Balance(address, isToken)
  const { balanceUser, balanceLabel } = useBalanceFormatter(balanceBN, decimals)

  useEffect(() => {
    if (!amount || amount == '') {
      setInsufficientBalance(false)
    } else {
      setInsufficientBalance(balanceBN.lt(toWei(amount, decimals, true)))
    }
  }, [balanceUser, amount, decimals])

  return (
    <>
      <BalanceLabel
        onClick={() => !disabled && setAmount(balanceUser)}
      >{balanceLabel} {symbol}</BalanceLabel>
      <InputWrapper>
        <Input
          placeholder='0.00'
          value={amount}
          onChange={setAmount}
          disabled={disabled}
        />
        <MaxButton
          onClick={() => !disabled && setAmount(balanceUser)}
          disabled={disabled}
        >MAX</MaxButton>
      </InputWrapper>
    </>
  )
}

export default function InputBox ({
  options = [],
  selected = [],
  setSelected = () => {},
  amount1 = '',
  amount2 = '',
  setAmount1 = () => {},
  setAmount2 = () => {},
  setInsufficientBalance = () => {},
  disabled = false,
} : {
  options: Array<IToken[]>,
  selected: string[]
  setSelected?: (addresses: string[]) => void
  amount1: string
  amount2?: string
  setAmount1: (amount: string) => void
  setAmount2?: (amount: string) => void
  setInsufficientBalance?: (val: boolean) => void
  disabled: boolean
}) {
  const { chainId, account } = useWeb3React()

  // Map option values as addresses for the dropdown
  const dropdownOptions = useMemo(() => {
    return options.map((tokens: IToken[]) => {
      return {
        value: tokens.map(token => token.address).join(':'),
        label: DropdownOption(tokens),
      }
    })
  }, [options])

  // Pick initial options
  useEffect(() => {
    const value = dropdownOptions.length > 0 ? dropdownOptions[0]['value'] : null
    if (value) {
      setSelected(value.split(':'))
    } else {
      setSelected([])
    }
  }, [dropdownOptions])

  // Map all nested tokens into a single map for later reference
  const tokens = useMemo(() => {
    const all = options.reduce((acc: IToken[], options) => {
      acc.push(...options)
      return acc
    }, [])

    // Remove duplicates
    return all.filter((obj, index, self) => {
      return index === self.findIndex((t) => (
        t.address == obj.address
      ))
    })
  }, [options])

  const inputFields = useMemo(() => {
    return selected.reduce((acc: IToken[], address: string) => {
      const Token = find(tokens, { address })
      if (Token) {
        acc.push(Token)
      }
      return acc
    }, [])
  }, [selected, tokens])

  const onSelect = (addresses: string[]) => {
    setSelected(addresses)
  }

  useEffect(() => {
    setAmount1('')
    setAmount2('')
  }, [chainId, account])

  return (
    <Wrapper autoHeight={dropdownOptions.length == 1}>
      <div>
        <Dropdown
          options={dropdownOptions}
          placeholder={'Select token'}
          onSelect={onSelect}
          disabled={disabled}
        />
        <HorPartition/>
      </div>
      {inputFields.map((token: IToken, index) => {
        const amount = index == 0 ? amount1 : amount2
        const setAmount = index == 0 ? setAmount1 : setAmount2
        return selected.includes(token.address)
          ? (
            <InputOption
              token={token}
              amount={amount}
              setAmount={setAmount}
              setInsufficientBalance={setInsufficientBalance}
              disabled={disabled}
              key={index}
            />
          ) : null
      })}
    </Wrapper>
  )
}
