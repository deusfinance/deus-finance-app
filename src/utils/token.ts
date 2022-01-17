import { isAddress } from './account'

export interface IToken {
  chainId: number
  address: string
  decimals: number
  symbol: string
  name: string
  logo: StaticImageData
  isNative: boolean
  isToken: boolean
}

export class Token implements IToken {
  chainId: number
  address: string
  decimals: number
  symbol: string
  name: string
  logo: StaticImageData
  isNative: boolean
  isToken: boolean

  constructor(chainId: number, address: string, decimals: number, symbol: string, name: string, logo: StaticImageData) {
    this.chainId = chainId
    this.address = address
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
    this.isNative = this.getIsNative()
    this.isToken = this.getIsToken()
  }

  private getIsNative(): boolean {
    return this.address === '0x'
  }

  private getIsToken(): boolean {
    return isAddress(this.address) ? true : false
  }
}
