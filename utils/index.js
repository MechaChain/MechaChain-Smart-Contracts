// Load modules
const { BN } = require('@openzeppelin/test-helpers');

function getAmount(value) {
  return (new BN(`${value}`)).mul(new BN(`${10 ** 18}`));
}

function getBN(value) {
  return new BN(`${value}`);
}

module.exports = {
  getAmount,
  getBN
};