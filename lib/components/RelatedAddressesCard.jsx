import React, { useMemo } from 'react'
import { useAtom } from 'jotai'
import { FormattedMessage } from 'react-intl'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { RowDataCell, Table } from 'lib/components/Table'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'

export const RelatedAddressesCard = props => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const rows = useMemo(() => {
    const rowData = [
      {
        contract: 'Pool',
        address: poolAddresses.prizePool,
      },
      {
        contract: 'pVLX (Ticket)',
        address: poolAddresses.ticket,
      },
      {
        contract: 'Sponsorship',
        address: poolAddresses.sponsorship,
      },
      {
        contract: 'Prize strategy',
        address: poolAddresses.prizeStrategy,
      },
      {
        contract: 'sVLX (Underlying)',
        address: poolAddresses.token,
      },
      {
        contract: 'Random Number Generator (RNG)',
        address: poolAddresses.rng,
      },
    ]

    return rowData.map((data, index) => (
      <Row
        key={index}
        index={index}
        contract={data.contract}
        address={data.address}
      />
    ))
  }, [poolAddresses])

  return (
    <Card>
      <Collapse title={<FormattedMessage id="RELATED_CONTRACT_ADDRESS" />}>
        <Table
          headers={[
            <FormattedMessage id="CONTRACT" />,
            <FormattedMessage id="ADDRESS" />,
          ]}
          rows={rows}
          className="w-full"
        />
      </Collapse>
    </Card>
  )
}

const Row = props => {
  const { contract, address } = props

  return (
    <tr>
      <RowDataCell first className="font-bold">
        {contract}
      </RowDataCell>
      <RowDataCell>
        <EtherscanAddressLink
          size="xxs"
          address={address}
          className="text-accent-1"
        >
          {address}
        </EtherscanAddressLink>
      </RowDataCell>
    </tr>
  )
}
