// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumGrowthVestingWallet = artifacts.require(
  "MechaniumGrowthVestingWallet"
);

// Load utils
const { getAmount, getBN } = require("../utils");

contract("MechaniumGrowthVestingWallet", (accounts) => {
  const [owner, dao, user, user2] = accounts;
  let instance, token, TRANSFER_ROLE, DEFAULT_ADMIN_ROLE;

  it("Smart contract should be deployed", async () => {
    instance = await MechaniumGrowthVestingWallet.deployed();
    token = await Mechanium.deployed();
    assert(instance.address !== "");
  });

  it("DAO account should not have TRANSFER_ROLE yet", async () => {
    TRANSFER_ROLE = await instance.TRANSFER_ROLE();
    const hasTransferRole = await instance.hasRole(TRANSFER_ROLE, dao);
    assert(!hasTransferRole);
  });

  it("Admin should be able to set TRANSFER_ROLE", async () => {
    await instance.grantRole(TRANSFER_ROLE, dao);
    const hasTransferRole = await instance.hasRole(TRANSFER_ROLE, dao);
    assert(hasTransferRole);
  });

  it("Random user should not be able to set TRANSFER_ROLE", async () => {
    DEFAULT_ADMIN_ROLE = await instance.DEFAULT_ADMIN_ROLE();
    await expectRevert(
      instance.grantRole(TRANSFER_ROLE, user2, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`
    );
  });

  it("DAO account should not be able to set TRANSFER_ROLE", async () => {
    await expectRevert(
      instance.grantRole(TRANSFER_ROLE, user2, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`
    );
  });

  it("DAO account should not be able to set DEFAULT_ADMIN_ROLE", async () => {
    await expectRevert(
      instance.grantRole(DEFAULT_ADMIN_ROLE, user2, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`
    );
  });

  it("Anyone can see the current balance (equal to 8 000 000 after deployment)", async () => {
    const tokenBalance = await instance.tokenBalance();
    const tokenBalance2 = await token.balanceOf(instance.address);
    assert.equal(tokenBalance.cmp(getAmount(8000000)), 0, "Balance not valid");
    assert.equal(
      tokenBalance2.cmp(getAmount(8000000)),
      0,
      "Balance not valid (directly from the ERC20 contract)"
    );
  });

  it("Anyone can see the vesting Per Clock (15%)", async () => {
    const vestingPerClock = await instance.vestingPerClock();
    assert.equal(
      vestingPerClock.cmp(getBN(15)),
      0,
      "vestingPerClock not valid"
    );
  });

  it("Anyone can see the vesting Clock Time (6 months)", async () => {
    const vestingClockTime = await instance.vestingClockTime();

    assert.equal(
      vestingClockTime.cmp(time.duration.days(180)),
      0,
      "vestingClockTime not valid"
    );
  });

  it("Anyone can see the initial vesting (40%)", async () => {
    const initialVesting = await instance.initialVesting();
    assert.equal(initialVesting.cmp(getBN(40)), 0, "initialVesting not valid");
  });

  it("Anyone can see the start Time (days of deployment)", async () => {
    const startTime = await instance.startTime();
    const expectedStartTime = await time.latest();

    assert.ok(
      startTime.lte(expectedStartTime.add(time.duration.hours(1))) &&
        startTime.gte(expectedStartTime.sub(time.duration.hours(1))),
      "initialVesting not valid"
    );
  });

  it("Anyone can see the number of tokens that have been transferred (0 for now)", async () => {
    const releasedTokens = await instance.totalReleasedTokens();
    assert.equal(
      releasedTokens.cmp(getAmount(0)),
      0,
      "Released Tokens not valid"
    );
  });

  it("Anyone can see the current balance of unlocked tokens (3 200 000 after deployment)", async () => {
    const unlockableTokens = await instance.unlockableTokens();
    assert.equal(
      unlockableTokens.cmp(getAmount(3200000)),
      0,
      "Unlockable Tokens not valid"
    );
  });

  it("Random user should not be able to transfer tokens", async () => {
    const amount = getAmount(10);
    await expectRevert(
      instance.transfer(user2, amount, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${TRANSFER_ROLE.toLowerCase()}.`
    );
  });

  it("DAO can't transfer more tokens than the schedule allows", async () => {
    const amount = getAmount(3200001);
    await expectRevert(
      instance.transfer(user2, amount, { from: dao }),
      "Number of unlocked tokens exceeded"
    );
  });

  it("DAO can transfer 40% of the tokens after deployment on multiple transactions and to any address", async () => {
    const amount1 = getAmount(3200000 / 2);
    const amount2 = getAmount(3200000 / 2);
    const oldUserTokenBalance = await token.balanceOf(user);
    const oldUser2TokenBalance = await token.balanceOf(user2);

    await instance.transfer(user, amount1, { from: dao });
    await instance.transfer(user2, amount2, { from: dao });

    const newUserTokenBalance = await token.balanceOf(user);
    const newUser2TokenBalance = await token.balanceOf(user2);
    const unlockableTokens = await instance.unlockableTokens();

    assert.equal(
      newUserTokenBalance.cmp(oldUserTokenBalance.add(amount1)),
      0,
      "Incorrect user balance"
    );

    assert.equal(
      newUser2TokenBalance.cmp(oldUser2TokenBalance.add(amount1)),
      0,
      "Incorrect user2 balance"
    );

    assert.equal(
      unlockableTokens.cmp(getBN(0)),
      0,
      "Incorrect unlockable tokens balance"
    );
  });

  it("DAO can transfer +15% of the tokens (after 6 months)", async () => {
    await time.increase(time.duration.days(183));

    const amount = getAmount(1200000);
    const oldUserTokenBalance = await token.balanceOf(user);

    await instance.transfer(user, amount, { from: dao });

    const newUserTokenBalance = await token.balanceOf(user);
    const unlockableTokens = await instance.unlockableTokens();

    assert.equal(
      newUserTokenBalance.cmp(oldUserTokenBalance.add(amount)),
      0,
      "Incorrect user balance"
    );
    assert.equal(
      unlockableTokens.cmp(getBN(0)),
      0,
      "Incorrect unlockable tokens balance"
    );
  });

  it("DAO can transfer 100% of the tokens (after 18 new months)", async () => {
    await time.increase(time.duration.days(3 * 180));

    const amount = getAmount(3600000);
    const oldUserTokenBalance = await token.balanceOf(user);

    await instance.transfer(user, amount, { from: dao });

    const newUserTokenBalance = await token.balanceOf(user);
    const unlockableTokens = await instance.unlockableTokens();

    assert.equal(
      newUserTokenBalance.cmp(oldUserTokenBalance.add(amount)),
      0,
      "Incorrect user balance"
    );
    assert.equal(
      unlockableTokens.cmp(getBN(0)),
      0,
      "Incorrect unlockable tokens balance"
    );
  });

  it("DAO can't transfer more tokens now", async () => {
    const amount = getAmount(1);
    await expectRevert(
      instance.transfer(user2, amount, { from: dao }),
      "Number of unlocked tokens exceeded"
    );
  });

  it("Anyone can see the total supply (always equal to 8 000 000)", async () => {
    const totalSupply = await instance.totalSupply();
    assert.equal(
      totalSupply.cmp(getAmount(8000000)),
      0,
      "Total supply not valid"
    );
  });

  it("[BONUS] The owner can add new tokens (+1 000 $MECHA)", async () => {
    await token.transfer(instance.address, getAmount(1000)); // 1 000 $MECHA

    const totalSupply = await instance.totalSupply();
    assert.equal(
      totalSupply.cmp(getAmount(8000000 + 1000)),
      0,
      "Total supply not valid"
    );
  });

  it("[BONUS] can transfer the new tokens (related to the first calendar)", async () => {
    const amount = getAmount(1000);
    const oldUserTokenBalance = await token.balanceOf(user);

    await instance.transfer(user, amount, { from: dao });

    const newUserTokenBalance = await token.balanceOf(user);
    const unlockableTokens = await instance.unlockableTokens();

    assert.equal(
      newUserTokenBalance.cmp(oldUserTokenBalance.add(amount)),
      0,
      "Incorrect user balance"
    );
    assert.equal(
      unlockableTokens.cmp(getBN(0)),
      0,
      "Incorrect unlockable tokens balance"
    );
  });
});
