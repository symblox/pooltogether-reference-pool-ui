import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPE } from 'lib/constants'
import { erc20AwardsAtom } from 'lib/hooks/useExternalErc20Awards'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { prizePoolTypeAtom } from 'lib/hooks/useDetermineContractVersions'
// import { estimatedSyxPoolPrize } from 'lib/utils/estimatedSyxPoolPrize'

import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

/**
 * Returns a list of all erc20 awards INCLUDING the yield prize
 */
export const useAwardsList = () => {
  const [prizeEstimate, setPrizeEstimate] = useState(0)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  // const [erc20Awards] = useAtom(erc20AwardsAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)

  const {
    awardBalance,
    prizePeriodRemainingSeconds,
    poolTotalSupply,
    supplyRatePerBlock,
  } = poolChainValues
  const tokenDecimals = poolChainValues.tokenDecimals || DEFAULT_TOKEN_PRECISION
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'

  // useEffect(() => {
  //   const estimatedPoolPrize = estimatedSyxPoolPrize({
  //     tokenDecimals,
  //     awardBalance,
  //     poolTotalSupply,
  //     supplyRatePerBlock,
  //     prizePeriodRemainingSeconds,
  //   })

  //   console.log({ estimatedPoolPrize })

  //   setPrizeEstimate(estimatedPoolPrize)
  // }, [
  //   poolTotalSupply,
  //   supplyRatePerBlock,
  //   prizePeriodRemainingSeconds,
  //   awardBalance,
  // ])

  // if (erc20Awards.loading) {
  //   return {
  //     loading: true,
  //     awards: [],
  //   }
  // }

  // let awards = [...erc20Awards.awards]
  let awards = []

  // if (prizePoolType === PRIZE_POOL_TYPE.compound) {
  //   const compoundAwardToken = {
  //     symbol: tokenSymbol,
  //     formattedBalance: displayAmountInEther(prizeEstimate, {
  //       precision: 2,
  //       decimals: tokenDecimals,
  //     }),
  //     name: poolChainValues.tokenName || '',
  //   }
  //   awards.unshift(compoundAwardToken)
  // }

  if (
    prizePoolType === PRIZE_POOL_TYPE.symblox ||
    prizePoolType === PRIZE_POOL_TYPE.stake
  ) {
    const awardToken = {
      symbol: 'SYX',
      formattedBalance: displayAmountInEther(awardBalance, {
        precision: 4,
        decimals: tokenDecimals,
      }),
      name: 'Symblox',
    }
    awards.unshift(awardToken)
  }

  return {
    loading: false,
    awards,
  }
}
