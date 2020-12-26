export function formatEtherscanAddressUrl(address, networkId) {
  var baseUrl
  switch (networkId) {
    case 3:
      baseUrl = 'https://ropsten.etherscan.io'
      break
    case 4:
      baseUrl = 'https://rinkeby.etherscan.io'
      break
    case 42:
      baseUrl = 'https://kovan.etherscan.io'
      break
    case 106:
      baseUrl = 'https://explorer.velas.com'
      break
    case 111:
      baseUrl = 'https://explorer.testnet.veladev.net'
      break
    default:
      baseUrl = 'https://etherscan.io'
      break
  }
  return `${baseUrl}/address/${address}`
}
