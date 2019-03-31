import {default as Web3} from 'web3'

let getWeb3 = () => {
  window.addEventListener('load', () => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
    let results
    let web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3: web3
      }

      console.log('Injected web3 detected.')

      return results
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      let provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')

      web3 = new Web3(provider)
      results = {
        web3: web3
      }

      console.log('No web3 instance injected, using Local web3.')

      return results
    }
  })
}

export default getWeb3
