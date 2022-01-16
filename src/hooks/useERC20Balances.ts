import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import useWeb3React from './useWeb3'
import { useERC20Contract } from './useContract'
import { useBlockNumber } from 'state/application/hooks'

export default function useERC20Balance (tokenAddress: string, isToken: boolean): BigNumber {
  const { chainId, account, library } = useWeb3React()
  const [ balance, setBalance ] = useState(BigNumber.from('0'))
  const Contract = useERC20Contract(tokenAddress)
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        let walletBalance = null
        if (isToken) {
          walletBalance = await Contract?.balanceOf(account)
        } else {
          walletBalance = await library.getBalance(account) // same functionality as `useCurrencyBalance`
        }
        setBalance(walletBalance)
      } catch (err) {
        console.error(err)
        setBalance(BigNumber.from('0'))
      }
    }

    if (account && library && tokenAddress) {
      fetchBalance()
    } else {
      setBalance(BigNumber.from('0'))
    }
  }, [chainId, account, library, tokenAddress, isToken, blockNumber])

  return balance
}
