import React from 'react'

import { PrizeCard } from 'lib/components/PrizeCard'
import { TotalDepositCard } from 'lib/components/TotalDepositCard'

export const LandingUI = props => {
  return (
    <>
      <TotalDepositCard />
      <PrizeCard showLinks />
    </>
  )
}
