import Muon from 'muon'

import { SupportedChainId } from './chains'
import { MUON_NODE_GATEWAY } from './keys'

export const ORACLE_BASE_URL = new URL('https://oracle4.deus.finance')
export const MuonClient = new Muon(MUON_NODE_GATEWAY)

// https://github.com/muon-protocol/muon-node-js/blob/7fb51305f7a4315bf3a4e3d2e258ba37bb4111e3/utils/node-utils/eth.js
export const MUON_NETWORK_NAMES_BY_CHAIN_ID = {
  [SupportedChainId.MAINNET]: 'eth',
  [SupportedChainId.POLYGON]: 'polygon',
}
