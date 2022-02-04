import { RetryOptions } from 'utils/retry'
import { SupportedChainId } from './chains'

export const NETWORK_CONTEXT_NAME = 'NETWORK'

// Only applies to L2
export const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {}
export const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 1000, maxWait: 3000 }

// Only applies to L2
export const NETWORK_POLLING_INTERVALS: { [chainId: number]: number } = {
  [SupportedChainId.FANTOM]: 1_500,
  [SupportedChainId.POLYGON]: 2_500,
}
