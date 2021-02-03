import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import {
  errorStateAtom,
  getDataFetchingErrorMessage,
} from 'lib/components/PoolData'
import {
  CONTRACTS,
  DATA_REFRESH_POLLING_INTERVAL,
  PRIZE_POOL_TYPE,
} from 'lib/constants'
import { useReadProvider } from 'lib/hooks/useReadProvider'

import ERC20Abi from 'ERC20Abi'
import CTokenAbi from '@symblox/pvlx-contracts/abis/CTokenInterface'
import PrizePoolAbi from '@symblox/pvlx-contracts/abis/PrizePool'
import MultipleWinnersPrizeStrategyAbi from '@symblox/pvlx-contracts/abis/MultipleWinners'
import SingleRandomWinnerPrizeStrategyAbi from '@symblox/pvlx-contracts/abis/SingleRandomWinner'
import SyxSponsorAbi from '@symblox/pvlx-contracts/abis/Sponsor'
import BptAbi from 'lib/abis/bPool'

import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useInterval } from 'lib/hooks/useInterval'
import {
  contractVersionsAtom,
  prizePoolTypeAtom,
} from 'lib/hooks/useDetermineContractVersions'

export const poolChainValuesAtom = atom({
  loading: true,
})

export const usePoolChainValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [prizePoolType] = useAtom(prizePoolTypeAtom)
  const [poolChainValues, setPoolChainValues] = useAtom(poolChainValuesAtom)
  const [contractVersions] = useAtom(contractVersionsAtom)
  const provider = useReadProvider()

  // React to changes to data
  useEffect(() => {
    if (!provider || !poolAddresses || !prizePoolType) return

    fetchPoolChainValues(
      provider,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions.prizeStrategy.contract,
      setErrorState,
    )
  }, [provider, poolAddresses, prizePoolType])

  // Keep data up to date
  useInterval(() => {
    if (!provider || !poolAddresses || !prizePoolType) return

    fetchPoolChainValues(
      provider,
      poolAddresses,
      prizePoolType,
      setPoolChainValues,
      contractVersions.prizeStrategy.contract,
      setErrorState,
    )
  }, DATA_REFRESH_POLLING_INTERVAL)

  return [poolChainValues, setPoolChainValues]
}

