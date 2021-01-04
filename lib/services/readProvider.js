/**
  Retrieves a new provider specific to read.  The reason we separate the read and the writes is that the
  web3 providers on mobile dapps are extremely buggy; it's better to read the network through an INFURA
  JsonRpc endpoint.

  This function will first check to see if there is an injected web3.  If web3 is being injected, then a
  Ethers Web3Provider is instantiated to check the network.  Once the network is determined the Ethers
  getDefaultProvider function is used to create a provider pointing to the same network using an Infura node.
*/
import { ethers } from 'ethers'

const providerCache = {}

const getVlxProvider = (chainId, rpc) => {
  if (!providerCache[chainId]) {
    if (window?.web3)
      providerCache[chainId] = new ethers.providers.Web3Provider(
        window?.web3.currentProvider,
      )
    else providerCache[chainId] = new ethers.providers.JsonRpcProvider(rpc)
  }
  return providerCache[chainId]
}

export const readProvider = async function (networkName) {
  let provider

  if (!networkName) {
    return provider
  }

  if (/local/.test(networkName)) {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (/vlxmain/.test(networkName)) {
    provider = getVlxProvider(106, 'https://explorer.velas.com/rpc')
  } else if (/vlxtest/.test(networkName)) {
    provider = getVlxProvider(111, 'https://explorer.testnet.veladev.net/rpc')
  } else {
    provider = ethers.getDefaultProvider(
      networkName === 'mainnet' ? 'homestead' : networkName,
    )
  }

  const net = await provider.getNetwork()

  // If we're running against a known network
  if (net && net.name !== 'unknown') {
    if (!providerCache[net.name]) {
      providerCache[net.name] = new ethers.providers.InfuraProvider(
        net.name,
        process.env.NEXT_JS_INFURA_KEY,
      )
    }

    // use a separate Infura-based provider for consistent read api
    provider = providerCache[net.name]
  }

  return provider
}
