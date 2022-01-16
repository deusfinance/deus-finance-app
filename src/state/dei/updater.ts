import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import BN from 'bignumber.js'

import useWeb3React from 'hooks/useWeb3'
import { useSingleCallResult, useSingleContractMultipleMethods } from 'state/multicall/hooks'
import { useCollateralPoolContract, useDeiContract } from 'hooks/useContract'

import { useCollateralPrice } from './hooks'
import { DeiSupportedChains, DeiStatus, Scales, NUMBER_OF_POOLS, fetchPrices } from './reducer'
import { 
  updateStatus,
  updateCollateralRatio, 
  updatePoolBalance,
  updatePoolCeiling, 
  updateMintingFee, 
  updateRedemptionFee,
} from './reducer'

export default function Updater(): null {
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const DeiContract = useDeiContract()
  const CollateralPoolContract = useCollateralPoolContract()
  const collateralPrice = useCollateralPrice()

  const isSupported: boolean = useMemo(() => {
    return DeiSupportedChains.includes(chainId)
  }, [chainId])

  // Returns a range of undefined if !isSupported (indirectly)
  const [collateralRatioScale, feeScale, poolCeilingScale, poolBalanceScale]: Array<number | undefined> = useMemo(() => {
    return [
      Scales[chainId]?.collateralRatio,
      Scales[chainId]?.fee,
      Scales[chainId]?.poolCeiling,
      Scales[chainId]?.poolBalance,
    ]
  }, [chainId])

  const priceMapping: number[] | null = useMemo(() => {
    if (!collateralPrice) return null
    if (!isSupported) return null
    const LEN = NUMBER_OF_POOLS[chainId]
    
    if (!LEN) {
      console.error('Number of pools is not defined for chainId: ', chainId)
      dispatch(updateStatus(DeiStatus.ERROR))
      return null
    }

    let result = []
    for (let i = 0; i < LEN; i++) {
      result.push(collateralPrice * collateralRatioScale)
    }
    return result
  }, [isSupported, collateralPrice, collateralRatioScale])

  const infoCalls = useMemo(() => !isSupported ? [] : [
    { methodName: 'dei_info', callInputs: [priceMapping] },
  ], [priceMapping])

  const poolCalls = useMemo(() => !isSupported ? [] : [
    { methodName: 'minting_fee', callInputs: [] },
    { methodName: 'redemption_fee', callInputs: [] },
    { methodName: 'pool_ceiling', callInputs: [] },
    { methodName: 'collatDollarBalance', callInputs: [collateralPrice] },
  ], [collateralPrice])

  // using singleContractMultipleMethods just so we can default if !isSupported
  // const infoResponse = useSingleCallResult(DeiContract, 'dei_info', [priceMapping])
  const infoResponse = useSingleContractMultipleMethods(DeiContract, infoCalls)
  const poolResponse = useSingleContractMultipleMethods(CollateralPoolContract, poolCalls)

  useEffect(() => {
    const [mintingFee, redemptionFee, poolCeiling, poolBalance] = poolResponse

    if (infoResponse[0]?.result) {
      const globalCollateralRatio = infoResponse[0].result[1]
      dispatch(updateCollateralRatio(new BN(globalCollateralRatio.toString()).div(collateralRatioScale).toNumber()))
    }
    if (mintingFee?.result) {
      const result = new BN(mintingFee.result[0].toString()).div(feeScale).toNumber()
      dispatch(updateMintingFee(result))
    }
    if (redemptionFee?.result) {
      const result = new BN(redemptionFee.result[0].toString()).div(feeScale).toNumber()
      dispatch(updateRedemptionFee(result))
    }
    if (poolCeiling?.result) {
      const result = new BN(poolCeiling.result[0].toString()).div(poolCeilingScale).toNumber()
      dispatch(updatePoolCeiling(result))
    }
    if (poolBalance?.result) {
      const result = new BN(poolBalance.result[0].toString()).div(poolBalanceScale).toNumber()
      dispatch(updatePoolBalance(result))
    }
  }, [isSupported, infoResponse, collateralRatioScale, poolResponse, feeScale, poolCeilingScale, poolBalanceScale])

  useEffect(() => {
    if (chainId && isSupported) {
      dispatch(fetchPrices({ chainId })) // TODO do we need to poll every block?
    }
  }, [dispatch, chainId, isSupported])

  return null
}
