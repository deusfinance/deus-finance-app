import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import useWeb3React from './useWeb3'
import { useERC20Contract } from './useContract'
import { useBlockNumber } from 'state/application/hooks'
import { SupportedChainId } from 'constants/chains'

export default function useERC20Balance(
  tokenAddress: string,
  isToken: boolean,
  tokenChainId?: SupportedChainId
): BigNumber {
  const { chainId, account, library } = useWeb3React()
  const [balance, setBalance] = useState(BigNumber.from('0'))
  const Contract = useERC20Contract(tokenAddress)
  const blockNumber = useBlockNumber()

  useEffect(() => {
    let mounted = true
    const setBalanceSafe = (walletBalance: BigNumber) => {
      if (mounted) {
        setBalance(walletBalance)
      }
    }
    const fetchBalance = async () => {
      try {
        if (account && library && tokenAddress) {
          if (isToken) {
            const walletBalance = await Contract?.balanceOf(account)
            setBalanceSafe(walletBalance)
          } else {
            const walletBalance = await library.getBalance(account) // same functionality as `useCurrencyBalance`
            setBalanceSafe(walletBalance)
          }
        } else {
          setBalanceSafe(BigNumber.from('0'))
        }
      } catch (err) {
        console.error(err)
        setBalanceSafe(BigNumber.from('0'))
      }
    }
    if (tokenChainId && tokenChainId != chainId && mounted) {
      setBalanceSafe(BigNumber.from('0'))
    } else {
      fetchBalance()
    }
    return () => {
      mounted = false
    }
  }, [chainId, account, library, Contract, tokenAddress, tokenChainId, isToken, blockNumber])

  return balance
}
