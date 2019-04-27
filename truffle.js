// Allows us to use ES6 in our migrations and tests.

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gasLimit: 10000000
    }
  },
  solc: {
    settings: {
      optimizer: {
      enabled: true,
      runs: 200
      }
    },
    version: '0.4.25'
  }
}
