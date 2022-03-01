import { useMemo } from 'react'
import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'

import useWeb3React from './useWeb3'

import ERC20_ABI from 'constants/abi/ERC20.json'
import DEI_ABI from 'constants/abi/DEI.json'
import COLLATERAL_POOL_ABI from 'constants/abi/COLLATERAL_POOL.json'
import PROXY_MINTER_ABI from 'constants/abi/PROXY_MINTER.json'
import BRIDGE_ABI from 'constants/abi/BRIDGE.json'
import MULTICALL2_ABI from 'constants/abi/MULTICALL2.json'

import { Tokens } from 'constants/tokens'
import { Providers } from 'constants/providers'
import { Multicall2, CollateralPool, MintProxy, Bridge } from 'constants/addresses'
import { SupportedChainId } from 'constants/chains'

export function useContract(
  address: string | null | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account, chainId } = useWeb3React()
  return useMemo(() => {
    try {
      if (!library || !chainId || !account || !address || !ABI) return null
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (err) {
      console.error('Failed to get contract: ', err)
      return null
    }
  }, [library, account, chainId, address, ABI, withSignerIfPossible])
}

export function useERC20Contract(tokenAddress: string | null | undefined, withSignerIfPossible?: boolean) {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useProxyMinterContract() {
  const { chainId } = useWeb3React()
  const address = useMemo(() => MintProxy[chainId ?? 1], [chainId])
  return useContract(address, PROXY_MINTER_ABI)
}

export function useBridgeContract() {
  const { chainId } = useWeb3React()
  const address = useMemo(() => Bridge[chainId ?? 1], [chainId])
  return useContract(address, BRIDGE_ABI)
}

export function useCollateralPoolContract() {
  const { chainId } = useWeb3React()
  const address = useMemo(() => CollateralPool[chainId ?? 1], [chainId])
  return useContract(address, COLLATERAL_POOL_ABI)
}

export function useDeiContract(targetChainId?: number) {
  const { chainId } = useWeb3React()
  const address = useMemo(() => {
    return targetChainId ? Tokens['DEI'][targetChainId]['address'] : Tokens['DEI'][chainId ?? 1]['address']
  }, [chainId, targetChainId])
  return useContract(address, DEI_ABI)
}

export function useMulticall2Contract() {
  const { chainId } = useWeb3React()
  const address = useMemo(() => Multicall2[chainId ?? 1], [chainId])
  return useContract(address, MULTICALL2_ABI)
}

export function getProviderOrSigner(library: any, account: string): any {
  return account ? getSigner(library, account) : library
}

export function getSigner(library: any, account: string): any {
  return library.getSigner(account).connectUnchecked()
}

function getContract(
  address: string,
  ABI: any,
  library: any,
  account: string | undefined,
  targetChainId?: SupportedChainId
): Contract | null {
  if (!isAddress(address) || address === AddressZero) {
    if (address != '0x') {
      console.info(`Invalid 'address' parameter '${address}'.`)
    }
    return null
  }
  if (!account) return null
  let providerOrSigner
  if (targetChainId) {
    providerOrSigner = getProviderOrSigner(Providers[targetChainId], account)
  } else {
    providerOrSigner = getProviderOrSigner(library, account)
  }

  return new Contract(address, ABI, providerOrSigner)
}
