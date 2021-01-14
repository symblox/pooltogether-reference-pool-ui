import React, { useMemo } from 'react'
import classnames from 'classnames'
import { useWinnerList } from 'lib/hooks/useWinnerList'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { FormattedMessage } from 'react-intl'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { ethToVlx } from 'lib/utils/vlxAddressConversion'
import { networkAtom } from 'lib/hooks/useNetwork'
import { useAtom } from 'jotai'
import { TOKEN_NAMES } from 'lib/constants'
import { RowDataCell, Table } from 'lib/components/Table'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'

export const Winners = ({ className }) => {
  const [network] = useAtom(networkAtom)
  const [winnerList, setWinnerList] = useWinnerList()

  const rows = useMemo(() => {
    return winnerList
      .sort(function (a, b) {
        return b.timestamp - a.timestamp
      })
      .map((data, index) => {
        const date = new Date(data.timestamp * 1000)

        let nowMonth = date.getMonth() + 1
        let strDate = date.getDate()
        const seperator = '/'

        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = '0' + nowMonth
        }

        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        if (index < 10)
          return (
            <Row
              key={index}
              index={index}
              address={ethToVlx(data.values.winner)}
              amount={displayAmountInEther(data.values.amount, {
                precision: 4,
                decimals: 18,
              })}
              token={TOKEN_NAMES[network.id][data.values.token]}
              date={
                date.getFullYear() + seperator + nowMonth + seperator + strDate
              }
            />
          )
      })
  }, [winnerList])

  return (
    <Card className={classnames('flex flex-col mx-auto', className)}>
      <Collapse title={<FormattedMessage id="WINNER" />}>
        <Table
          headers={[
            <FormattedMessage id="ADDRESS" />,
            <FormattedMessage id="AMOUNT" />,
            <FormattedMessage id="DATE" />,
          ]}
          rows={rows}
          className="w-full"
        />
      </Collapse>
    </Card>
  )
}

const Row = props => {
  const { address, amount, date, token } = props

  return (
    <tr>
      <RowDataCell first className="font-bold">
        <EtherscanAddressLink
          size="xxs"
          address={address}
          className="text-accent-1"
        >
          {address}
        </EtherscanAddressLink>
      </RowDataCell>
      <RowDataCell>
        {amount} {token}
      </RowDataCell>
      <RowDataCell>{date}</RowDataCell>
    </tr>
  )
}
