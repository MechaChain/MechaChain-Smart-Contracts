// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumBis = artifacts.require("MechaniumBis");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

// Load utils
const { getAmount } = require("../utils");

contract("MechaniumStakingPoolFactory", (accounts) => {
  const [owner, fakePool, user] = accounts;
  let instance, token, tokenBis, mainPoolAddr;

  const mainStakingPoolData = {
    allocatedTokens: getAmount(10000),
    initBlock: 123456,
    minStakingTime: time.duration.days(30),
    maxStakingTime: time.duration.days(360),
    minWeightMultiplier: 1,
    maxWeightMultiplier: 2,
    rewardsLockingPeriod: time.duration.days(90),
    rewardsPerBlock: getAmount(1),
  };

  it("Smart contract should be deployed", async () => {
    instance = await MechaniumStakingPoolFactory.deployed();
    assert(instance.address !== "");
    token = await Mechanium.deployed();
    tokenBis = await MechaniumBis.deployed();
  });

  it("Owner should be able to create staking pool instance", async () => {
    await instance.createPool(...Object.values(mainStakingPoolData));

    mainPoolAddr = await instance.registeredPoolsList.call(0);

    assert(mainPoolAddr);

    const poolBalance = await token.balanceOf(mainPoolAddr);

    assert.equal(
      poolBalance.cmp(mainStakingPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );
  });

  it("Owner should be able to create flash staking pool instance", async () => {
    const flashPoolData = {
      stakedToken: token.address,
      ...mainStakingPoolData,
    };

    delete flashPoolData.rewardsLockingPeriod;

    await instance.createFlashPool(...Object.values(flashPoolData));

    const flashPoolAddr = await instance.registeredPoolsList.call(1);

    assert(flashPoolAddr);

    const poolBalance = await token.balanceOf(flashPoolAddr);

    assert.equal(
      poolBalance.cmp(flashPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );
  });

  it("Owner should be able to add allocated tokens to pool", async () => {
    const amount = getAmount(10000);

    await instance.addAllocatedTokens(mainPoolAddr, amount);

    const poolBalance = await token.balanceOf(mainPoolAddr);

    mainStakingPoolData.allocatedTokens =
      mainStakingPoolData.allocatedTokens.add(amount);

    assert.equal(
      poolBalance.cmp(mainStakingPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );
  });

  it("Owner should be able to add allocated tokens to pool and change the rewards per block", async () => {
    const amount = getAmount(10000);
    const newRewardsPerBlock = getAmount(10);

    await instance.addAllocatedTokens(mainPoolAddr, amount, newRewardsPerBlock);

    const poolBalance = await token.balanceOf(mainPoolAddr);

    mainStakingPoolData.allocatedTokens =
      mainStakingPoolData.allocatedTokens.add(amount);

    assert.equal(
      poolBalance.cmp(mainStakingPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );

    const { rewardsPerBlock } = await instance.getPoolData(mainPoolAddr);

    mainStakingPoolData.rewardsPerBlock = newRewardsPerBlock;

    assert(
      rewardsPerBlock === mainStakingPoolData.rewardsPerBlock.toString(),
      "Wrong rewards per block"
    );
  });

  it("Owner should not be able to allocate to a non registered pool", async () => {
    await expectRevert(
      instance.addAllocatedTokens(fakePool, getAmount(10000)),
      "Staking pool not registered"
    );
  });

  it("Owner should not be able to allocate an amount of 0", async () => {
    await expectRevert(
      instance.addAllocatedTokens(mainPoolAddr, getAmount(0)),
      "Amount must be superior to zero"
    );
  });

  it("Owner should not be able to allocate more tokens thant the factory balance", async () => {
    await expectRevert(
      instance.addAllocatedTokens(mainPoolAddr, getAmount(10000000)),
      "Not enough tokens in factory"
    );
  });

  it("Owner should not be able to withdraw to address(0)", async () => {
    await expectRevert(
      instance.withdrawUnallocated(
        "0x0000000000000000000000000000000000000000",
        getAmount(1000)
      ),
      "Address must not be 0"
    );
  });

  it("Owner should not be able to withdraw an amount of 0", async () => {
    await expectRevert(
      instance.withdrawUnallocated(owner, getAmount(0)),
      "Amount must be superior to zero"
    );
  });

  it("Owner should not be able to withdraw more than factory balance", async () => {
    await expectRevert(
      instance.withdrawUnallocated(owner, getAmount(10000000)),
      "Not enough tokens in factory"
    );
  });

  it("Owner should be able to withdraw unallocated tokens", async () => {
    const amount = getAmount(10000);
    const oldOwnerBalance = await token.balanceOf(owner);

    await instance.withdrawUnallocated(owner, amount);

    const newOwnerBalance = await token.balanceOf(owner);

    assert.equal(
      newOwnerBalance.cmp(oldOwnerBalance.add(amount)),
      0,
      "Wrong owner balance"
    );
  });

  it("Owner should not be able to get unregistered pool data", async () => {
    await expectRevert(instance.getPoolData(fakePool), "Pool not registered");
  });

  it("Owner should be able to get registered pool data", async () => {
    const poolData = await instance.getPoolData(mainPoolAddr);

    Object.keys(mainStakingPoolData).forEach((key) => {
      const initialValue = mainStakingPoolData[key];
      const poolValue = poolData[key];
      if (typeof poolValue !== "undefined") {
        assert(initialValue.toString() === poolValue, `Wrong ${key} value`);
      }
    });
  });

  it("Owner should not be able to release unintended $MECHA", async () => {
    const amount = getAmount(100);

    await expectRevert(
      instance.releaseUnintended(token.address, user, amount),
      "Token can't be released -- Reason given: Token can't be released."
    );
  });

  it("Owner should not be able to release unintended $MECHA in pool (from factory)", async () => {
    const amount = getAmount(100);

    await expectRevert(
      instance.releaseUnintendedFromPool(
        mainPoolAddr,
        token.address,
        user,
        amount
      ),
      "Token can't be released -- Reason given: Token can't be released."
    );
  });

  it("Owner should be able to release unintended $MECHABIS", async () => {
    const amount = getAmount(100);

    await instance.releaseUnintended(tokenBis.address, user, amount);

    const userBalance = await tokenBis.balanceOf(user);

    assert.equal(userBalance.cmp(amount), 0, "Wrong balance");
  });

  it("Owner should be able to release unintended $MECHABIS in pool (from factory)", async () => {
    const amount = getAmount(100);

    const oldUserBalance = await tokenBis.balanceOf(user);

    await tokenBis.transfer(mainPoolAddr, getAmount(1000));

    await instance.releaseUnintended(tokenBis.address, user, amount);

    const newUserBalance = await tokenBis.balanceOf(user);

    const userBalanceDiff = newUserBalance.sub(oldUserBalance);

    assert.equal(userBalanceDiff.toString(), amount.toString(), "Wrong balance");
  });

  it("Owner should not be able to release unintended ETH (Reason: insufficient balance)", async () => {
    const amount = getAmount(100);

    await expectRevert(
      instance.releaseUnintended(
        "0x0000000000000000000000000000000000000000",
        owner,
        amount
      ),
      "Address: insufficient balance"
    );
  });

  it("Owner should not be able to release unintended ETH (Reason: insufficient balance) in pool (from factory)", async () => {
    const amount = getAmount(100);

    await expectRevert(
      instance.releaseUnintendedFromPool(
        mainPoolAddr,
        "0x0000000000000000000000000000000000000000",
        owner,
        amount
      ),
      "Address: insufficient balance"
    );
  });

  it("Owner should be able to release unintended ETH", async () => {
    const amount = getAmount(10);

    await instance.send(amount, { from: owner });

    const oldBalance = await web3.eth.getBalance(instance.address);

    assert.equal(oldBalance, 10000000000000000000, "Error sending ETH");

    await instance.releaseUnintended(
      "0x0000000000000000000000000000000000000000",
      owner,
      amount
    );

    const newBalance = await web3.eth.getBalance(instance.address);

    assert.equal(newBalance, 0, "Error releasing unintended ETH");
  });

  it("Owner should be able to release unintended ETH in pool ( from factory )", async () => {
    const amount = getAmount(10);
    
    const mainPool = await MechaniumStakingPool.at(mainPoolAddr);
    
    await mainPool.send(amount, { from: owner });

    const oldBalance = await web3.eth.getBalance(mainPoolAddr);

    assert.equal(oldBalance, 10000000000000000000, "Error sending ETH");

    await instance.releaseUnintendedFromPool(
      mainPoolAddr,
      "0x0000000000000000000000000000000000000000",
      owner,
      amount
    );

    const newBalance = await web3.eth.getBalance(instance.address);

    assert.equal(newBalance, 0, "Error releasing unintended ETH");
  });
});
