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
    const fetchBalance = async () => {
      try {
        if (account && library && tokenAddress) {
          if (isToken) {
            const walletBalance = await Contract?.balanceOf(account)
            setBalance(walletBalance)
          } else {
            const walletBalance = await library.getBalance(account) // same functionality as `useCurrencyBalance`
            setBalance(walletBalance)
          }
        } else {
          setBalance(BigNumber.from('0'))
        }
      } catch (err) {
        console.error(err)
        setBalance(BigNumber.from('0'))
      }
    }
    if (tokenChainId && tokenChainId != chainId) {
      setBalance(BigNumber.from('0'))
    } else {
      fetchBalance()
    }
  }, [chainId, account, library, Contract, tokenAddress, tokenChainId, isToken, blockNumber])

  return balance
}
