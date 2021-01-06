import React, { useContext, useEffect, useState } from 'react'
import PrizePoolAbi from '@symblox/pvlx-contracts/abis/SyxPrizePool'

import { sendTx } from 'lib/utils/sendTx'
import {
  fetchPoolChainValues,
  poolChainValuesAtom,
} from 'lib/hooks/usePoolChainValues'
import { useAtom } from 'jotai'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useTimeLeft } from 'lib/hooks/useTimeLeft'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import {
  contractVersionsAtom,
  prizePoolTypeAtom,
} from 'lib/hooks/useDetermineContractVersions'
import { errorStateAtom } from 'lib/components/PoolData'
import { Card, CardSecondaryText } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { LoadingDots } from 'lib/components/LoadingDots'

const handleClaimInterestSubmit = async (setTx, provider, contractAddress) => {
  const params = [
    {
      gasLimit: 700000,
    },
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    'claimInterest',
    params,
    'Claim Interest',
  )
}

const handleDepositInterestSubmit = async (
  setTx,
  provider,
  contractAddress,
) => {
  const params = [
    {
      gasLimit: 700000,
    },
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    PrizePoolAbi,
    'depositInterest',
    params,
    'Deposit Interest',
  )
}

export const ClaimRewardCard = () => {
  return (
    <Card>
      <Collapse title="Claim Reward">
        <ClaimRewardTrigger />
      </Collapse>
    </Card>
  )
}

const ClaimRewardTrigger = () => {
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const [tx, setTx] = useState({})
  const [txType, setTxType] = useState('')

  const txInFlight = tx.inWallet || (tx.sent && !tx.completed)

  const resetState = e => {
    e.preventDefault()
    setTx({})
  }

  const handleClaimInterestClick = e => {
    e.preventDefault()
    setTxType('Claim Interest')
    handleClaimInterestSubmit(setTx, provider, poolAddresses.prizePool)
  }

  const handleDepositInterestClick = e => {
    e.preventDefault()
    setTxType('Deposit Interest')
    handleDepositInterestSubmit(setTx, provider, poolAddresses.prizePool)
  }

  // // If countdown has finished, trigger a chain data refetch
  // useEffect(() => {
  //   if (tx.completed) {
  //     fetchPoolChainValues(
  //       provider,
  //       poolAddresses,
  //       prizePoolType,
  //       setPoolChainValues,
  //       contractVersions.prizeStrategy.contract,
  //       setErrorState,
  //     )
  //   }
  // }, [tx.completed])

  if (txInFlight) {
    return (
      <>
        <TxMessage
          txType={txType}
          tx={tx}
          handleReset={resetState}
          resetButtonText="Hide this"
        />
        <div className="flex mt-4">
          <Button
            type="button"
            disabled={true}
            color="secondary"
            size="lg"
            fullWidth
            className="mr-4"
          >
            Claim interest
          </Button>
          <Button
            type="button"
            disabled={true}
            color="secondary"
            size="lg"
            fullWidth
            className="ml-4"
          >
            Deposit interest
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex mt-4">
        <Button
          type="button"
          onClick={handleClaimInterestClick}
          color="secondary"
          size="lg"
          fullWidth
          className="mr-4"
        >
          Claim interest
        </Button>
        <Button
          type="button"
          onClick={handleDepositInterestClick}
          color="secondary"
          size="lg"
          fullWidth
          className="ml-4"
        >
          Deposit interest
        </Button>
      </div>
    </>
  )
}
