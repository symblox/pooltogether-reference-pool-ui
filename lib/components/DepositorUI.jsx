import React from 'react'

import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { DepositUI } from 'lib/components/DepositUI'
import { PrizeCard } from 'lib/components/PrizeCard'
import { WithdrawUI } from 'lib/components/WithdrawUI'
import { DepositorOddsCards } from 'lib/components/DepositorOddsCards'
import { FormattedMessage } from 'react-intl'

export const DepositorUI = props => {
  return (
    <>
      <PrizeCard className="mb-4" />
      <DepositorOddsCards />
      <Card>
        <Collapse title={<FormattedMessage id="DEPOSIT_TO_WIN" />} openOnMount>
          <DepositUI />
        </Collapse>
      </Card>
      <Card>
        <Collapse title={<FormattedMessage id="WITHDRAW" />}>
          <WithdrawUI />
        </Collapse>
      </Card>
    </>
  )
}
