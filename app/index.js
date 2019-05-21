import Web3 from "web3"


import regulatorArtifacts from '../build/contracts/Regulator.json'
import tollBoothOperatorArtifacts from '../build/contracts/TollBoothOperator.json'

const App = {
  web3: null,
  accounts: null,
  regulator: null,
  tollBoothOperator: null,
  regulatorInstance: null,

  start: async () => {
    const { web3 } = App
    try {
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = regulatorArtifacts.networks[networkId]
      App.accounts = await web3.eth.getAccounts()
      web3.eth.defaultAccount = App.accounts[0]
      App.regulator = await new web3.eth.Contract(
        regulatorArtifacts.abi,
        deployedNetwork.address
      ),
      App.tollBoothOperator = new web3.eth.Contract(
        tollBoothOperatorArtifacts.abi,
        deployedNetwork.address
      )
    } catch (error) {
        App.setStatus(error)
        console.error(error)
    }
  },

  checkBalance: async () => {
    const recipient = document.getElementById('individualVehicleAddress').value
  },

  refreshBalance: async function() {
    //const balance = await getBalance(this.account).call()

    const balanceElement = document.getElementsByClassName("balance")[0]
    balanceElement.innerHTML = balance
  },

  changeVehicleType: async () => {
    const { setVehicleType } = App.regulator.methods
    let vehicleType = parseInt(document.getElementById("vehicleType").value)
    let recipient = document.getElementById("address").value
    App.setStatus("Changing vehicle type...")
    await setVehicleType(recipient, vehicleType).send({ from: App.accounts[0]})
  },

  updateRoutePrice: async () => {
    const { setRoutePrice } = App.regulator.methods

    const entryBooth = document.getElementById('entryBooth').value
    const exitBooth = document.getElementById('exitBooth').value
    const amount = parseInt(document.getElementById('routePriceAmount').value)

    await setRoutePrice(entryBooth, exitBooth, amount).send({ from: this.account })
  },

  reportVehicleExit: async() => {
    const { reportExitRoad } = App.tollBoothOperator.methods
    const individualVehicleAddress = document.getElementById('individualVehicleAddress').value
    await reportExitRoad(individualVehicleAddress).send({ from: this.account })
  },

  

  createNewOperator: async() => {
    const { createNewOperator } = App.regulator.methods
    const operatorAddress = document.getElementById('receiver').value
    const operatorDeposit = parseInt(document.getElementById('operatorDeposit').value)

    await createNewOperator(operatorAddress, operatorDeposit)
  },
  
 setStatus: async (message) => {
  const status = document.getElementById('status')
  status.innerHTML = message
},
} 



window.App = App

window.addEventListener('load', function() {
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
