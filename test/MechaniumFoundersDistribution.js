// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumFoundersDistribution = artifacts.require(
  "MechaniumFoundersDistribution"
);

// Load utils
const { getAmount, getBN } = require("../utils");

contract("MechaniumFoundersDistribution", (accounts) => {
  const [owner, allocator, user] = accounts;
  let instance, token, ALLOCATOR_ROLE, DEFAULT_ADMIN_ROLE, withdraw;

  it("Smart contract should be deployed", async () => {
    instance = await MechaniumFoundersDistribution.deployed();
    assert(instance.address !== "");
    token = await Mechanium.deployed();
    DEFAULT_ADMIN_ROLE = await instance.DEFAULT_ADMIN_ROLE();
    ALLOCATOR_ROLE = await instance.ALLOCATOR_ROLE();
  });

  it("Admin should set allocator role", async () => {
    await instance.grantRole(ALLOCATOR_ROLE, allocator);
    const hasAllocatorRole = await instance.hasRole(ALLOCATOR_ROLE, allocator);
    assert(hasAllocatorRole);
  });

  it("Allocator should allocate to user", async () => {
    const amount = getAmount(1000);

    await instance.allocateTokens(user, amount);

    const balance = await instance.balanceOf(user);

    assert.equal(balance.cmp(amount), 0, "Withdraw must be locked");
  });

  it("User balance should encrease when allocated tokens", async () => {
    await time.increase(time.duration.days(30));
    const oldBalance = await instance.balanceOf(user);

    const amount = getAmount(1000);

    await instance.allocateTokens(user, amount);

    const newBalance = await instance.balanceOf(user);

    assert.equal(
      newBalance.cmp(oldBalance.add(amount)),
      0,
      "Withdraw must be locked"
    );
  });

  it("Total unlockable tokens must be 20% of the first allocation (1 year after the first allocation)", async () => {
    await time.increase(time.duration.days(360 - 30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(1000 * 0.2);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Total unlockable tokens must be 20% of the two allocations (1 year after the seconds allocation)", async () => {
    await time.increase(time.duration.days(30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount((1000 + 1000) * 0.2);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Total unlockable tokens must be 40% of the first allocation + 20% of the seconds (1 year + 6 month)", async () => {
    await time.increase(time.duration.days(180 - 30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(1000 * 0.2 + 1000 * 0.4);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Total unlockable tokens must be 100% of all allocation", async () => {
    await time.increase(time.duration.days(30 + 180 * 3));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(2000);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  /*it('Total unlockable tokens must be 100% of the first allocation', async () => {
    const timeBeforeStarting = await instance.timeBeforeStarting();
    await time.increase(timeBeforeStarting.add(getBN(1000)));
    const vpc = await instance.vestingPerClock();
    const vct = await instance.vestingClockTime();

    const currentTime = await time.latest();
    const allocIndexes = await instance.allocationsOf(user);
    const totalUnlockableTokens = await instance.unlockableTokens(user);

    let exptectedTotalTokens = getBN(0);

    for (let i in allocIndexes) {
      const allocTime = await instance.allocationStartingTime(i);
      const allocTokens = await instance.allocationTokens(i);
      let allocTokensForPeriod = allocTokens.div(getBN(100).div(vpc));
      const diff = currentTime.sub(allocTime);
      if (diff.lt(getBN(0))) {
        allocTokensForPeriod = getBN(0);
      }
      const passedPeriod = diff.div(vct).add(getBN(1));
      const expectedTokens = allocTokensForPeriod.mul(passedPeriod);
      exptectedTotalTokens = exptectedTotalTokens.add(expectedTokens);
    }

    assert.equal(totalUnlockableTokens.cmp(exptectedTotalTokens), 0, 'Unlockable tokens not valid');
  });*/

  it("User should be able to claim unlockable tokens", async () => {
    const totalUnlockableTokens = await instance.unlockableTokens(user);

    await instance.claimTokens(user);

    const tokensBalance = await token.balanceOf(user);

    assert.equal(
      tokensBalance.cmp(totalUnlockableTokens),
      0,
      "Unlockable tokens not claimed"
    );
  });

  it("Allocator should allocate new tokens to user", async () => {
    const amount = getAmount(1000);

    await instance.allocateTokens(user, amount);

    const balance = await instance.balanceOf(user);

    assert.equal(balance.cmp(amount), 0, "Withdraw must be locked");
  });

  it("Total unlockable tokens must be 20% of the new allocation (1 year after the new allocation)", async () => {
    await time.increase(time.duration.days(360));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(1000 * 0.2);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Admin should withdraw", async () => {
    const oldBalance = await token.balanceOf(instance.address);
    const oldAdminBalance = await token.balanceOf(owner);
    await instance.withdraw();

    const newBalance = await token.balanceOf(instance.address);
    const newAdminBalance = await token.balanceOf(owner);
    withdraw = newAdminBalance.sub(oldAdminBalance);

    assert.equal(newBalance.cmp(getBN(0)), 0, "Withdraw not valid");
    assert.equal(oldBalance.cmp(withdraw), 0, "Admin balance not valid");
  });

  it("User should not have unlockable tokens anymore", async () => {
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(0);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("User should not be able to lock withdraw", async () => {
    await expectRevert(
      instance.lockWithdraw({ from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`
    );
  });

  it("Admin should lock withdraw", async () => {
    await instance.lockWithdraw();

    const isLocked = await instance.isWithdrawLocked();

    assert.equal(isLocked, true, "Withdraw must be locked");
  });

  it("Admin should not be able to relock withdraw", async () => {
    await expectRevert(instance.lockWithdraw(), "Whitdraw already locked");
  });

  it("Admin should not be able to withdraw if already locked", async () => {
    await expectRevert(
      instance.withdraw(),
      "Whitdraw function is permanently blocked"
    );
  });

  it("User should not be able to withdraw", async () => {
    await expectRevert(
      instance.withdraw({ from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`
    );
  });

  it("Admin can add new tokens supply", async () => {
    const oldTokenSupply = await instance.totalSupply();
    await token.transfer(instance.address, withdraw);
    const newBalance = await token.balanceOf(instance.address);
    const newTokenSupply = await instance.totalSupply();
    assert.equal(newBalance.toString(), withdraw.toString(), "Invalid balance");
    assert.equal(
      newTokenSupply.toString(),
      oldTokenSupply.add(withdraw).toString(),
      "Invalid balance"
    );
  });

  it("Allocator should allocate to user", async () => {
    const amount = getAmount(1000);

    await instance.allocateTokens(user, amount);

    const balance = await instance.balanceOf(user);

    assert.equal(balance.cmp(amount), 0, "Withdraw must be locked");
  });

  it("User balance should encrease when allocated tokens", async () => {
    await time.increase(time.duration.days(30));
    const oldBalance = await instance.balanceOf(user);

    const amount = getAmount(1000);

    await instance.allocateTokens(user, amount);

    const newBalance = await instance.balanceOf(user);

    assert.equal(
      newBalance.cmp(oldBalance.add(amount)),
      0,
      "Withdraw must be locked"
    );
  });

  it("Total unlockable tokens must be 20% of the first allocation (1 year after the first allocation)", async () => {
    await time.increase(time.duration.days(360 - 30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(1000 * 0.2);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Total unlockable tokens must be 20% of the two allocations (1 year after the seconds allocation)", async () => {
    await time.increase(time.duration.days(30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount((1000 + 1000) * 0.2);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Total unlockable tokens must be 40% of the first allocation + 20% of the seconds (1 year + 6 month)", async () => {
    await time.increase(time.duration.days(180 - 30));
    const totalUnlockableTokens = await instance.unlockableTokens(user);
    let exptectedTotalTokens = getAmount(1000 * 0.2 + 1000 * 0.4);
    assert.equal(
      totalUnlockableTokens.toString(),
      exptectedTotalTokens.toString(),
      "Unlockable tokens not valid"
    );
  });

  it("Someone should claim user's unlockable tokens", async () => {
    const oldUserTokenBalance = await token.balanceOf(user);
    const expectedClaimedAmount = getAmount(1000 * 0.2 + 1000 * 0.4);

    await instance.claimTokens(user);

    const userTokenBalance = await token.balanceOf(user);

    assert.equal(
      userTokenBalance.cmp(oldUserTokenBalance.add(expectedClaimedAmount)),
      0,
      "Bad user token balance"
    );

    const newUserBalance = await instance.balanceOf(user);

    assert.equal(
      newUserBalance.toString(),
      getAmount(1000 * 0.8 + 1000 * 0.6).toString(),
      "Bad remaining user balance"
    );
  });
});
