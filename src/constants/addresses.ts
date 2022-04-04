import { constructSameAddressMap, AddressMap } from 'utils/address'
import { SupportedChainId } from './chains'
import { USDC } from './tokens'

export const Multicall2: AddressMap = {
  [SupportedChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [SupportedChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [SupportedChainId.POLYGON]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [SupportedChainId.FANTOM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
}

/* =====================================
                DEI POOL
===================================== */
export const DeiPool: AddressMap = {
  ...constructSameAddressMap('0xc63eAf6BC162531b153Dfc61F225E62d2edB4488', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
    SupportedChainId.FANTOM,
  ]),
}

/* =====================================
              COLLATERAL
===================================== */
export const CollateralPool: AddressMap = {
  ...constructSameAddressMap('0xa0F395aD5df1Fceb319e162CCf1Ef6645dE8508f', [
    SupportedChainId.MAINNET,
    SupportedChainId.POLYGON,
    SupportedChainId.FANTOM,
    SupportedChainId.BSC,
  ]),
}

export const Collateral: AddressMap = USDC

/* =====================================
              PROXIES
===================================== */
export const MintProxy: AddressMap = {
  [SupportedChainId.MAINNET]: '0xB095aA0A0A206ed943FAA7f5BD28A47Aaf2fEc09',
  [SupportedChainId.POLYGON]: '0x8E17742983CBa809bc554868D8a69A37e3a8a207',
  [SupportedChainId.FANTOM]: '0xCaD69f845c4159ACfe2b840E5429146E11D8eB40',
}

/* =====================================
              Old SSP (for minting DEI)
===================================== */
export const OldSSP: AddressMap = {
  [SupportedChainId.FANTOM]: '0xef0b04E1ade75e27A589773f68002A7bFc5c28bD',
}
/* =====================================
              SSPv4 (for minting DEI)
===================================== */
export const SSP: AddressMap = {
  [SupportedChainId.FANTOM]: '0xa943C2867aF32144D7106176Fc9cf6888C279112',
}

/* =====================================
              BRIDGES
===================================== */
export const Bridge: AddressMap = {
  [SupportedChainId.MAINNET]: '0x7aB4C5738e39E613186AFFD4c50DbfDFF6c22065',
  [SupportedChainId.FANTOM]: '0x7aB4C5738e39E613186AFFD4c50DbfDFF6c22065',
  [SupportedChainId.BSC]: '0x70A4c35eABFa973B27Cb3d489e154DB6d9A24ebD',
  [SupportedChainId.POLYGON]: '0x7aB4C5738e39E613186AFFD4c50DbfDFF6c22065',
  [SupportedChainId.METIS]: '0x7Be7EC9B8438Fbf91e3e00B02fd46cA53F9cC144',
  [SupportedChainId.ARBITRUM]: '0x9A5d6D10F59fEe47694A154B472De5aC113C6C08',
  // [ChainId.BSC_TESTNET]: '0x135Bd7be1c1e2162d4C8AEdD551bB1758C3AB110',
  // [ChainId.RINKEBY]: '0x64F1CECCBbD039f70E8CB600a94429671629e418',
}
