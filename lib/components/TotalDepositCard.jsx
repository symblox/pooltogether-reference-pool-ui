import classnames from 'classnames'
import { useAtom } from 'jotai'
import { FormattedMessage } from 'react-intl'
import { PoolStakedCards } from 'lib/components/PoolStakedCards'
import { Card, CardPrimaryText, CardTitle } from 'lib/components/Card'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const TotalDepositCard = ({ className }) => {
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const total = displayAmountInEther(
    poolChainValues.poolTotalSupply,
    poolChainValues.tokenDecimals,
  )

  return (
    <div className="flex">
      <PoolStakedCards />
      <div className="flex ml-4 w-full">
        <Card className={classnames(' mx-auto ', className)}>
          <CardTitle>
            <FormattedMessage id="TOTAL_DEPOSITS" />
          </CardTitle>
          <CardPrimaryText>{`${total} ${poolChainValues.tokenSymbol}`}</CardPrimaryText>
        </Card>
      </div>
    </div>
  )
}
