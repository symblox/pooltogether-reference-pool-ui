import React from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PrizePoolAbi from '@symblox/pvlx-contracts/abis/PrizePool'

import { errorStateAtom } from 'lib/components/PoolData'
import { CONTRACTS, CONTRACT_VERSIONS, PRIZE_POOL_TYPE } from 'lib/constants'
import { networkAtom } from 'lib/hooks/useNetwork'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { Button } from 'lib/components/Button'
import { poolAddressesAtom } from 'lib/hooks/usePoolAddresses'

export const contractVersionsAtom = atom({})
export const prizePoolTypeAtom = atom(get => {
  const contract = get(contractVersionsAtom)?.prizePool?.contract

  switch (contract) {
    case CONTRACTS.compound: {
      return PRIZE_POOL_TYPE.compound
    }
    case CONTRACTS.stake: {
      return PRIZE_POOL_TYPE.stake
    }
    case CONTRACTS.symblox: {
      return PRIZE_POOL_TYPE.symblox
    }
    default: {
      return undefined
    }
  }
})

export const useDetermineContractVersions = props => {
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [contractVersions, setContractVersions] = useAtom(contractVersionsAtom)
  const [network] = useAtom(networkAtom)
  const router = useRouter()
  const provider = useReadProvider()
  const { prizePoolAddress } = router.query

  useEffect(() => {
    if (!provider) return
    getContractVersions(
      provider,
      network.id,
      prizePoolAddress,
      setContractVersions,
      setErrorState,
    )
  }, [provider, network.id, prizePoolAddress])

  return null
}

/**
 * Sets the versions based on bytecode stored in current-pool-data.
 * Only checks Prize Pool & Prize Strategy.
 * @param {*} provider
 * @param {*} networkId
 * @param {*} prizePoolAddress
 * @param {*} setContractVersions
 * @param {*} setErrorState
 */
const getContractVersions = async (
  provider,
  networkId,
  prizePoolAddress,
  setContractVersions,
  setErrorState,
) => {
  const prizePoolByteCode = 'prizePoolByteCode' //await provider.getCode(prizePoolAddress)
  // console.log({ prizePoolByteCode })
  const prizePoolVersion = CONTRACT_VERSIONS[networkId][prizePoolByteCode]

  const providerNetwork = await provider.getNetwork()

  if (providerNetwork.chainId !== networkId) {
    setContractVersions({})
    return
  }

  if (!prizePoolVersion) {
    setErrorState({
      error: true,
      errorMessage: `Contract at ${prizePoolAddress} is unknown.`,
      view: <IncompatibleContract address={prizePoolAddress} />,
    })
    return
  }

  const prizePoolContract = contract(
    'prizePool',
    PrizePoolAbi,
    prizePoolAddress,
  )
  const prizePoolValues = await batch(
    provider,
    prizePoolContract.prizeStrategy(),
  )
  const prizeStrategyAddress = prizePoolValues.prizePool.prizeStrategy[0]
  // console.log({ prizeStrategyAddress })

  const prizeStrategyByteCode = 'prizeStrategyByteCode' //await provider.getCode(prizeStrategyAddress)
  // console.log({ prizeStrategyByteCode })

  const prizeStrategyVersion =
    CONTRACT_VERSIONS[networkId][prizeStrategyByteCode]

  if (!prizeStrategyVersion) {
    setErrorState({
      error: true,
      errorMessage: `Contract at ${prizeStrategyAddress} is unknown.`,
      view: <IncompatibleContract address={prizeStrategyAddress} />,
    })
    return
  }

  const contractVersions = {
    prizePool: prizePoolVersion,
    prizeStrategy: prizeStrategyVersion,
  }

  setContractVersions(contractVersions)
}

const IncompatibleContract = props => {
  const { address } = props
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [poolAddresses] = useAtom(poolAddressesAtom)
  const { prizePool } = poolAddresses
  const [network] = useAtom(networkAtom)

  return (
    <>
      <h1 className="text-orange-600">Warning</h1>
      <h3>
        Reference app v3.1.0 is incompatible with the contract at address{' '}
        {address} on {network.name}.
      </h3>
      <hr />
      <h4>Is {network.name} the correct network for this contract?</h4>
      <div className="flex flex-col mt-4">
        {network.name === 'rinkeby' && (
          <>
            Navigate to the Mainnet URL:
            <Button
              className="mt-4"
              color="secondary"
              href={`/pools/mainnet/${prizePool}`}
            >
              Go
            </Button>
          </>
        )}
        {network.name === 'mainnet' && (
          <>
            Navigate to the Rinkeby URL:
            <Button
              className="mt-4"
              color="secondary"
              href={`/pools/rinkeby/${prizePool}`}
            >
              Go
            </Button>
          </>
        )}
      </div>
    </>
  )
}
