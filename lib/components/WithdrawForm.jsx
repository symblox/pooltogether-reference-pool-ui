import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import { FormattedMessage } from 'react-intl'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { poolChainValuesAtom } from 'lib/hooks/usePoolChainValues'
import { userChainValuesAtom } from 'lib/hooks/useUserChainValues'
import { networkAtom } from 'lib/hooks/useNetwork'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { fetchWithdrawableAmount } from 'lib/utils/fetchWithdrawableAmount'

import { InnerCard } from 'lib/components/Card'

import Warning from 'assets/images/warning.svg'

export const WithdrawForm = props => {
  const { exitFees, handleSubmit, vars, stateSetters, loading } = props
  const [maxWithdrawable, setMaxWithdrawable] = useState(
    ethers.utils.bigNumberify(0),
  )
  const [stakingEpochDuration, setStakingEpochDuration] = useState(0)
  const [showApplyCard, setShowApplyCard] = useState(false)

  const [network] = useAtom(networkAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [poolChainValues] = useAtom(poolChainValuesAtom)
  const [usersChainValues] = useAtom(userChainValuesAtom)

  const { token } = poolAddresses

  const { usersTicketBalance } = usersChainValues || {}

  const { burnedCredit, exitFee, timelockDurationSeconds } = exitFees || {}

  const { withdrawAmount, withdrawType } = vars

  const { setWithdrawAmount, setWithdrawType } = stateSetters

  setWithdrawType('instant')

  // const handleWithdrawTypeChange = e => {
  //   setWithdrawType(e.target.value)
  // }

  const { isRngRequested, tokenDecimals } = poolChainValues || {}

  const poolIsLocked = isRngRequested
  const tokenSymbol = poolChainValues.tokenSymbol || 'TOKEN'
  const ticketSymbol = poolChainValues.ticketSymbol || 'TICK'

  let instantTotal = ethers.utils.bigNumberify(0)
  if (withdrawAmount) {
    if (exitFee && exitFee.gt(0) && withdrawType === 'instant') {
      instantTotal = ethers.utils
        .parseUnits(withdrawAmount, tokenDecimals)
        .sub(exitFee)
    } else {
      instantTotal = ethers.utils.parseUnits(withdrawAmount, tokenDecimals)
    }
  }

  let withdrawAmountBN
  let overBalance = false
  try {
    withdrawAmountBN = ethers.utils.parseUnits(
      withdrawAmount || '0',
      tokenDecimals,
    )
    overBalance =
      withdrawAmount &&
      usersTicketBalance &&
      usersTicketBalance.lt(withdrawAmountBN)
  } catch (e) {
    console.error(e)
  }

  const ticketBal = ethers.utils.formatUnits(usersTicketBalance, tokenDecimals)

  const timelockCredit = '?'

  const submit = async () => {
    // await getWithdrawableAmount()
    if (
      !overBalance &&
      exitFee &&
      withdrawType === 'instant' &&
      maxWithdrawable.lt(instantTotal)
    ) {
      setShowApplyCard(true)
    } else {
      handleSubmit()
    }
  }

  const handleReset = async () => {
    setMaxWithdrawable(ethers.utils.bigNumberify(0))
    setWithdrawAmount('')
    setStakingEpochDuration(0)
    overBalance = false
    setShowApplyCard(false)
  }

  const getWithdrawableAmount = async () => {
    if (network && token) {
      const res = await fetchWithdrawableAmount(network.name, token)
      setMaxWithdrawable(res.withdrawable)
      setStakingEpochDuration(res.stakingEpochDuration)
    }
  }

  if (poolIsLocked) {
    return (
      <InnerCard className="text-center">
        <img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />
        <div className="text-accent-1 mb-4">
          This Prize Pool is unable to withdraw at this time.
        </div>
        <div className="text-accent-1">
          Withdraws can be made once the prize has been awarded.
        </div>
        <div className="text-accent-1">Check back soon!</div>
      </InnerCard>
    )
  }

  if (!poolIsLocked && usersTicketBalance && usersTicketBalance.lte(0)) {
    return (
      <div className="text-orange-600">
        You have no tickets to withdraw. Deposit some {tokenSymbol} first!
      </div>
    )
  }

  if (
    !overBalance &&
    exitFee &&
    withdrawType === 'instant' &&
    maxWithdrawable.lt(instantTotal) &&
    showApplyCard
  ) {
    return (
      <InnerCard className="text-center">
        <img src={Warning} className="w-10 sm:w-14 mx-auto mb-4" />
        <div className="text-accent-1 mb-4">
          <FormattedMessage
            id="WITHDRAWABLE_TIP"
            values={{
              maxWithdrawable: displayAmountInEther(maxWithdrawable, {
                decimals: tokenDecimals,
              }),
              stakingEpochDuration,
            }}
          />
        </div>
        <Button
          disabled={overBalance || loading}
          color="warning"
          size="sm"
          onClick={handleSubmit}
        >
          <FormattedMessage id="WITHDRAW_APPLY" />
        </Button>
        <Button
          size="sm"
          className="mt-4 mx-auto"
          color="secondary"
          onClick={handleReset}
        >
          <FormattedMessage id="RESET_FORM" />
        </Button>
      </InnerCard>
    )
  }

  return (
    <>
      {/* <form> */}
      <TextInputGroup
        id="withdrawAmount"
        name="withdrawAmount"
        label={<FormattedMessage id="WITHDRAW_AMOUNTS" />}
        required
        type="number"
        pattern="\d+"
        unit={tokenSymbol}
        onChange={e => {
          getWithdrawableAmount()
          setWithdrawAmount(e.target.value)
        }}
        value={withdrawAmount}
        rightLabel={
          tokenSymbol && (
            <>
              <button
                type="button"
                onClick={e => {
                  e.preventDefault()
                  getWithdrawableAmount()
                  setWithdrawAmount(ticketBal)
                }}
              >
                {/* Balance:  */}
                <FormattedMessage id="MAX" /> -{' '}
                {numberWithCommas(ticketBal, { precision: 4 })} {tokenSymbol}
              </button>
            </>
          )
        }
      />

      {overBalance && (
        <>
          <div className="text-yellow-1">
            You only have{' '}
            {displayAmountInEther(usersTicketBalance, {
              decimals: tokenDecimals,
            })}{' '}
            tickets.
            <br />
            The maximum you can withdraw is{' '}
            {displayAmountInEther(usersTicketBalance, {
              precision: 2,
              decimals: tokenDecimals,
            })}{' '}
            {tokenSymbol}.
          </div>
        </>
      )}
      {!overBalance && exitFee && withdrawType === 'instant' && (
        <>
          <div className="text-yellow-1">
            {/* <>
              <FormattedMessage id="YOU_WILL_RECEIVE" />{' '}
              {displayAmountInEther(instantTotal, {
                decimals: tokenDecimals,
              })}{' '}
              {tokenSymbol} &nbsp;
            </> */}
            {exitFee.eq(0) ? (
              <></>
            ) : (
              <>
                <FormattedMessage id="AND_FORFEIT" />{' '}
                {displayAmountInEther(exitFee, { decimals: tokenDecimals })}{' '}
                {tokenSymbol} <FormattedMessage id="AS_INTEREST" />
              </>
            )}
          </div>
        </>
      )}
      <div className="my-5">
        <Button
          disabled={overBalance || loading}
          color="warning"
          size="lg"
          onClick={e => {
            e.preventDefault()
            submit()
          }}
        >
          <FormattedMessage id="WITHDRAW" />
        </Button>
      </div>
      {/* </form> */}
    </>
  )
}
