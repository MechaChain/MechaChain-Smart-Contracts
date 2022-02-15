const Mechanium = artifacts.require("Mechanium");
const MechaniumBis = artifacts.require("MechaniumBis");

// Load utils
const { setDeployedContract, getDeployedContract } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const owner = accounts[0];
    // Mechanium
    await deployer.deploy(Mechanium, owner);
    await deployer.deploy(MechaniumBis, owner);
    const instance = await Mechanium.deployed();

    return;
  }

  // For other deployments
  await deployer.deploy(
    Mechanium,
    "0xf5905be2b83eBAE06214a7D73faAD7A83dc6f3ad"
  );

  const instance = await Mechanium.deployed();
  setDeployedContract(network, "Mechanium", instance.address);
};
