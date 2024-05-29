const MechaModulesV1 = artifacts.require("MechaModulesV1");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

// Load utils
const { setDeployedContract } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    await deployProxy(MechaModulesV1, [], {
      deployer,
      initializer: "initialize",
    });

    return;
  }

  // For other deployments
  await deployProxy(MechaModulesV1, [], {
    deployer,
    initializer: "initialize",
  });
  const instance = await MechaModulesV1.deployed();
  setDeployedContract(network, "MechaModulesV1", instance.address);
};
