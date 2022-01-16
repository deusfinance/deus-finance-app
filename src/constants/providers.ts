import { JsonRpcProvider } from '@ethersproject/providers'

import { NETWORK_URLS } from './chains'

interface Provider {
  [chainId: number]: JsonRpcProvider
}

// Interact with multiple chains at the same time (read-only)
// Used by hooks like `useContract`
export const Providers: Provider = Object.entries(NETWORK_URLS).reduce((acc: Provider, [chainId, rpc]) => {
  acc[chainId] = new JsonRpcProvider(rpc)
  return acc
}, {})
