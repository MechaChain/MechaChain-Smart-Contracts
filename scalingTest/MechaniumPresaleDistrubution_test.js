// Load modules
const web3Utils = require("web3-utils");
const { expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumPresaleDistribution = artifacts.require(
  "MechaniumPresaleDistribution"
);

// Load utils
const { getAmount, getBN } = require("../utils");

contract("MechaniumPresaleDistribution", (accounts) => {
  let instance, gasUsageOneClaim, gasUsageMultipleClaims;
  const estimatedGasPrice = getBN(50000000000); // = 50Gwei

  it("Smart contract should be deployed", async () => {
    instance = await MechaniumPresaleDistribution.deployed();
    assert(instance.address !== "");
  });

  it(`Admin should be able to allocate tokens to ${
    accounts.length - 1
  } users`, async () => {
    const amount = getAmount(1000);

    for (let i = 1; i <= accounts.length - 1; i++) {
      const _user = accounts[i];
      await instance.allocateTokens(_user, amount);
      const userBalance = await instance.balanceOf(_user);
      assert.equal(userBalance.cmp(amount), 0, "Allocated amout not valid");
    }
  });

  it("Admin should be able to start the vesting immediatly", async () => {
    await instance.startVesting();
    const hasStarted = await instance.hasVestingStarted();
    assert.equal(hasStarted, true, "Vesting should be started");
  });

  it("Admin should claim all users tokens", async () => {
    const oneClaimResponse = await instance.claimTokens(
      accounts[accounts.length - 1]
    );
    gasUsageOneClaim = oneClaimResponse.receipt.gasUsed;

    const multipleClaimsResponse = await instance.claimTokensForAll({
      from: owner,
    });
    gasUsageMultipleClaims = multipleClaimsResponse.receipt.gasUsed;

    for (let i = 1; i < accounts.length - 1; i++) {
      const _user = accounts[i];
      await expectRevert(
        instance.claimTokens(_user),
        "No token can be unlocked for this account"
      );
    }
  });

  it("ClaimAll gas usage must be lower than claim one", async () => {
    // Calculate price for one claim
    const gasWeiOneClaim = getBN(gasUsageOneClaim).mul(estimatedGasPrice);
    const priceOneClaim = web3Utils.fromWei(gasWeiOneClaim, "ether");
    console.log(`One claim price : ${priceOneClaim} MATIC`);
    const priceMultipleOneClaims =
      parseFloat(priceOneClaim) * (accounts.length - 2);
    console.log(
      `One claim price x ${
        accounts.length - 2
      } : ${priceMultipleOneClaims} MATIC`
    );

    // Calculate price for claimForAll
    const gasWeiMultipleClaims = getBN(gasUsageMultipleClaims).mul(
      estimatedGasPrice
    );
    const priceMultipleClaims = web3Utils.fromWei(
      gasWeiMultipleClaims,
      "ether"
    );
    console.log(
      `Multiple claims function price : ${priceMultipleClaims} MATIC`
    );

    assert(
      parseFloat(priceMultipleClaims) < parseFloat(priceMultipleOneClaims)
    );
  });
});
