import { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import useWeb3React from 'hooks/useWeb3'
import useERC20Balance from 'hooks/useERC20Balances'
import useBalanceFormatter from 'hooks/useBalanceFormatter'

import { IToken } from 'utils/token'
import { toWei } from 'utils/web3'

import { SupportedChainId } from 'constants/chains'
import { ChainInfo } from 'constants/chainInfo'

import Dropdown from './BridgeDropDown'
import { HorPartition } from 'components/Partition'
import Input from 'components/Input'

const Wrapper = styled.div<{
  autoHeight: boolean
}>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  justify-content: flex-start;
  min-width: 230px;
  min-height: ${({ autoHeight }) => (autoHeight ? 'auto' : '100px')};
  background: ${({ theme }) => theme.bg1};
  border-radius: 15px;
  overflow: visible;

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

const BalanceLabel = styled.div`
  font-size: 0.75rem;
  text-align: right;
  margin: 5px;
  color: ${({ theme }) => theme.text3};
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
  background: ${({ theme }) => theme.bg0};
  border-radius: 10px;
  height: 50px;
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;
  border: 2px solid transparent;

  & > * {
    &:last-child {
      margin-left: auto;
    }
  }

  &:hover {
    border: 2px solid ${({ theme }) => theme.secondary2};
  }
`

const MaxButton = styled.div<{
  disabled?: boolean
}>`
  text-align: center;
  background: ${({ theme }) => theme.secondary2};
  font-size: 0.9rem;
  padding: 3px 6px;
  border-radius: 6px;
  transition: transform 0.4s ease;
  &:hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    background: ${({ theme }) => theme.secondary1};
    font-size: 0.9rem;
  }
`

function DropdownOption(chainId: SupportedChainId): JSX.Element {
  const chain = ChainInfo[chainId]
  return (
    <StyledDropdownOption>
      <div>
        <Image src={chain.logoUrl} alt={`${chain.chainName} Logo`} width={25} height={25} />
        {chain.label}
      </div>
    </StyledDropdownOption>
  )
}

const InputOption = ({
  token,
  amount,
  setAmount,
  setInsufficientBalance,
  disableBalance,
  disabled,
}: {
  token: IToken
  amount: string
  setAmount: (amount: string) => void
  setInsufficientBalance: (val: boolean) => void
  disableBalance?: boolean
  disabled?: boolean
}): JSX.Element => {
  const { address, symbol, decimals, isToken, chainId } = token
  const balanceBN = useERC20Balance(address, isToken, chainId)
  const { balanceUser, balanceLabel } = useBalanceFormatter(balanceBN, decimals)

  useEffect(() => {
    if (!amount || amount == '') {
      setInsufficientBalance(false)
    } else {
      setInsufficientBalance(balanceBN.lt(toWei(amount, decimals, true)))
    }
  }, [balanceBN, amount, decimals])

  return (
    <>
      <BalanceLabel onClick={() => !disabled && setAmount(balanceUser)}>
        {!disableBalance ? `${balanceLabel} ` : 'N/A '}
        {symbol}
      </BalanceLabel>
      <InputWrapper>
        <Input placeholder="0.00" value={amount} onChange={setAmount} disabled={disabled} />
        <MaxButton onClick={() => !disabled && setAmount(balanceUser)} disabled={disabled}>
          MAX
        </MaxButton>
      </InputWrapper>
    </>
  )
}

export default function TokenSelect({
  options = [],
  token,
  setSelected = () => null,
  amount = '',
  setAmount = () => null,
  setInsufficientBalance = () => null,
  disableBalance = false,
  disabled = false,
}: {
  options: SupportedChainId[]
  token: IToken | null
  setSelected?: (chainId: SupportedChainId) => void
  amount: string
  setAmount: (amount: string) => void
  setInsufficientBalance?: (val: boolean) => void
  disableBalance?: boolean
  disabled: boolean
}) {
  const { chainId, account } = useWeb3React()

  // Map option values as addresses for the dropdown
  const dropdownOptions = useMemo(() => {
    return options.map((chainId: SupportedChainId) => {
      return {
        value: chainId.toString(),
        label: DropdownOption(chainId),
      }
    })
  }, [options])

  const onSelect = (chainIds: string[]) => {
    setSelected(Number(chainIds[0]))
  }

  useEffect(() => {
    setAmount('')
  }, [chainId, account])

  return (
    <Wrapper autoHeight={dropdownOptions.length == 1}>
      <div>
        <Dropdown
          options={dropdownOptions}
          placeholder={'Select Chain'}
          onSelect={onSelect}
          disabled={disabled}
          token={token}
        />
        <HorPartition />
      </div>
      <div>
        {token ? (
          <InputOption
            token={token}
            amount={amount}
            setAmount={setAmount}
            setInsufficientBalance={setInsufficientBalance}
            disableBalance={disableBalance}
            disabled={disabled}
          />
        ) : null}
      </div>
    </Wrapper>
  )
}
