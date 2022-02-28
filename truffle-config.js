require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  mocha: {
    enableTimeouts: false,
    timeout: 14400000,
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gasPrice: 90000000000,
    },
    matic: {
      network_id: 137,
    },
    goerli: {
      network_id: 5,
      provider: () =>
        new HDWalletProvider(
          process.env.DEV_WALLET_PRIVATE_KEY,
          "https://goerli.infura.io/v3/" + process.env.INFURA_PROJECT_ID
        ),
      gas: 7500000,
      gasPrice: 5000000000,
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          process.env.DEV_WALLET_PRIVATE_KEY,
          "https://polygon-mumbai.infura.io/v3/" + process.env.INFURA_PROJECT_ID
        ),
      network_id: 80001,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.DEV_WALLET_PRIVATE_KEY,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_PROJECT_ID
        ),
      network_id: 3,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.DEV_WALLET_PRIVATE_KEY,
          "https://rinkeby.infura.io/v3/" + process.env.INFURA_PROJECT_ID
        ),
      network_id: 4,
    },
  },
  compilers: {
    solc: {
      version: "0.8.7",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  },
};
