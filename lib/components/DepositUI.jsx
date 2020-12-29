import React, { useContext, useState } from 'react'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import { ethers } from 'ethers'
import { FormattedMessage } from 'react-intl'
import { DepositForm } from 'lib/components/DepositForm'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'
import { useAtom } from 'jotai'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { ConnectWalletButton } from 'lib/components/ConnectWalletButton'
import { usersAddressAtom } from 'lib/hooks/useUsersAddress'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  ticketAddress,
  depositAmount,
  decimals,
) => {
  if (!depositAmount) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    return
  }

  const referrer = ethers.constants.AddressZero // TODO
  const params = [
    usersAddress,
    ethers.utils.parseUnits(depositAmount, decimals),
    ticketAddress,
    referrer,
    {
      gasLimit: 800000,
      value: ethers.utils.parseUnits(depositAmount, decimals),
    },
  ]

  CompoundPrizePoolAbi.push({
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'controlledToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
    ],
    name: 'depositVlxTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  })

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPrizePoolAbi,
    'depositVlxTo',
    params,
    'Deposit',
  )
}

export const DepositUI = props => {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [usersAddress] = useAtom(usersAddressAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)

  const ticketAddress = poolAddresses.ticket
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'
  const ticketSymbol = poolChainValues.ticketSymbol || 'TOKEN'
  const depositMessage = (
    <FormattedMessage
      id="DEPOSIT_DIRECTIONS"
      values={{
        token: tokenSymbol,
        ticket: ticketSymbol,
      }}
    />
  )
  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
  })

  const txInFlight = tx.inWallet || tx.sent

  const resetState = e => {
    e.preventDefault()
    setDepositAmount('')
    setTx({
      inWallet: false,
      sent: false,
      completed: false,
    })
  }

  if (!usersAddress) {
    return <ConnectWalletButton />
  }

  if (txInFlight) {
    return (
      <>
        <div className="mb-4 sm:mb-8 text-sm sm:text-base text-accent-1">
          {depositMessage}
        </div>
        <TxMessage
          txType="Deposit"
          tx={tx}
          handleReset={resetState}
          resetButtonText={<FormattedMessage id="DEPOSIT_MORE" />}
        />
      </>
    )
  }

  return (
    <>
      <div className="mb-4 sm:mb-8 text-sm sm:text-base text-accent-1">
        {depositMessage}
      </div>
      <DepositForm
        handleSubmit={e => {
          e.preventDefault()
          handleDepositSubmit(
            setTx,
            provider,
            usersAddress,
            poolAddresses.prizePool,
            ticketAddress,
            depositAmount,
            poolChainValues.tokenDecimals,
          )
        }}
        vars={{
          depositAmount,
        }}
        stateSetters={{
          setDepositAmount,
        }}
      />
    </>
  )
}
