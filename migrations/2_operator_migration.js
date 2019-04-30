const Regulator = artifacts.require('./Regulator.sol')
const TollBoothOperator = artifacts.require('./TolLBoothOperator.sol')

const depositWei = 100

module.exports = (deployer, network, accounts) => deployer.then(async() => {
	const [regulatorOwner, operatorOwner] = accounts
  
	await deployer.deploy(Regulator, { from: regulatorOwner })

	const regulator = await Regulator.at(Regulator.address)
	const tx = await regulator.createNewOperator(operatorOwner, depositWei, { from: regulatorOwner })
	const op = await TollBoothOperator.at(tx.logs.find(l => l.event === 'LogTollBoothOperatorCreated').args.newOperator)
 	await op.setPaused(false, { from: operatorOwner })
})

