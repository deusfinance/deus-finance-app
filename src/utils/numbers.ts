import BigNumber from 'bignumber.js'
import numbro from 'numbro'

export const formatDollarAmount = (num: number | undefined, digits = 2, round = true) => {
  if (num === 0) return '$0.00'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<$0.001'
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  })
}

export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) return '0'
  if (!num) return '-'
  if (num < 0.001) {
    return '<0.001'
  }
  return numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  })
}

export function toBN(num: string): BigNumber {
  return new BigNumber(num)
}

export const BN_ZERO: BigNumber = toBN('0')
export const BN_ONE: BigNumber = toBN('1')

export function removeTrailingZeros(str: string): string {
  return str.replace(/\.?0+$/, '')
}

/**
 * Returns an amount rounded down to the least significant number by percentile.
 * Rounds down, so results are not EXACT but sufficient for displaying.
 */
export function dynamicPrecision(
  val: string,
  threshold = 0.99999999 // 99.999999%
): string {
  const value = parseFloat(val)
  if (isNaN(value)) return '0'

  if (value > 1e6) {
    return value.toFixed(3)
  } else if (value > 1e5) {
    return value.toFixed(4)
  } else if (value > 1e4) {
    return value.toFixed(5)
  } else if (value > 1000) {
    return value.toFixed(6)
  }

  let shift = 1
  let part = 0

  do {
    shift *= 10
    part = Math.floor(value * shift) / shift
  } while (part / value < threshold)

  return part.toString()
}

export const fromWei = (amount: any, decimals = 18): number | null => {
  if (amount === 0) return 0
  if (!amount) return null
  const displayBalance = new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const formatBalance = (balance: any, fixed = 5) => {
  if (!balance) return '0'
  BigNumber.config({ EXPONENTIAL_AT: 30 })
  const BalanceBN = toBN(balance)
  if (BalanceBN.isZero()) return 0

  if (
    toBN('10')
      .pow(fixed - 1)
      .lte(BalanceBN)
  )
    return BalanceBN.toFixed(0, BigNumber.ROUND_DOWN)
  return BalanceBN.toPrecision(fixed, BigNumber.ROUND_DOWN).replace(/\.?0+$/, '')
}
