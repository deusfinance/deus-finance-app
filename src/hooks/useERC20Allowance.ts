import { useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import useWeb3React from './useWeb3'
import { useERC20Contract } from './useContract'
import { IToken } from 'utils/token'
import { useSingleCallResult } from 'state/multicall/hooks'

export default function useERC20Allowance(
  token: IToken,
  spender: string
): BigNumber {
  const { account } = useWeb3React()
  const contract = useERC20Contract(token?.address, true)

  const inputs = useMemo(() => [account, spender], [account, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(() => {
    return token && allowance
      ? allowance[0]
      : BigNumber.from('0')
  }, [token, allowance])
}
