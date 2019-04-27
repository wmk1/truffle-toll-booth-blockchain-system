const Regulator = artifacts.require('./Regulator.sol')
const TollBoothOperator = artifacts.require('./TolLBoothOperator.sol')

const depositWei = 100

module.exports = (deployer, network, accounts) => {
  return deployer.deploy(Regulator, {
    from: accounts[0]
  }).then(() => {
    return Regulator.deployed()
  }).then(regulator => {
    return regulator.createNewOperator(accounts[1], depositWei, { from: accounts[0] });
  }).then((transaction) => {
    return TollBoothOperator.at(transaction.logs[1].args.newOperator);
  }).then((tollBoothOperator) => {
    return tollBoothOperator.setPaused(false, { from: accounts[1] });
  })
}
