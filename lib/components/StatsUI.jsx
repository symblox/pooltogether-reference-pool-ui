import React from 'react'

import { PrizeAwardsCard } from 'lib/components/PrizeAwardsCard'
import { PrizeDetailsCards } from 'lib/components/PrizeDetailsCards'
import { PoolStakedCards } from 'lib/components/PoolStakedCards'
import { ExitFeeCards } from 'lib/components/ExitFeeCards'
import { TicketCards } from 'lib/components/TicketCards'
import { RelatedAddressesCard } from 'lib/components/RelatedAddressesCard'

export const StatsUI = props => {
  return (
    <>
      <PrizeAwardsCard />
      <PoolStakedCards />
      <PrizeDetailsCards />
      <ExitFeeCards />
      <TicketCards />
      <RelatedAddressesCard />
    </>
  )
}
