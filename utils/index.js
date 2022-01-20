// Load modules
const { BN } = require("@openzeppelin/test-helpers");
const fs = require("fs");

let deployedContractsList = require("../DEPLOYED_CONTRACTS.json");

function getAmount(value) {
  return new BN(`${value}`).mul(new BN(`${10 ** 18}`));
}

function getBN(value) {
  return new BN(`${value}`);
}

function getDeployedContract(network, name, trowError = false) {
  network = network.replace("-fork", ""); // avoid migrations dry-run (simulation)
  if (
    !deployedContractsList[network] ||
    !deployedContractsList[network][name]
  ) {
    if (trowError) {
      throw `"${name}" contract doesn't exist in the ${network} network, please deploy it or add it in DEPLOYED_CONTRACTS.json`;
    }
    return null;
  }
  return deployedContractsList[network][name];
}

function setDeployedContract(network, name, address) {
  if (network.includes("-fork")) {
    // avoid migrations dry-run (simulation)
    return;
  }
  let action = "Added";
  if (deployedContractsList[network] && deployedContractsList[network][name]) {
    action = "Updated";
  }

  if (!deployedContractsList[network]) {
    deployedContractsList[network] = {};
  }

  deployedContractsList[network][name] = {
    address: address,
    date: new Date().toLocaleString("en-GB", { timeZone: "UTC" }),
  };

  let data = JSON.stringify(deployedContractsList, null, 2);
  fs.writeFileSync("DEPLOYED_CONTRACTS.json", data);
  console.log(
    `${action} "${name}" contract for the ${network} network with address ${address}`
  );
}

module.exports = {
  getAmount,
  getBN,
  getDeployedContract,
  setDeployedContract,
};
