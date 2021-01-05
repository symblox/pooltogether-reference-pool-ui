import classnames from 'classnames'
import { useAtom } from 'jotai'
import { FormattedMessage } from 'react-intl'

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
    <Card className={classnames('flex flex-col mx-auto', className)}>
      <CardTitle>
        <FormattedMessage id="TOTAL_DEPOSITS" />
      </CardTitle>
      <CardPrimaryText>{`${total} ${poolChainValues.tokenSymbol}`}</CardPrimaryText>
    </Card>
  )
}
