import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from 'state'

import useWeb3React from 'hooks/useWeb3'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useDebounce from 'hooks/useDebounce'
import { SUPPORTED_CHAIN_IDS } from 'constants/chains'

import { updateBlockNumber, updateChainId } from './actions'

export default function Updater(): null {
  const { library, chainId } = useWeb3React()
  const dispatch = useAppDispatch()

  const windowVisible = useIsWindowVisible()
  const [state, setState] = useState({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback((blockNumber) => {
    setState((state) => {
      if (chainId === state.chainId) {
        if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
        return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
      }
      return state
    })
  }, [chainId, setState])

  // Attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error: any) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  useEffect(() => {
    dispatch(
      updateChainId({ chainId: debouncedState.chainId
        ? SUPPORTED_CHAIN_IDS.includes(debouncedState.chainId)
          ? debouncedState.chainId
          : null
        : null
      })
    )
  }, [dispatch, debouncedState.chainId])

  return null
}
