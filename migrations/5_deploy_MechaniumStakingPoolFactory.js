const Mechanium = artifacts.require("Mechanium");
const MechaniumBis = artifacts.require("MechaniumBis");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);

// Load utils
const { getAmount } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();
    const mechaniumBisInstance = await MechaniumBis.deployed();

    await deployer.deploy(
      MechaniumStakingPoolFactory,
      mechaniumInstance.address
    );

    const mechaniumStakingPoolFactoryInstance =
      await MechaniumStakingPoolFactory.deployed();

    await mechaniumInstance.transfer(
      mechaniumStakingPoolFactoryInstance.address,
      getAmount(2000000)
    );

    await mechaniumBisInstance.transfer(
      mechaniumStakingPoolFactoryInstance.address,
      getAmount(1000000)
    );

    return;
  }

  // For other deployments
  const mechaniumAdress = getDeployedContract(
    network,
    "Mechanium",
    true
  ).address;
  await deployer.deploy(MechaniumStakingPoolFactory, mechaniumAdress);
  const instance = await MechaniumStakingPoolFactory.deployed();
  setDeployedContract(network, "MechaniumStakingPoolFactory", instance.address);
};
