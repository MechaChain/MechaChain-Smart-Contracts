const Mechanium = artifacts.require("Mechanium");
const MechaniumPresaleRewardsDistribution = artifacts.require(
  "MechaniumPresaleRewardsDistribution"
);

// Load utils
const {
  getAmount,
  setDeployedContract,
  getDeployedContract,
} = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();

    await deployer.deploy(
      MechaniumPresaleRewardsDistribution,
      mechaniumInstance.address
    );

    const presaleInstance = await MechaniumPresaleRewardsDistribution.deployed();
    await mechaniumInstance.transfer(
      presaleInstance.address,
      getAmount(10000000)
    ); // 10 000 000 $MECHA

    return;
  }

  // For other deployments
  const mechaniumAdress = getDeployedContract(
    network,
    "Mechanium",
    true
  ).address;
  await deployer.deploy(MechaniumPresaleRewardsDistribution, mechaniumAdress);
  const instance = await MechaniumPresaleRewardsDistribution.deployed();
  setDeployedContract(
    network,
    "MechaniumPresaleRewardsDistribution",
    instance.address
  );
};
