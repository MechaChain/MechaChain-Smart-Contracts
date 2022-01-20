const Mechanium = artifacts.require("Mechanium");
const MechaniumBis = artifacts.require("MechaniumBis");
const MechaniumGrowthVestingWallet = artifacts.require(
  "MechaniumGrowthVestingWallet"
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
    const mechaniumBisInstance = await MechaniumBis.deployed();

    await deployer.deploy(
      MechaniumGrowthVestingWallet,
      mechaniumInstance.address
    );
    const growthWalletInstance = await MechaniumGrowthVestingWallet.deployed();
    await mechaniumInstance.transfer(
      growthWalletInstance.address,
      getAmount(8000000)
    ); // 8 000 000 $MECHA
    await mechaniumBisInstance.transfer(
      growthWalletInstance.address,
      getAmount(1000000)
    ); // 1 000 000 $MECHABIS

    return;
  }

  // For other deployments
  const mechaniumAdress = getDeployedContract(
    network,
    "Mechanium",
    true
  ).address;
  await deployer.deploy(MechaniumGrowthVestingWallet, mechaniumAdress);
  const instance = await MechaniumGrowthVestingWallet.deployed();
  setDeployedContract(
    network,
    "MechaniumGrowthVestingWallet",
    instance.address
  );
};
