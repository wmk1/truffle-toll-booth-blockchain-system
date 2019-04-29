// Allows us to use ES6 in our migrations and tests.

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  },
  compilers: {
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
}
