import React, { useMemo } from 'react'

import { Card, InnerCard } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { LoadingDots } from 'lib/components/LoadingDots'
import { useAwardsList } from 'lib/hooks/useAwardsList'
import { RowDataCell, Table } from 'lib/components/Table'
import { FormattedMessage } from 'react-intl'
import PrizeIllustration from 'assets/images/prize-illustration-transparent@2x.png'

export const PrizeAwardsCard = props => {
  return (
    <Card>
      <Collapse title={<FormattedMessage id="CURRENT_PRIZE_DETAILS" />}>
        <PrizeAwardsTable />
      </Collapse>
    </Card>
  )
}

const PrizeAwardsTable = () => {
  const { awards, loading } = useAwardsList()

  const rows = useMemo(
    () =>
      awards
        .map((award, index) => {
          if (award.formattedBalance == 0) return null
          return <Row key={index} award={award} />
        })
        .filter(Boolean),
    [awards],
  )

  if (loading) {
    return (
      <div className="p-10">
        <LoadingDots />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <InnerCard className="mb-8">
        <img src={PrizeIllustration} className="w-32 sm:w-64 mx-auto mb-4" />
        <span className="text-accent-1 text-center text-base sm:text-xl">
          <FormattedMessage id="NO_PRIZE_TIP" />
        </span>
      </InnerCard>
    )
  }

  return (
    <Table
      headers={['Value', 'Token name', 'Ticker']}
      rows={rows}
      className="w-full"
    />
  )
}

const Row = props => {
  const { formattedBalance, symbol, name } = props.award

  if (formattedBalance == 0) return null

  return (
    <tr>
      <RowDataCell first className="font-bold">
        {formattedBalance}
      </RowDataCell>
      <RowDataCell>{name}</RowDataCell>
      <RowDataCell className="text-accent-1">{symbol}</RowDataCell>
    </tr>
  )
}
