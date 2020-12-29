import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const ConnectWalletButton = props => {
  const { children, ...buttonProps } = props
  const walletContext = useContext(WalletContext)

  const handleConnect = e => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  return (
    <Button type="button" onClick={handleConnect} {...buttonProps}>
      {children}
    </Button>
  )
}

ConnectWalletButton.defaultProps = {
  size: 'lg',
  color: 'secondary',
  children: <FormattedMessage id="CONNECT_WALLET" />,
  fullWidth: 'true',
}
