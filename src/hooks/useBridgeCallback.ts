import { useCallback, useMemo } from 'react'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import BigNumber from 'bignumber.js'
import find from 'lodash/find'
import { BridgeClient } from 'lib/muon'
// import toast from 'react-hot-toast'

// import { MuonClient } from 'constants/muon'
import { Bridge } from 'constants/addresses'
import { ChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { IBridgeToken, BRIDGE__TOKENS } from 'constants/inputs'

import { dynamicPrecision } from 'utils/numbers'
import { IToken } from 'utils/token'
import { calculateGasMargin, toWei } from 'utils/web3'
// import { BridgeErrorToUserReadableMessage } from 'utils/parseErrors'

import { useBridgeContract } from './useContract'
import useWeb3React from './useWeb3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { IClaimToken } from 'state/bridge/reducer'

export enum BridgeCallbackState {
  INVALID = 'INVALID',
  PENDING = 'PENDING',
  VALID = 'VALID',
}

export default function useDepositCallback(
  TokenIn: IToken | null,
  TokenOut: IToken | null,
  amountIn: string
): {
  state: BridgeCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useWeb3React()
  const Contract = useBridgeContract()
  const addTransaction = useTransactionAdder()
  const SelectedToken: IBridgeToken | undefined = find(BRIDGE__TOKENS, { symbol: TokenIn?.symbol })
  const tokenId: number | null = SelectedToken ? SelectedToken.tokenId : null
  const constructCall = useCallback(async () => {
    try {
      if (!chainId || !account || !TokenIn || !TokenOut || !Contract || tokenId == null) {
        throw new Error('Missing dependencies.')
      }

      const amountInBN = toWei(amountIn, TokenIn?.decimals ?? 18, true)
      const methodName = 'deposit'
      const args: any = [amountInBN, TokenOut.chainId, tokenId]
      const value = 0

      return {
        address: Contract.address,
        calldata: Contract.interface.encodeFunctionData(methodName, args) ?? '',
        value,
      }
    } catch (error) {
      return {
        error,
      }
    }
  }, [Contract, TokenIn, TokenOut, amountIn, tokenId, chainId, account])

  return useMemo(() => {
    // console.log({ Contract, TokenIn, TokenOut, amountIn, tokenId, chainId, account })
    if (!account || !chainId || !library || !TokenIn || !TokenOut || !Contract || tokenId == null) {
      return {
        state: BridgeCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }

    if (!amountIn || amountIn == '0') {
      return {
        state: BridgeCallbackState.INVALID,
        callback: null,
        error: 'No amount provided',
      }
    }

    return {
      state: BridgeCallbackState.VALID,
      error: null,
      callback: async function onDeposit(): Promise<string> {
        console.log('onDeposit callback')
        const call = await constructCall()
        console.log({ call })

        const { address, calldata, value } = call

        if ('error' in call) {
          throw new Error('Unexpected error. Could not construct calldata.')
        }

        const tx = !value
          ? { from: account, to: address, data: calldata }
          : { from: account, to: address, data: calldata, value }

        console.log(`DEPOSIT TRANSACTION ${TokenIn.chainId} > ${TokenOut.chainId}`, { tx, value })

        const estimatedGas = await library.estimateGas(tx).catch((gasError) => {
          console.debug('Gas estimate failed, trying eth_call to extract error', call)

          return library
            .call(tx)
            .then((result) => {
              console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
              return {
                error: new Error('Unexpected issue with estimating the gas. Please try again.'),
              }
            })
            .catch((callError) => {
              console.debug('Call threw an error', call, callError)
              return {
                error: new Error(callError), // TODO make this human readable
              }
            })
        })

        if ('error' in estimatedGas) {
          throw new Error('Unexpected error. Could not estimate gas for bridging.')
        }
        // console.log(account, address)

        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            ...(estimatedGas ? { gasLimit: calculateGasMargin(estimatedGas) } : {}),
            // gasPrice /// TODO add gasPrice based on EIP 1559
          })
          .then((response: TransactionResponse) => {
            console.log(response)
            const summary = `Bridge ${dynamicPrecision(amountIn, 0.99)} ${TokenIn.symbol} ${
              ChainInfo[TokenIn.chainId as SupportedChainId].label
            } > ${ChainInfo[TokenOut.chainId as SupportedChainId].label}`

            addTransaction(response, { summary })

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Deposit failed`, error, address, calldata, value)
              throw new Error(`Deposit failed: ${error.message}`) // TODO make this human readable
            }
          })
      },
    }
  }, [Contract, TokenIn, TokenOut, amountIn, tokenId, chainId, account, library, constructCall, addTransaction])
}

export function useClaimCallback(): {
  state: BridgeCallbackState
  callback: null | ((token: IClaimToken | null) => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useWeb3React()
  const Contract = useBridgeContract()
  const addTransaction = useTransactionAdder()
  //handle errors and other checks
  const getMuonSignatures = useCallback(async (token: IClaimToken | null) => {
    if (!token) {
      console.error('No token provided')
      return
    }
    return BridgeClient.getClaimData(Bridge[token.fromChainId], token.txId, token.fromChainId)
  }, [])

  const constructCall = useCallback(
    async (token: IClaimToken | null) => {
      try {
        if (!chainId || !account || !token || !Contract) {
          throw new Error('Missing dependencies.')
        }
        const response = await getMuonSignatures(token)
        if (!response) throw new Error('response is empty!')
        if (!response.success) {
          // toast.error(BridgeErrorToUserReadableMessage(response))
          throw new Error(response.error)
        }

        const { reqId, txId, toChainId, fromChainId, tokenId, amount, sigs } = response.data.calldata
        const amountBN = new BigNumber(amount).toFixed(0) //TODO : check if amount is in correct decimals base on tokenId
        const methodName = 'claim'
        const args: any = [account, amountBN, fromChainId, toChainId, tokenId, txId, reqId, sigs]
        const value = 0

        return {
          address: Contract.address,
          calldata: Contract.interface.encodeFunctionData(methodName, args) ?? '',
          value,
        }
      } catch (error) {
        return {
          error,
        }
      }
    },
    [Contract, getMuonSignatures, chainId, account]
  )

  /*   const constructCall = useCallback(
    async (token: IClaimToken | null) => {
      try {
        if (!chainId || !account || !token || !Contract) {
          throw new Error('Missing dependencies.')
        }
        const response = await getMuonSignatures(token)
        if (response?.success === false || response.error) {
          toast.error(BridgeErrorToUserReadableMessage(response.error))
          throw new Error(response)
        }
        const { sigs, reqId } = response
        const amountBN = new BigNumber(token.amount).toFixed(0) //TODO : check if amount is in correct decimals base on tokenId
        const methodName = 'claim'
        const args: any = [
          account,
          amountBN,
          token.fromChainId.toString(),
          token.toChainId.toString(),
          token.tokenId.toString(),
          token.txId.toString(),
          reqId,
          sigs,
        ]
        const value = 0

        return {
          address: Contract.address,
          calldata: Contract.interface.encodeFunctionData(methodName, args) ?? '',
          value,
        }
      } catch (error) {
        return {
          error,
        }
      }
    },
    [Contract, getMuonSignatures, chainId, account]
  ) */

  return useMemo(() => {
    if (!account || !chainId || !library || !Contract) {
      return {
        state: BridgeCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }

    return {
      state: BridgeCallbackState.VALID,
      error: null,
      callback: async function onClaim(token: IClaimToken | null): Promise<string> {
        console.log('onClaim callback')
        if (!token) {
          throw new Error('Missing token for claim.')
        }
        const call = await constructCall(token)
        const { address, calldata, value } = call
        console.log({ call })
        if ('error' in call) {
          throw new Error('Unexpected error. Could not construct calldata.')
        }

        const tx = !value
          ? { from: account, to: address, data: calldata }
          : { from: account, to: address, data: calldata, value }

        console.log(`CLAIM TRANSACTION ${token.symbol} > ${ChainInfo[token.toChainId as SupportedChainId].label}`, {
          tx,
          value,
        })

        const estimatedGas = await library.estimateGas(tx).catch((gasError) => {
          console.debug('Gas estimate failed, trying eth_call to extract error', call)

          return library
            .call(tx)
            .then((result) => {
              console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
              return {
                error: new Error('Unexpected issue with estimating the gas. Please try again.'),
              }
            })
            .catch((callError) => {
              console.debug('Call threw an error', call, callError)
              return {
                error: new Error(callError), // TODO make this human readable
              }
            })
        })

        if ('error' in estimatedGas) {
          throw new Error('Unexpected error. Could not estimate gas for bridging.')
        }
        // console.log(account, address)

        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            ...(estimatedGas ? { gasLimit: calculateGasMargin(estimatedGas) } : {}),
            // gasPrice /// TODO add gasPrice based on EIP 1559
          })
          .then((response: TransactionResponse) => {
            console.log(response)
            const summary = `Claim ${token.symbol} > ${ChainInfo[token.toChainId as SupportedChainId].label}`

            addTransaction(response, { summary })

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Claim failed`, error, address, calldata, value)
              throw new Error(`Claim failed: ${error.message}`) // TODO make this human readable
            }
          })
      },
    }
  }, [Contract, chainId, account, library, constructCall, addTransaction])
}
