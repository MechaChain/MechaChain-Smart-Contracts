const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require("MechaniumStakingPoolFactory");

// Load utils
const {
  getAmount,
} = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();

    await deployer.deploy(MechaniumStakingPoolFactory, mechaniumInstance.address);

    const mechaniumStakingPoolFactoryInstance = await MechaniumStakingPoolFactory.deployed();

    await mechaniumInstance.transfer(
      mechaniumStakingPoolFactoryInstance.address,
      getAmount(2000000)
    );

    return;
  }
};