export const fetchPoolChainValues = async (
  provider,
  poolAddresses,
  prizePoolType,
  setPoolChainValues,
  prizeStrategyContract,
  setErrorState,
) => {
  const {
    prizeStrategy,
    ticket,
    sponsorship,
    token,
    cToken,
    prizePool,
    sponsor,
  } = poolAddresses

  if (provider && prizeStrategy && ticket && sponsorship && prizePool) {
    try {
      const prizeStrategyRequests = getPrizeStrategyRequests(
        prizeStrategy,
        prizeStrategyContract,
      )
      const etherplexTicketContract = contract('ticket', ERC20Abi, ticket)
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ERC20Abi,
        sponsorship,
      )
      const etherplexTokenContract = contract('token', ERC20Abi, token)
      const etherplexPrizePoolContract = contract(
        'prizePool',
        PrizePoolAbi,
        prizePool,
      )

      const batchRequests = [
        prizeStrategyRequests,
        etherplexTicketContract.name().symbol().totalSupply().decimals(),
        etherplexSponsorshipContract.name().symbol().totalSupply(),
        etherplexTokenContract.decimals().symbol().name(),
        etherplexPrizePoolContract
          .captureAwardBalance()
          .creditPlanOf(ticket)
          .maxExitFeeMantissa(),
      ]

      if (prizePoolType === PRIZE_POOL_TYPE.compound) {
        const etherplexCTokenContract = contract('cToken', CTokenAbi, cToken)
        batchRequests.push(etherplexCTokenContract.supplyRatePerBlock())
      }

      if (
        prizePoolType === PRIZE_POOL_TYPE.symblox ||
        prizePoolType === PRIZE_POOL_TYPE.stake
      ) {
        const etherplexSponsorContract = contract(
          'sponsor',
          SyxSponsorAbi,
          sponsor,
        )
        batchRequests.push(
          etherplexSponsorContract.earned().balanceOfLpToken().lpToken(),
        )
      }

      const values = await batch(provider, ...batchRequests)

      let batchRequests2 = [],
        batchRequests3 = [],
        batchRequests4 = [],
        values2,
        values3,
        values4
      const lpToken = values.sponsor.lpToken[0]
      if (lpToken) {
        const bptContract = contract('bpt', BptAbi, lpToken)
        batchRequests2.push(bptContract.wToken())
        values2 = await batch(provider, ...batchRequests2)

        batchRequests3.push(
          bptContract
            .totalSupply()
            .getTotalDenormalizedWeight()
            .getSwapFee()
            .getBalance(values2.bpt.wToken[0])
            .getDenormalizedWeight(values2.bpt.wToken[0]),
        )
        values3 = await batch(provider, ...batchRequests3)

        batchRequests4.push(
          bptContract.calcSingleOutGivenPoolIn(
            values3.bpt.getBalance[0],
            values3.bpt.getDenormalizedWeight[0],
            values3.bpt.totalSupply[0],
            values3.bpt.getTotalDenormalizedWeight[0],
            '1000000000000000000', //1
            values3.bpt.getSwapFee[0],
          ),
        )

        values4 = await batch(provider, ...batchRequests4)
      }

      const poolTotalSupply = ethers.utils
        .bigNumberify(values.ticket.totalSupply[0])
        .add(values.sponsorship.totalSupply[0])

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      setPoolChainValues(existingValues => ({
        ...existingValues,
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        externalErc20Awards: values.prizeStrategy.getExternalErc20Awards[0],
        externalErc721Awards: values.prizeStrategy.getExternalErc721Awards[0],
        supplyRatePerBlock: values?.cToken?.supplyRatePerBlock[0],
        isRngRequested: values.prizeStrategy.isRngRequested[0],
        prizePeriodRemainingSeconds:
          values.prizeStrategy.prizePeriodRemainingSeconds[0],
        numberOfWinners:
          values.prizeStrategy.numberOfWinners?.[0] ||
          ethers.utils.bigNumberify(1),
        sponsorshipName: values.sponsorship.name[0],
        sponsorshipSymbol: values.sponsorship.symbol[0],
        sponsorshipTotalSupply: values.sponsorship.totalSupply[0],
        ticketName: values.ticket.name[0],
        ticketSymbol: values.ticket.symbol[0],
        ticketDecimals: values.ticket.decimals[0],
        ticketTotalSupply: values.ticket.totalSupply[0],
        awardBalance:
          values?.sponsor !== undefined
            ? values?.sponsor?.earned[0]
            : values.prizePool.captureAwardBalance[0],
        stakedAmount: values.sponsor.balanceOfLpToken[0],
        stakedVlxAmount: values.sponsor.balanceOfLpToken[0]
          .mul(values4.bpt.calcSingleOutGivenPoolIn[0])
          .div(ethers.utils.parseUnits('1')),
        bptPrice: values4.bpt.calcSingleOutGivenPoolIn[0],
        ticketCreditRateMantissa:
          values.prizePool.creditPlanOf.creditRateMantissa,
        ticketCreditLimitMantissa:
          values.prizePool.creditPlanOf.creditLimitMantissa,
        maxExitFeeMantissa: values.prizePool.maxExitFeeMantissa[0],
        poolTotalSupply,
        tokenDecimals: decimals,
        tokenSymbol: 'VLX', //values.token.symbol[0],
        tokenName: 'velas', //values.token.name[0],
        loading: false,
      }))
    } catch (e) {
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(
          prizePool,
          'pool chain values',
          e.message,
        ),
      })
      return
    }
  }
}

const getPrizeStrategyRequests = (prizeStrategyAddress, contractType) => {
  switch (contractType) {
    case CONTRACTS.singleRandomWinner: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        SingleRandomWinnerPrizeStrategyAbi,
        prizeStrategyAddress,
      )
      return etherplexPrizeStrategyContract
        .isRngRequested() // used to determine if the pool is locked
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
    }
    case CONTRACTS.multipleWinners:
    default: {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        MultipleWinnersPrizeStrategyAbi,
        prizeStrategyAddress,
      )
      return etherplexPrizeStrategyContract
        .isRngRequested()
        .canStartAward()
        .canCompleteAward()
        .prizePeriodRemainingSeconds()
        .getExternalErc20Awards()
        .getExternalErc721Awards()
        .numberOfWinners()
    }
  }
}
