import React from 'react'

import { PrizeCard } from 'lib/components/PrizeCard'
import { TotalDepositCard } from 'lib/components/TotalDepositCard'
import { Winners } from 'lib/components/Winners'

export const LandingUI = props => {
  return (
    <>
      <TotalDepositCard />
      <PrizeCard showLinks />
      <Winners />
    </>
  )
}
