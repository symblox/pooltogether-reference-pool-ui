import { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import {
  errorStateAtom,
  getDataFetchingErrorMessage,
} from 'lib/components/PoolData'
import { ethers } from 'ethers'
import PrizePoolAbi from '@symblox/pvlx-contracts/abis/SyxPrizePool'

export const winnerListAtom = atom({})

export const useWinnerList = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [winnerList, setWinnerList] = useState([])
  const provider = useReadProvider()

  // React to changes to data
  useEffect(() => {
    if (!provider || !poolAddresses) return
    fetchPoolWinnerList(provider, poolAddresses, setWinnerList, setErrorState)
  }, [provider, poolAddresses])

  return [winnerList, setWinnerList]
}

export const fetchPoolWinnerList = async (
  provider,
  poolAddresses,
  setWinnerList,
  setErrorState,
) => {
  const { prizePool } = poolAddresses

  if (provider && prizePool) {
    try {
      const prizePoolContract = new ethers.Contract(
        poolAddresses.prizePool,
        PrizePoolAbi,
        provider,
      )
      let filter = prizePoolContract.filters.AwardedExternalERC20()
      filter.fromBlock = 0
      const logs = await provider.getLogs(filter)
      const events = logs.map(log => {
        return {
          ...prizePoolContract.interface.parseLog(log),
          blockNumber: log.blockNumber,
        }
      })
      setWinnerList(events)
    } catch (e) {
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(
          prizePool,
          'winner list',
          e.message,
        ),
      })
      return
    }
  }
}
