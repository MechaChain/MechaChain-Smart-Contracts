module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    matic: {
      network_id: 137,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    polygonscan: "FMH5P5I1PNDR1W39T2THIBZ3TZVQM398A4",
  },
};
