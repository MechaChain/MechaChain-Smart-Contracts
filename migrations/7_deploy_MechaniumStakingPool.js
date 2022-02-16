const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

const { time } = require("@openzeppelin/test-helpers");

// Load utils
const { getBN, getAmount } = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();

    await deployer.deploy(
      MechaniumStakingPool,
      mechaniumInstance.address,
      mechaniumInstance.address,
      (await time.latestBlock()) + 50,
      time.duration.days(30),
      time.duration.days(300),
      getBN(1),
      getBN(2),
      time.duration.days(30),
      getAmount(1)
    );

    const mechaniumStakingPoolInstance = await MechaniumStakingPool.deployed();

    await mechaniumInstance.transfer(
      mechaniumStakingPoolInstance.address,
      getAmount(2000000)
    );

    return;
  }

  // For other deployments
  const mechaniumAdress = getDeployedContract(
    network,
    "Mechanium",
    true
  ).address;
  await deployer.deploy(MechaniumStakingPool, mechaniumAdress);
  const instance = await MechaniumStakingPool.deployed();
  setDeployedContract(network, "MechaniumStakingPool", instance.address);
};
