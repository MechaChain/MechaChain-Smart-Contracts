// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");

// Load utils
const { getAmount, getBN, getBNRange, gasTracker } = require("../utils");

contract("MechaLandsV1", (accounts) => {
  const [owner, ...users] = accounts;
  let instance;
  /**
   * ========================
   *          TESTS
   * ========================
   */

  it("MechaLandsV1 should be deployed", async () => {
    instance = await MechaLandsV1.new();
    assert(instance.address !== "");

    // Add cost
    gasTracker.addCost("Deployment", { tx: instance.transactionHash });
  });

  it("GasTest1", async () => {
    const tx = await instance.gasTest1();
    gasTracker.addCost("GasTest1", tx);
  });

  it("GasTest2", async () => {
    const tx = await instance.gasTest2();
    gasTracker.addCost("GasTest2", tx);
  });

  it("Get stats on gas", async () => {
    gasTracker.consoleStats();
  });
});
