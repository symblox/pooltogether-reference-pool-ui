export function nameToChainId(networkName) {
  switch (networkName) {
    case 'vlxmain':
      return 106
    case 'vlxtest':
      return 111
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    case 'localhost':
      return 31337
    default:
      return 1
  }
}
