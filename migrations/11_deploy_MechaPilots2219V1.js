const MechaPilots2219V1 = artifacts.require("MechaPilots2219V1");

const { time } = require("@openzeppelin/test-helpers");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

// Load utils
const { setDeployedContract } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    await deployProxy(MechaPilots2219V1, [], {
      deployer,
      initializer: "initialize",
    });

    return;
  }

  // For other deployments
  await deployProxy(MechaPilots2219V1, [], {
    deployer,
    initializer: "initialize",
  });
  const instance = await MechaPilots2219V1.deployed();
  setDeployedContract(network, "MechaPilots2219V1", instance.address);
};
