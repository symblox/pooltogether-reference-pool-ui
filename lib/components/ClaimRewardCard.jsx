import React, { useContext, useState } from 'react'
import PrizePoolAbi from '@symblox/pvlx-contracts/abis/SyxPrizePool'
import { useSvlxValues } from 'lib/hooks/useSvlxValues'
import { sendTx } from 'lib/utils/sendTx'
import { useAtom } from 'jotai'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { Button } from 'lib/components/Button'
import { TxMessage } from 'lib/components/TxMessage'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

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
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [svlxData, setSvlxData] = useSvlxValues()
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
      <div>
        Total interest:{' '}
        {svlxData
          ? displayAmountInEther(svlxData.totalRewards, {
              precision: 2,
              decimals: 18,
            })
          : 0}{' '}
        VLX
      </div>
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
