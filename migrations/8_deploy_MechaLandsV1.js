const MechaLandsV1 = artifacts.require("MechaLandsV1");

const { time } = require("@openzeppelin/test-helpers");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

// Load utils
const { getBN, getAmount, getDeployedContract } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    await deployProxy(MechaLandsV1, [], {
      deployer,
      initializer: "initialize",
    });
  }

  // For other deployments
};
