const Mechanium = artifacts.require("Mechanium");
const MechaniumPresaleDistribution = artifacts.require("MechaniumPresaleDistribution");
const MechaniumGrowthVestingWallet = artifacts.require("MechaniumGrowthVestingWallet");
const StakingPool = artifacts.require("StakingPool");

// Load utils
const { getAmount } = require('../utils');

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];

  // Mechanium
  await deployer.deploy(Mechanium, owner);
  const mechaniumInstance = await Mechanium.deployed();

  // MechaniumPresaleDistribution
  await deployer.deploy(MechaniumPresaleDistribution, mechaniumInstance.address);
  const presaleInstance = await MechaniumPresaleDistribution.deployed();
  await mechaniumInstance.transfer(presaleInstance.address, getAmount(10000000)); // 10 000 000 $MECHA

  // StakingPool
  await deployer.deploy(StakingPool, mechaniumInstance.address);
  
  // MechaniumGrowthVestingWallet
  await deployer.deploy(MechaniumGrowthVestingWallet, mechaniumInstance.address);
  const growthWalletInstance = await MechaniumGrowthVestingWallet.deployed();
  await mechaniumInstance.transfer(growthWalletInstance.address, getAmount(8000000)); // 8 000 000 $MECHA
  await mechaniumInstance.transfer(presaleInstance.address, getAmount(10000000));
};