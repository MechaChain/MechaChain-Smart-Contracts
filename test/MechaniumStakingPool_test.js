// Load modules
const { time, expectRevert } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require(
  "MechaniumStakingPool"
);

// Load utils
const { getAmount, getBN, getBNRange } = require("../utils");

contract("MechaniumStakingPool", (accounts) => {
  const [owner, fakePool, staker1, staker2, staker3] = accounts;
  let factory, token, mainPool, usersDeposits = {};

  let expectedTotalWeight = getAmount(0);

  let mainStakingPoolData = {
    allocatedTokens: getAmount(10000),
    initBlock: 0, // set in the first test = latestBlock + 100
    minStakingTime: time.duration.days(10),
    maxStakingTime: time.duration.days(100),
    minWeightMultiplier: getBN(1),
    maxWeightMultiplier: getBN(2),
    rewardsLockingPeriod: time.duration.days(90),
    rewardsPerBlock: getAmount(1),
  };

  const WEIGHT_MULTIPLIER = getBN(1e6);

  /**
   * ========================
   *          FONCTIONS
   * ========================
   */

  const getWeightMultiplierRange = (stakingTime) => {
    return getBNRange(
      mainStakingPoolData.minStakingTime,
      mainStakingPoolData.minWeightMultiplier.mul(WEIGHT_MULTIPLIER),
      mainStakingPoolData.maxStakingTime,
      mainStakingPoolData.maxWeightMultiplier.mul(WEIGHT_MULTIPLIER),
      stakingTime
    );
  };

  /**
   * Stake `amount` for `staker` with balance, weight and lock times tests
   */
  const stake = async (amount, staker, stakingTime) => {
    const userOldBalance = await token.balanceOf(staker);
    const userOldPoolBalance = await mainPool.balanceOf(staker);
    const poolOldBalance = await token.balanceOf(mainPool.address);

    await token.approve(mainPool.address, amount, { from: staker });
    await mainPool.stake(amount, stakingTime, {
      from: staker,
    });

    const userNewBalance = await token.balanceOf(staker);
    const userNewPoolBalance = await mainPool.balanceOf(staker);
    const poolNewBalance = await token.balanceOf(mainPool.address);
    const userNewProfil = await mainPool.getUser(staker);
    const lastDeposit = userNewProfil.deposits[userNewProfil.deposits.length - 1];
    const lastBlock = await time.latestBlock();

    const newDeposit = {
      block:
        mainStakingPoolData.initBlock.cmp(lastBlock) == -1
          ? lastBlock
          : mainStakingPoolData.initBlock,
      amount: amount,
      weight: amount
        .mul(getWeightMultiplierRange(stakingTime))
        .div(WEIGHT_MULTIPLIER),
    };

    usersDeposits[staker] = usersDeposits[staker] || [];
    usersDeposits[staker].push(newDeposit);

    // Balances tests
    assert.equal(
      userOldBalance.sub(amount).toString(),
      userNewBalance.toString(),
      "Incorrect user token balance"
    );
    assert.equal(
      userOldPoolBalance.add(amount).toString(),
      userNewPoolBalance.toString(),
      "Incorrect user balance in the pool"
    );
    assert.equal(
      poolOldBalance.add(amount).toString(),
      poolNewBalance.toString(),
      "Incorrect pool balance"
    );

    // Weight test
    assert.equal(
      usersDeposits[staker]
        .reduce((acc, value) => acc.add(value.weight), getBN(0))
        .toString(),
      userNewProfil.totalWeight.toString(),
      "Incorrect user weight"
    );

    expectedTotalWeight = expectedTotalWeight.add(getBN(userNewProfil.totalWeight));

    const totalUsersWeight = await mainPool.totalUsersWeight();

    assert.equal(
      expectedTotalWeight.toString(),
      totalUsersWeight.toString(),
      "Incorrect total weight"
    );

    const latestTime = await time.latest();

    // Lock times tests
    assert.equal(
      lastDeposit.lockedFrom.toString(),
      latestTime.toString(),
      "Incorrect deposit lockedFrom"
    );

    assert.equal(
      lastDeposit.lockedUntil.toString(),
      latestTime.add(stakingTime).toString(),
      "Incorrect deposit lockedUntil"
    );
  };

  const updatedRewardsPerWeight = async () => {
    const latestBlock = await time.latestBlock();

    if (latestBlock.toString() < mainStakingPoolData.initBlock.toString()) {
      return getBN(0);
    }

    const passedBlocks = await getPassedBlocks(true);

    let cumulatedRewards = passedBlocks.mul(mainStakingPoolData.rewardsPerBlock);

    const totalUsersWeight = await mainPool.totalUsersWeight();

    cumulatedRewards = cumulatedRewards.mul(WEIGHT_MULTIPLIER);

    const _rewardsPerWeight = cumulatedRewards.div(totalUsersWeight);

    return _rewardsPerWeight;
  }

  const getPassedBlocks = async (addBlock) => {
    const latestBlock = await time.latestBlock();

    let passedBlocks = latestBlock.sub(mainStakingPoolData.initBlock);

    if (addBlock) {
      passedBlocks = passedBlocks.add(getBN(1));
    }

    return passedBlocks;
  }

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it("Factory should be deployed", async () => {
    mainStakingPoolData.initBlock = (await time.latestBlock()).add(getBN(100));

    factory = await MechaniumStakingPoolFactory.deployed();
    assert(factory.address !== "");
    token = await Mechanium.deployed();
  });

  it("Can't instanciate a pool if rewardsPerBlock is null", async () => {
    await expectRevert(
      factory.createPool(
        ...Object.values({
          ...mainStakingPoolData,
          rewardsPerBlock: getAmount(0),
        })
      ),
      "Rewards can't be null"
    );
  });

  it("Can't instanciate a pool if minStakingTime is greater than maxStakingTime", async () => {
    await expectRevert(
      factory.createPool(
        ...Object.values({
          ...mainStakingPoolData,
          maxStakingTime: time.duration.days(30),
          minStakingTime: time.duration.days(360),
        })
      ),
      "minStakingTime can't be greater than maxStakingTime"
    );
  });

  it("Can't instanciate a pool if minWeightMultiplier is greater than maxWeightMultiplier", async () => {
    await expectRevert(
      factory.createPool(
        ...Object.values({
          ...mainStakingPoolData,
          minWeightMultiplier: 2,
          maxWeightMultiplier: 1,
        })
      ),
      "minWeightMultiplier can't be greater than maxWeightMultiplier"
    );
  });

  it("Can't instanciate a pool if minWeightMultiplier is null", async () => {
    await expectRevert(
      factory.createPool(
        ...Object.values({
          ...mainStakingPoolData,
          minWeightMultiplier: 0,
        })
      ),
      "minWeightMultiplier can't be null"
    );
  });

  it("Factory owner should be able to create staking pool instance", async () => {
    await factory.createPool(...Object.values(mainStakingPoolData));

    mainPool = await factory.registredPoolsList(0);
    mainPool = await MechaniumStakingPool.at(mainPool);

    assert(mainPool);

    const poolBalance = await token.balanceOf(mainPool.address);

    assert.equal(
      poolBalance.cmp(mainStakingPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );
  });

  it("Owner of the pool should be the fatory", async () => {
    assert.equal(await mainPool.owner(), factory.address, "Wrong pool owner");
  });

  it("User can't stake if he did not approve tokens first", async () => {
    await token.transfer(staker1, getAmount(1000));
    await expectRevert(
      mainPool.stake(getAmount(100), mainStakingPoolData.minStakingTime, {
        from: staker1,
      }),
      "ERC20: transfer amount exceeds allowance"
    );
  });

  it("User can't stake 0 tokens", async () => {
    await expectRevert(
      mainPool.stake(getAmount(0), mainStakingPoolData.minStakingTime, {
        from: staker1,
      }),
      "Amount must be superior to zero"
    );
  });

  it("User can't stake less than the minimum time", async () => {
    token.approve(mainPool.address, getAmount(100), { from: staker1 });
    await expectRevert(
      mainPool.stake(
        getAmount(100),
        mainStakingPoolData.minStakingTime.sub(time.duration.days(1)),
        { from: staker1 }
      ),
      "Staking time less than minimum required"
    );
  });

  it("User can't stake greater than the maximum time", async () => {
    await token.approve(mainPool.address, getAmount(100), { from: staker1 });
    await expectRevert(
      mainPool.stake(
        getAmount(100),
        mainStakingPoolData.maxStakingTime + time.duration.days(1),
        { from: staker1 }
      ),
      "Staking time greater than maximum required"
    );
  });

  it("Staker1 can stake his tokens", async () => {
    const amount = getAmount(100);
    const staker = staker1;

    await stake(amount, staker, mainStakingPoolData.maxStakingTime);
  });

  it("Staker2 can stake his tokens (3/4 of weight)", async () => {
    await time.advanceBlockTo(mainStakingPoolData.initBlock - 10);

    await token.transfer(staker2, getAmount(1000));

    const amount = getAmount(300);
    const staker = staker2;

    await stake(amount, staker, mainStakingPoolData.maxStakingTime);
  });

  it("No rewards should be distributed before iniBlock", async () => {
    await time.advanceBlockTo(mainStakingPoolData.initBlock - 3);

    await expectRevert(
      mainPool.updateRewardsPerWeight(),
      "initBlock is not reached"
    );

    const rewardsPerWeight = await mainPool.rewardsPerWeight();

    assert.equal(
      rewardsPerWeight.toString(),
      "0",
      "Incorrect rewardsPerWeight"
    );

    const updatedRewardsPerWeight = await mainPool.updatedRewardsPerWeight();

    assert.equal(
      updatedRewardsPerWeight.toString(),
      "0",
      "Incorrect updatedRewardsPerWeight"
    );

    const staker1PendingRewards = await mainPool.pendingRewards(staker1);

    assert.equal(
      staker1PendingRewards.toString(),
      "0",
      "Incorrect pendingRewards of staker1"
    );
  });

  it("Distribution of rewards must have started (first block)", async () => {
    await time.advanceBlockTo(mainStakingPoolData.initBlock);

    const calculatedRewardsPerWeight = await updatedRewardsPerWeight();

    await mainPool.updateRewardsPerWeight();

    const _rewardsPerWeight = await mainPool.rewardsPerWeight();

    assert.equal(
      _rewardsPerWeight.toString(),
      calculatedRewardsPerWeight.toString(),
      "Incorrect rewardsPerWeight"
    );

    let staker1PendingRewards = await mainPool.pendingRewards(staker1);

    const expectedStaker1PendingRewards = mainStakingPoolData.rewardsPerBlock.div(getBN(4));

    assert.equal(
      staker1PendingRewards.toString(),
      expectedStaker1PendingRewards.toString(), // Staker 1 must have 1/4 of totalWeight
      "Incorrect pendingRewards of staker1: must have 1/4 of totalWeight"
    );

    const staker2PendingRewards = await mainPool.pendingRewards(staker2);

    const expectedStaker2PendingRewards = mainStakingPoolData.rewardsPerBlock.div(getBN(4)).mul(getBN(3));

    assert.equal(
      staker2PendingRewards.toString(),
      expectedStaker2PendingRewards.toString(), // Staker 2 must have 3/4 of totalWeight
      "Incorrect pendingRewards of staker2: must have 3/4 of totalWeight"
    );
  });

  it("Remaining allocated tokens takes into account the number of rewarded tokens", async () => {
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    const blockPassed = await getPassedBlocks();

    const calculatedRemainingAllocatedTokens = mainStakingPoolData.allocatedTokens
      .sub(mainStakingPoolData.rewardsPerBlock.mul(blockPassed));

    const remainingAllocatedTokens = await mainPool.remainingAllocatedTokens();

    assert.equal(
      calculatedRemainingAllocatedTokens.toString(),
      remainingAllocatedTokens.toString(),
      "Incorrect remainingAllocatedTokens"
    );
  });

  it("Staker3 can stake his tokens", async () => {
    await token.transfer(staker3, getAmount(1000));

    const amount = getAmount(600);
    const staker = staker3;

    await stake(amount, staker, mainStakingPoolData.minStakingTime);
  });
});
