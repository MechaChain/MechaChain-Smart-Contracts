// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");

// Load artifacts
const MechaLandsV1 = artifacts.require("MechaLandsV1");
const MechaLandsV2 = artifacts.require("MechaLandsV2");

// Load utils
const {
  getAmount,
  getBN,
  getBNRange,
  gasTracker,
  getSignature,
} = require("../utils");
const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

contract("MechaLandsV2", async (accounts) => {
  const [owner, distributor, ...users] = accounts;

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it(`MechaLandsV1 should be deployed`, async () => {
    testStartTime = await time.latest();

    //instance = await MechaLandsV1.deployed();
    instance = await deployProxy(MechaLandsV1, [], {
      initializer: "initialize",
    });
    assert(instance.address !== "");

    const version = await instance.version();
    assert.equal(version.toString(), "1", "Bad version");
    chainid = await instance.chainid();
    chainid = chainid.toString();
  });

  describe("\n UPGRADE CONTRACT", () => {
    it(`Upgrade Smart Contract`, async () => {
      let instance2 = await upgradeProxy(instance.address, MechaLandsV2);

      assert.equal((await instance2.version()).toString(), "2", `Bad version`);
    });
  });

  describe("\n GAS STATS", () => {
    it(`Get stats on gas`, async () => {
      // Get deployment cost
      const newInstance = await MechaLandsV1.new();
      await gasTracker.addCost("Deployment", {
        tx: newInstance.transactionHash,
      });

      gasTracker.consoleStats();
    });
  });
});
