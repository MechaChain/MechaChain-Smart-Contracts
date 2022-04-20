const Mechanium = artifacts.require("Mechanium");
const MechaniumPublicDistribution = artifacts.require(
  "MechaniumPublicDistribution"
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
      MechaniumPublicDistribution,
      mechaniumInstance.address
    );

    const publicInstance = await MechaniumPublicDistribution.deployed();
    await mechaniumInstance.transfer(
      publicInstance.address,
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
  await deployer.deploy(MechaniumPublicDistribution, mechaniumAdress);
  const instance = await MechaniumPublicDistribution.deployed();
  setDeployedContract(
    network,
    "MechaniumPublicDistribution",
    instance.address
  );
};
