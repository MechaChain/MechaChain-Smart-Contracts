const Mechanium = artifacts.require("Mechanium");
const MechaniumBis = artifacts.require("MechaniumBis");
const MechaniumPresaleDistribution = artifacts.require(
  "MechaniumPresaleDistribution"
);
const MechaniumGrowthVestingWallet = artifacts.require(
  "MechaniumGrowthVestingWallet"
);
const MechaniumFoundersDistribution = artifacts.require(
  "MechaniumFoundersDistribution"
);
const StakingPool = artifacts.require("StakingPool");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();

    await deployer.deploy(StakingPool, mechaniumInstance.address);

    return;
  }
};
