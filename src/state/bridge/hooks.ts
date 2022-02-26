import { useMemo } from 'react'
import { useAppSelector, AppState } from 'state'
import { IClaimToken } from './reducer'
import { TokenID } from 'constants/inputs'
import { Tokens } from 'constants/tokens'
import { BridgeMinimumBlockNeed, SupportedChainId } from 'constants/chains'

export const useBridgeState = () => {
  return useAppSelector((state: AppState) => state.bridge)
}

export const useClaimableTokens = () => {
  const { unClaimed } = useBridgeState()
  return useMemo(() => {
    const items = Array<IClaimToken>()
    for (let i = 0; i < unClaimed.length; i++) {
      const item = unClaimed[i]
      const token = Tokens[TokenID[item.tokenId]][item.fromChain]
      if (!token) {
        console.log('token is undefined', { token, item })
        continue
      }
      items.push({
        symbol: TokenID[item.tokenId],
        amount: item.amount,
        isClaimed: item.isClaimed,
        txId: item.txId,
        tokenId: item.tokenId,
        decimals: token.decimals,
        toChainId: Number(item.toChain),
        fromChainId: Number(item.fromChain),
        depositedBlock: item.blockNumber,
        claimableBlock: item.blockNumber + BridgeMinimumBlockNeed[item.toChain as SupportedChainId],
        logo: token.logo,
      } as IClaimToken)
    }
    return items
  }, [unClaimed])
}

export const useCurrentBlocks = () => {
  const { currentBlocks } = useBridgeState()
  return useMemo(() => currentBlocks as { [chainId: string]: number }, [currentBlocks])
}
