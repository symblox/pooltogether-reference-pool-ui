import React from 'react'
import { useAtom } from 'jotai'

import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { FormattedMessage } from 'react-intl'

export const DepositorOddsCards = props => {
  return (
    <div className="flex">
      <TicketCard />
      <OddsCard />
      <BalanceCard />
    </div>
  )
}

const TicketCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const balance = displayAmountInEther(userChainValues.usersTicketBalance, {
    precision: 0,
    decimals: poolChainValues.ticketDecimals,
  })
  const symbol = poolChainValues.ticketSymbol

  return (
    <Card className="mr-4 text-center">
      <CardTitle>
        <FormattedMessage id="MY_TICKETS" />
      </CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}

const OddsCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const odds = calculateOdds(
    userChainValues.usersTicketBalance,
    poolChainValues.ticketTotalSupply,
    poolChainValues.ticketDecimals,
    poolChainValues.numberOfWinners,
  )

  if (!odds) {
    return (
      <Card className="mx-4 text-center">
        <CardTitle>
          <FormattedMessage id="MY_WINNING_ODDS" />
        </CardTitle>
        <CardPrimaryText>0</CardPrimaryText>
      </Card>
    )
  }

  const formattedOdds = numberWithCommas((1 / odds) * 100, { precision: 4 })
  return (
    <Card className="mx-4 text-center">
      <CardTitle>
        <FormattedMessage id="MY_WINNING_ODDS" />
      </CardTitle>
      <CardPrimaryText>{formattedOdds} %</CardPrimaryText>
    </Card>
  )
}

const BalanceCard = () => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [userChainValues] = useAtom(userChainValuesAtom)
  const balance = displayAmountInEther(userChainValues.usersTokenBalance, {
    precision: 2,
    decimals: poolChainValues.tokenDecimals,
  })
  const symbol = poolChainValues.tokenSymbol

  return (
    <Card className="ml-4 text-center">
      <CardTitle>
        <FormattedMessage id="MY_WALLET_BALANCE" />
      </CardTitle>
      <CardPrimaryText>{`${balance} ${symbol}`}</CardPrimaryText>
    </Card>
  )
}
