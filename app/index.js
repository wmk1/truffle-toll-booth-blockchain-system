import Web3 from "web3"
import contract from "truffle-contract"

import regulatorArtifacts from '../build/contracts/Regulator.json'
import tollBoothOperatorArtifacts from '../build/contracts/TollBoothOperator.json'

const App = {
  web3: null,
  accounts: null,
  regulator: null,
  tollBoothOperator: null,
  regulatorInstance: null,
  vehicles: [],
  operators: [],
  tollBoothOperator: null,
  entryExitLogs: [],

  start: async () => {
    const { web3 } = App
    try {
      App.accounts = await web3.eth.getAccounts()
      const regulatorContract = contract(regulatorArtifacts)
      regulatorContract.setProvider(App.web3.currentProvider)
      App.regulator = await regulatorContract.deployed()
      const tollBoothOperatorContract = contract(tollBoothOperatorArtifacts)
      tollBoothOperatorContract.setProvider(App.web3.currentProvider)
      App.tollBoothOperator = await tollBoothOperatorContract.deployed()
      document.getElementById("regulatorOwner").innerHTML = await App.regulator.getOwner()
      document.getElementById("tollBoothOperatorOwner").innerHTML = await App.tollBoothOperator.getOwner()
    } catch (error) {
        App.setStatus(error)
        console.error(error)
    }
  },

  checkBalance: async () => {
    const recipient = document.getElementById('individualVehicleAddress').value
    const balance = await App.web3.eth.getBalance(recipient)
    document.getElementById('addressBalance').innerHTML = balance + ' weis.'
  },

  changeVehicleType: async () => {
    let vehicleType = parseInt(document.getElementById("vehicleType").value)
    let recipient = document.getElementById("address").value
    App.setStatus("Changing vehicle type...")
    const result = await App.regulator.setVehicleType(recipient, vehicleType, {
      from: App.accounts[0]
    })    
    App.setStatus('Changed vehicle type to ' + vehicleType + ' for recipient: ' + recipient)
    await App.getVehicles()
  },

  setRoutePrice: async () => {
    const entryBooth = document.getElementById('entryBooth').value
    const exitBooth = document.getElementById('exitBooth').value
    const amount = parseInt(document.getElementById('routePriceNewValue').value)

    const request = await App.tollBoothOperator.setRoutePrice(entryBooth, exitBooth, amount, {
      from: App.accounts[1]
    })
    console.log('request in function', request.logs)
    App.setStatus('Route price changed to ' + amount + ' for route from ' + entryBooth + ' to ' + exitBooth)
  },

  reportVehicleExit: async() => {
    const individualVehicleAddress = document.getElementById('individualVehicleAddress').value
    const addressHashed = await App.web3.utils.soliditySha3(individualVehicleAddress)
    console.log('address hashed', addressHashed)
    const request = App.tollBoothOperator.reportExitRoad(addressHashed, {
      from: App.accounts[0]
    })
    App.setStatus("Vehicle " + individualVehicleAddress + " exited from road successfully ")
  },

  

  getVehicles: async() => {
      const events = await App.regulator.getPastEvents({
        fromBlock: '0',
        toBlock: 'latest'
      })
      events.map(data => {
       App.vehicles.push({
          sender: data.returnValues.sender,
          vehicleType: data.returnValues.vehicleType
        })
      })
      console.log('events after vehicle set', events)
 //     console.log('vehicles array', App.vehicles)
  },

  createNewOperator: async() => {
    const operatorAddress = document.getElementById('newOperatorAddress').value
    const operatorDeposit = parseInt(document.getElementById('newOperatorDeposit').value)
    await App.regulator.createNewOperator(operatorAddress, operatorDeposit, {
      from: App.accounts[0]
    })
    const events = await App.regulator.getPastEvents('LogTollBoothOperatorCreated', {
      fromBlock: '0',
      toBlock: 'latest'
    })
    events.map(data => {
      App.operators.push({
        
      })
    })
  },

  addTollBooth: async() => {
    const tollBoothAddress = document.getElementById('createdTollBooth').value
    await App.tollBoothOperator.addTollBooth(tollBoothAddress, {
      from: App.accounts[0]
    })
  },

  setMultiplier: async() => {
    const newMultiplier = parseInt(document.getElementById('newMultiplier').value)
    const vehicleType = parseInt(document.getElementById('vehicleType').value)
    await App.tollBoothOperator.setMultiplier(newMultiplier, vehicleType, {
      from: App.accounts[0]
    })
  },

  makeDeposit: async() => {
    const depositValue = parseInt(document.getElementById('deposit').value)
    await App.tollBoothOperator.setDeposit(depositValue, {
      from: App.accounts[0]
    })
    App.setStatus('')
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
