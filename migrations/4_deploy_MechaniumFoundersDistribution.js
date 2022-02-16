const Mechanium = artifacts.require("Mechanium");
const MechaniumFoundersDistribution = artifacts.require(
  "MechaniumFoundersDistribution"
);

// Load utils
const {
  getAmount,
  getDeployedContract,
  setDeployedContract,
} = require("../utils");

module.exports = async function (deployer, network, accounts) {
  // For local development
  if (network === "development") {
    const mechaniumInstance = await Mechanium.deployed();

    await deployer.deploy(
      MechaniumFoundersDistribution,
      mechaniumInstance.address
    );
    const mechaniumFoundersInstance =
      await MechaniumFoundersDistribution.deployed();
    await mechaniumInstance.transfer(
      mechaniumFoundersInstance.address,
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
  await deployer.deploy(MechaniumFoundersDistribution, mechaniumAdress);
  const instance = await MechaniumFoundersDistribution.deployed();
  setDeployedContract(
    network,
    "MechaniumFoundersDistribution",
    instance.address
  );
};
