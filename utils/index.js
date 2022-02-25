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

const getRange = (x1, y1, x2, y2, a) => y1 + ((a - x1) * (y2 - y1)) / (x2 - x1);
const getBNRange = (x1, y1, x2, y2, a) =>
  y1.add(a.sub(x1).mul(y2.sub(y1)).div(x2.sub(x1)));

const getRandom = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// gasTracker;
const costs = [];
let gasPrice = 0;
const addCost = async (action, data) => {
  const tx = await web3.eth.getTransaction(data.tx);
  gasPrice = tx.gasPrice;
  const price = data.receipt.gasUsed * Number(gasPrice);

  const priceETH = web3.utils.fromWei(`${price}`, "ether");

  const cost = {
    action,
    gasUsed: data.receipt.gasUsed,
    gasPrice: gasPrice,
    price,
    priceETH,
  };
  costs.push(cost);
};
const getStats = () => {
  const stats = costs.reduce((prev, curr) => {
    // Init
    prev[curr.action] = prev[curr.action] || {
      totalCalls: 0,
      totalGasUsed: 0,
      avgGasUsed: 0,
      totalPrice: 0,
      totalPriceETH: 0,
      avgPriceETH: 0,
      minGasUsed: curr.gasUsed,
      minPriceETH: curr.priceETH,
      maxGasUsed: 0,
      maxPriceETH: 0,
    };

    // Calcul
    const value = prev[curr.action];

    value.totalCalls++;
    value.totalGasUsed += curr.gasUsed;
    value.totalPrice += curr.price;
    value.totalPriceETH = web3.utils.fromWei(`${value.totalPrice}`, "ether");
    value.avgPriceETH = web3.utils.fromWei(
      `${Math.round(value.totalPrice / value.totalCalls)}`,
      "ether"
    );
    value.avgGasUsed = Math.round(value.totalGasUsed / value.totalCalls);

    if (curr.gasUsed < value.minGasUsed) {
      value.minGasUsed = curr.gasUsed;
      value.minPriceETH = curr.priceETH;
    }

    if (curr.gasUsed > value.maxGasUsed) {
      value.maxGasUsed = curr.gasUsed;
      value.maxPriceETH = curr.priceETH;
    }

    return prev;
  }, {});

  return Object.keys(stats)
    .sort()
    .reduce((r, k) => ((r[k] = stats[k]), r), {}); // sort stats by index
};
const consoleStats = () => {
  console.log("\n\t================== GAS STATS ==================");

  console.log(
    `\t=> Network Gas Price = ${web3.utils.fromWei(
      getBN(gasPrice),
      "gwei"
    )} Gwei`
  );

  console.table(getStats(), [
    "totalCalls",
    "totalGasUsed",
    "avgGasUsed",
    //"totalPriceETH",
    "avgPriceETH",
    "minGasUsed",
    "minPriceETH",
    "maxGasUsed",
    "maxPriceETH",
  ]);
};

module.exports = {
  gasTracker: {
    addCost,
    getStats,
    consoleStats,
  },
  getAmount,
  getBN,
  getDeployedContract,
  setDeployedContract,
  getRange,
  getBNRange,
  getRandom,
};
