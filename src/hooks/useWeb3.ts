import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { isMobile } from 'react-device-detect'

import { injected } from '../connectors'

/**
  This function fakes a context with chainId = 1 if not connected. We can use it so we don't have to check !chainId on each useWeb3() instance + in regards to type-checking chainId is always defined as SupportedChain instead of | undefined.

  TODO: migrate dependencies to !account instead of !chainId so we can use this function.

  import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
  import { NETWORK_CONTEXT_NAME } from 'constants/misc'
  import { SupportedChainId } from 'constants/chains'

  export default function useWeb3React(): Web3ReactContextInterface<Web3Provider> & {
    chainId: SupportedChainId
  } {
    const context = useWeb3ReactCore<Web3Provider>()
    const contextNetwork = useWeb3ReactCore<Web3Provider>(NETWORK_CONTEXT_NAME)
    return context.active ? context : contextNetwork
  }

 */

// Strictly allows connected wallets
export default function useWeb3React() {
  return useWeb3ReactCore<Web3Provider>()
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore()

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && ethereum.removeAllListeners && !active && !error && !suppress) {
      const handleChainChanged = () => {
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      // hot fix for being unable to switch to Avalanche
      ethereum.removeAllListeners(['networkChanged'])

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
