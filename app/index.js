import Web3 from "web3"
import getWeb3 from "./scripts/getWeb3"

import regulatorArtifacts from '../build/contracts/Regulator.json'
import tollBoothOperatorArtifacts from '../build/contracts/TollBoothOperator.json'

const App = {
  web3: null,
  accounts: null,
  regulator: null,
  tollBoothOperator: null,

  start: async () => {
    const { web3 } = App
    try {
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = regulatorArtifacts.networks[networkId]
      App.accounts = await web3.eth.getAccounts()
      console.log('App accounts', App.accounts)
      console.log(deployedNetwork)
      App.regulator = new web3.eth.Contract(
        regulatorArtifacts.abi,
        deployedNetwork.address
      ),
      App.tollBoothOperator = new web3.eth.Contract(
        tollBoothOperatorArtifacts.abi,
        deployedNetwork.address
      )
      console.log(App.regulator)
    } catch (error) {
        App.setStatus(error)
        console.error(error)
    }
  },

  checkBalance: async () => {
    const recipient = document.getElementById('individualVehicleAddress').value
  },

  changeVehicleType: async () => {
    const { setVehicleType } = App.regulator.methods
    console.log('set vehicle type', setVehicleType)
    
    let vehicleType = parseInt(document.getElementById("vehicleType").value)
    let recipient = document.getElementById("address").value
    console.log('checking values', vehicleType, recipient)
    App.setStatus("Changing vehicle type...")
    await setVehicleType(vehicleType, recipient).send({ from: App.accounts[0] }) 
  },

  updateRoutePrice: async () => {
    const { setRoutePrice } = App.regulator.methods

    const entryBooth = document.getElementById('entryBooth').value
    const exitBooth = document.getElementById('exitBooth').value
    const amount = parseInt(document.getElementById('routePriceAmount').value)

    await setRoutePrice(entryBooth, exitBooth, amount).send({ from: this.account })
  },

  reportVehicleExit: async() => {
    const { reportExitRoad } = this.tollBoothOperator.methods
    const individualVehicleAddress = document.getElementById('individualVehicleAddress').value
    await reportExitRoad(individualVehicleAddress).send({ from: this.account })
  },

  setStatus: async (message) => {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  createNewOperator: async() => {
    const { createNewOperator } = App.regulator.methods
    const operatorAddress = document.getElementById('receiver').value
    const operatorDeposit = parseInt(document.getElementById('operatorDeposit').value)
  }
}

window.App = App

window.addEventListener('load', () => {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum)
    window.ethereum.enable() // get permission to access accounts
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live',
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:8545'),
    )
  }
  App.start()
})
