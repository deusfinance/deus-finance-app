import { getAddress } from '@ethersproject/address'

export function isAddress(value: string) {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function truncateAddress(address: string, chars = 4) {
  const parsed = isAddress(address)
  if (!parsed) {
    console.error(`Invalid 'address' parameter '${address}'.`)
    return null
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
