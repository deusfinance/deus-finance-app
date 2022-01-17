import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import useWeb3React from './useWeb3'
import { useBlockNumber } from 'state/application/hooks'

export default function useCurrencyBalance(tokenAddress: string) {
  const { chainId, account, library } = useWeb3React()
  const [balance, setBalance] = useState(BigNumber.from('0'))
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (library && account) {
          const walletBalance = await library?.getBalance(tokenAddress ?? account)
          setBalance(walletBalance)
        } else {
          setBalance(BigNumber.from('0'))
        }
      } catch (err) {
        console.error(err)
        setBalance(BigNumber.from('0'))
      }
    }
    fetchBalance()
  }, [chainId, account, tokenAddress, library, blockNumber])

  return balance
}
