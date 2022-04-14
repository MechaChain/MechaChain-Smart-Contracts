const MechaLandsV1 = artifacts.require("MechaLandsV1");

const { time } = require("@openzeppelin/test-helpers");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

// Load utils
const { setDeployedContract } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    await deployProxy(MechaLandsV1, [], {
      deployer,
      initializer: "initialize",
    });

    return;
  }

  // For other deployments
  await deployProxy(MechaLandsV1, [], {
    deployer,
    initializer: "initialize",
  });
  const instance = await MechaLandsV1.deployed();
  setDeployedContract(network, "MechaLandsV1", instance.address);
};
