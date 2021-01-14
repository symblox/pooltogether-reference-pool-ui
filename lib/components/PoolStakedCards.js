import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { FormattedMessage } from 'react-intl'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolStakedCards = props => {
  return (
    <div className="flex w-full">
      <TotalDeposits />
    </div>
  )
}

const TotalDeposits = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const total =
    displayAmountInEther(
      poolChainValues.stakedAmount,
      poolChainValues.tokenDecimals,
    ) *
    displayAmountInEther(
      poolChainValues.bptPrice,
      poolChainValues.tokenDecimals,
    )

  return (
    <Card>
      <CardTitle>
        <FormattedMessage id="POOL_STAKED" />
      </CardTitle>
      <CardPrimaryText>{`${total.toFixed(2)} ${
        poolChainValues.tokenSymbol
      }`}</CardPrimaryText>
    </Card>
  )
}
