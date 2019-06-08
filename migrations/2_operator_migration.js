const Regulator = artifacts.require('./Regulator.sol')
const TollBoothOperator = artifacts.require('./TollBoothOperator.sol')

const depositWei = 100

module.exports = (deployer, network, accounts) => deployer.then(async() => {
	const [regulatorOwner, operatorOwner] = accounts
	await deployer.deploy(Regulator, { from: regulatorOwner })

	const regulator = await Regulator.at(Regulator.address)
	console.log('regulator hehe', regulator)
	const tx = await regulator.createNewOperator(operatorOwner, depositWei, { from: regulatorOwner })
	const op = await TollBoothOperator.at(tx.logs.find(l => l.event === 'LogTollBoothOperatorCreated').args.newOperator)
	console.log('op', op)
	await op.setPaused(false, { from: operatorOwner })
	
	await deployer.deploy(TollBoothOperator, true, 100, accounts[1])
})

