import { useCallback, useMemo } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { MaxUint256 } from '@ethersproject/constants'

import useWeb3React from './useWeb3'
import { useERC20Contract } from './useContract'
import useERC20Allowance from './useERC20Allowance'

import { useTransactionAdder, useHasPendingApproval } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils/web3'
import { IToken } from 'utils/token'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export default function useApproveCallback(
  token: IToken | null | undefined,
  spender: string | null | undefined
): [ApprovalState, () => Promise<void>] {
  const { chainId, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const [tokenAddress, tokenSymbol, tokenIsNative] = useMemo(() => {
    return [token?.address ?? '', token?.symbol ?? '', token?.isNative]
  }, [token])

  const currentAllowance = useERC20Allowance(token, spender)
  const pendingApproval = useHasPendingApproval(tokenAddress, spender)
  const TokenContract = useERC20Contract(tokenAddress)

  const approvalState = useMemo(() => {
    if (!tokenAddress) return ApprovalState.UNKNOWN
    if (!spender) return ApprovalState.UNKNOWN
    if (tokenIsNative) return ApprovalState.APPROVED

    return currentAllowance.gt(0)
      ? ApprovalState.APPROVED
      : pendingApproval
      ? ApprovalState.PENDING
      : ApprovalState.NOT_APPROVED
  }, [tokenAddress, tokenIsNative, spender, currentAllowance, pendingApproval])

  const approve = useCallback(async () => {
    if (approvalState === ApprovalState.APPROVED || approvalState === ApprovalState.PENDING) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!TokenContract) {
      console.error('TokenContract is null')
      return
    }

    if (!account) {
      console.error('account is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const estimatedGas = await TokenContract.estimateGas.approve(spender, MaxUint256)
    return TokenContract.approve(spender, MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGas),
    })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + tokenSymbol,
          approval: { tokenAddress, spender },
        })
      })
      .catch((error: Error) => {
        console.error('Failed to approve token for an unknown reason', error)
      })
  }, [approvalState, TokenContract, spender, tokenAddress, tokenSymbol, addTransaction, chainId, account])

  return [approvalState, approve]
}
