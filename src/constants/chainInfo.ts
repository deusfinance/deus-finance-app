import { SupportedChainId } from './chains'
import { StaticImageData } from 'next/image'

import MainnetLogo from 'assets/img/networks/mainnet.svg'
import RinkebyLogo from 'assets/img/networks/mainnet.svg'
import BinanceLogo from 'assets/img/networks/binance.svg'
import PolygonLogo from 'assets/img/networks/polygon.svg'
import FantomLogo from 'assets/img/networks/fantom.svg'
import MetisLogo from 'assets/img/networks/metis.svg'
import ArbitrumLogo from 'assets/img/networks/arbitrum.svg'

interface Info {
  chainId: string
  chainName: string
  label: string
  logoUrl: StaticImageData
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrl: string
  blockExplorerUrl: string
}

export const ChainInfo: { [chainId in SupportedChainId]: Info } = {
  [SupportedChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    label: 'Ethereum',
    logoUrl: MainnetLogo,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
  },
  [SupportedChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    label: 'Rinkeby',
    logoUrl: RinkebyLogo,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://rinkeby.infura.io/v3/',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
  },
  [SupportedChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    label: 'BSC',
    logoUrl: BinanceLogo,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorerUrl: 'https://bscscan.com',
  },
  [SupportedChainId.POLYGON]: {
    chainId: '0x89',
    chainName: 'Matic Mainnet',
    label: 'Polygon',
    logoUrl: PolygonLogo,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
  },
  [SupportedChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom Opera',
    label: 'Fantom',
    logoUrl: FantomLogo,
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.ftm.tools',
    blockExplorerUrl: 'https://ftmscan.com',
  },
  // [SupportedChainId.BSC_TESTNET]: {
  //   label: 'BTC Testnet',
  //   chainId: '0x61',
  //   chainName: 'Binance Smart Chain Testnet',
  //   logoUrl: BinanceLogo,
  //   nativeCurrency: {
  //     name: 'BNB',
  //     symbol: 'BNB',
  //     decimals: 18,
  //   },
  //   rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  //   blockExplorerUrl: 'https://testnet.bscscan.com',
  // },
  [SupportedChainId.ARBITRUM]: {
    label: 'Arbitrum',
    chainId: '0xA4B1',
    chainName: 'Arbitrum',
    logoUrl: ArbitrumLogo,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
  },
  [SupportedChainId.METIS]: {
    label: 'Metis',
    chainId: '0x61',
    chainName: 'Metis',
    logoUrl: MetisLogo,
    nativeCurrency: {
      name: 'Metis',
      symbol: 'Metis',
      decimals: 18,
    },
    rpcUrl: '"https://andromeda.metis.io/?owner=1088',
    blockExplorerUrl: 'https://andromeda-explorer.metis.io',
  },
}
