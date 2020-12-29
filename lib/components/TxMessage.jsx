import React, { useContext } from 'react'
import classnames from 'classnames'
import Loader from 'react-loader-spinner'
import FeatherIcon from 'feather-icons-react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'lib/components/Button'
import { InnerCard } from 'lib/components/Card'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { shorten } from 'lib/utils/shorten'

export const TxMessage = props => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId

  const { tx, txType, resetButtonText, handleReset, className } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = txInWallet || txSent || txCompleted

  if (!tx || !txInFlight) {
    return null
  }

  return (
    <InnerCard className={classnames('flex flex-col text-center', className)}>
      {!txCompleted && !txError && (
        <Loader
          type="Oval"
          height={65}
          width={65}
          color="#bbb2ce"
          className="mx-auto mb-4"
        />
      )}

      {txCompleted && !txError && (
        <FeatherIcon
          icon="check-circle"
          className={
            'mx-auto stroke-1 w-3 h-3 sm:w-16 sm:h-16 stroke-current text-accent-1 mb-4'
          }
        />
      )}

      {txCompleted && txError && (
        <FeatherIcon
          icon="x-circle"
          className={
            'mx-auto stroke-1 w-3 h-3 sm:w-16 sm:h-16 stroke-current text-accent-1 mb-4'
          }
        />
      )}

      <div className="text-accent-1 text-sm sm:text-base">
        <FormattedMessage id="TRANSACTION_STATUS" />
      </div>

      {txInWallet && !txError && (
        <div className="text-accent-1 text-sm sm:text-base">
          <FormattedMessage id="TRANSACTION_TIP_1" />
        </div>
      )}

      {txSent && (
        <div className="text-accent-1 text-sm sm:text-base">
          <FormattedMessage id="TRANSACTION_WAITING" />
        </div>
      )}

      {txCompleted && !txError && (
        <div className="text-green-1 text-sm sm:text-base">
          <FormattedMessage id="TRANSACTION_SUCCESS" />
        </div>
      )}

      {txError && (
        <div className="text-red-1 text-sm sm:text-base">
          <FormattedMessage id="TRANSACTION_ERROR" />
        </div>
      )}

      {tx.hash && (
        <div className="text-accent-1 text-sm sm:text-base">
          <FormattedMessage id="TRANSACTION_HASH" />{' '}
          <EtherscanTxLink
            chainId={chainId}
            hash={tx.hash}
            className="underline"
          >
            {shorten(tx.hash)}
          </EtherscanTxLink>
        </div>
      )}

      {handleReset && txCompleted && (
        <Button
          size="sm"
          className="mt-4 mx-auto"
          color="secondary"
          onClick={handleReset}
        >
          {resetButtonText || <FormattedMessage id="RESET_FORM" />}
        </Button>
      )}
    </InnerCard>
  )
}
