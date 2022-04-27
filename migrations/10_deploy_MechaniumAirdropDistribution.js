const Mechanium = artifacts.require("Mechanium");
const MechaniumAirdropDistribution = artifacts.require(
  "MechaniumAirdropDistribution"
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
      MechaniumAirdropDistribution,
      mechaniumInstance.address
    );

    const airdropInstance = await MechaniumAirdropDistribution.deployed();
    await mechaniumInstance.transfer(
      airdropInstance.address,
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
  await deployer.deploy(MechaniumAirdropDistribution, mechaniumAdress);
  const instance = await MechaniumAirdropDistribution.deployed();
  setDeployedContract(
    network,
    "MechaniumAirdropDistribution",
    instance.address
  );
};
