import { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import {
  errorStateAtom,
  getDataFetchingErrorMessage,
} from 'lib/components/PoolData'
import { batch, contract } from '@pooltogether/etherplex'
import svlxAbi from 'lib/abis/svlx'

export const svlxValuesAtom = atom({})

export const useSvlxValues = () => {
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [svlxData, setSvlxData] = useState()
  const provider = useReadProvider()

  // React to changes to data
  useEffect(() => {
    if (!provider || !poolAddresses) return
    fetchSvlxValues(provider, poolAddresses, setSvlxData, setErrorState)
  }, [provider, poolAddresses])

  return [svlxData, setSvlxData]
}

export const fetchSvlxValues = async (
  provider,
  poolAddresses,
  setSvlxData,
  setErrorState,
) => {
  const { prizePool } = poolAddresses

  if (provider && prizePool) {
    try {
      const svlxContract = contract('svlx', svlxAbi, poolAddresses.token)

      const batchRequests = [svlxContract.getTotalRewards()]

      const values = await batch(provider, ...batchRequests)
      setSvlxData({
        totalRewards: values.svlx.getTotalRewards[0],
      })
    } catch (e) {
      setErrorState({
        error: true,
        errorMessage: getDataFetchingErrorMessage(
          prizePool,
          'svlx values',
          e.message,
        ),
      })
      return
    }
  }
}
