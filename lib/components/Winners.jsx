import React, { useMemo } from 'react'
import classnames from 'classnames'
import { useWinnerList } from 'lib/hooks/useWinnerList'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { FormattedMessage } from 'react-intl'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { ethToVlx } from 'lib/utils/vlxAddressConversion'
import { networkAtom } from 'lib/hooks/useNetwork'
import { useAtom } from 'jotai'
import { TOKEN_NAMES } from 'lib/constants'
import { RowDataCell, Table } from 'lib/components/Table'

export const Winners = ({ className }) => {
  const [network] = useAtom(networkAtom)
  const [winnerList, setWinnerList] = useWinnerList()

  const rows = useMemo(() => {
    return winnerList.map((data, index) => (
      <Row
        key={index}
        index={index}
        address={ethToVlx(data.values.winner)}
        amount={displayAmountInEther(data.values.amount, {
          precision: 4,
          decimals: 18,
        })}
        token={TOKEN_NAMES[network.id][data.values.token]}
        block={data.blockNumber}
      />
    ))
  }, [winnerList])

  return (
    <Card className={classnames('flex flex-col mx-auto', className)}>
      <CardTitle>
        <FormattedMessage id="WINNER" />
      </CardTitle>
      <CardPrimaryText>
        <Table
          headers={[
            <FormattedMessage id="ADDRESS" />,
            <FormattedMessage id="AMOUNT" />,
            <FormattedMessage id="BLOCKNUMBER" />,
          ]}
          rows={rows}
          className="w-full"
        />
      </CardPrimaryText>
    </Card>
  )
}

const Row = props => {
  const { address, amount, block, token } = props

  return (
    <tr>
      <RowDataCell first className="font-bold">
        {address}
      </RowDataCell>
      <RowDataCell>
        {amount} {token}
      </RowDataCell>
      <RowDataCell>{block}</RowDataCell>
    </tr>
  )
}
