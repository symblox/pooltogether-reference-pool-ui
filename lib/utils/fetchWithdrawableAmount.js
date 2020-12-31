import { ethers } from 'ethers'
import { batch, contract } from '@pooltogether/etherplex'

import svlxAbi from 'lib/abis/svlx'
import stakingAuRaAbi from 'lib/abis/stakingAuRa'
import { readProvider } from 'lib/services/readProvider'

export const fetchWithdrawableAmount = async (networkName, tokenAddress) => {
  const provider = await readProvider(networkName)
  let result = {
    withdrawable: ethers.utils.bigNumberify(0),
    stakingEpochDuration: 0,
  }

  try {
    const etherplexTokenContract = contract('token', svlxAbi, tokenAddress)
    const values = await batch(
      provider,
      etherplexTokenContract.getTotalWithdrawable().stakingAuRa(),
    )
    result.withdrawable = values.token.getTotalWithdrawable[0]
    const stakingAuRaContract = contract(
      'stakingAuRa',
      stakingAuRaAbi,
      values.token.stakingAuRa[0],
    )

    const values2 = await batch(
      provider,
      stakingAuRaContract.stakingEpochStartBlock(),
    )
    result.stakingEpochDuration = values2.stakingAuRa.stakingEpochStartBlock[0]
  } catch (e) {
    console.warn(e.message)
  } finally {
    return result
  }
}
