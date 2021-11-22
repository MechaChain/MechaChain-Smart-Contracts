const Mechanium = artifacts.require("Mechanium");
const MechaniumPresaleDistribution = artifacts.require("MechaniumPresaleDistribution");

// Load utils
const { getAmount } = require('../utils');

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  await deployer.deploy(Mechanium, owner);
  const mechaniumInstance = await Mechanium.deployed();
  await deployer.deploy(MechaniumPresaleDistribution, mechaniumInstance.address);
  const presaleInstance = await MechaniumPresaleDistribution.deployed();
  await mechaniumInstance.transfer(presaleInstance.address, getAmount(10000000));
};