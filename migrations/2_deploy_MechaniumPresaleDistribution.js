const Mechanium = artifacts.require("Mechanium");
const MechaniumPresaleDistribution = artifacts.require(
  "MechaniumPresaleDistribution"
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
      MechaniumPresaleDistribution,
      mechaniumInstance.address
    );

    const presaleInstance = await MechaniumPresaleDistribution.deployed();
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
  await deployer.deploy(MechaniumPresaleDistribution, mechaniumAdress);
  const instance = await MechaniumPresaleDistribution.deployed();
  setDeployedContract(
    network,
    "MechaniumPresaleDistribution",
    instance.address
  );
};
