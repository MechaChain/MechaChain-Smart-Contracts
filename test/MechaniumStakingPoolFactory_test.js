// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);

// Load utils
const { getAmount, getBN } = require("../utils");

contract("MechaniumStakingPoolFactory", (accounts) => {
  const [owner, fakePool] = accounts;
  let instance, token, mainPoolAddr;

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
});
