// Load modules
const { time, expectRevert, snapshot } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

// Load utils
const { getAmount, getBN, getBNRange } = require("../utils");

contract("MechaniumStakingPool", (accounts) => {
  const [owner, fakePool, staker1, staker2, staker3] = accounts;
  let factory,
    token,
    mainPool,
    usersDeposits = {};

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
   *        FUNCTIONS
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
    const userNewProfile = await mainPool.getUser(staker);
    const lastDeposit =
      userNewProfile.deposits[userNewProfile.deposits.length - 1];
    const lastBlock = await time.latestBlock();

    // Add deposit
    const newDeposit = {
      id: userNewProfile.deposits.length - 1,
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
      userNewBalance.toString(),
      userOldBalance.sub(amount).toString(),
      "Incorrect user token balance"
    );
    assert.equal(
      userNewPoolBalance.toString(),
      userOldPoolBalance.add(amount).toString(),
      "Incorrect user balance in the pool"
    );
    assert.equal(
      poolNewBalance.toString(),
      poolOldBalance.add(amount).toString(),
      "Incorrect pool balance"
    );

    // Weight test
    assert.equal(
      usersDeposits[staker]
        .reduce((acc, value) => acc.add(value.weight), getBN(0))
        .toString(),
      userNewProfile.totalWeight.toString(),
      "Incorrect user weight"
    );

    expectedTotalWeight = expectedTotalWeight.add(getBN(lastDeposit.weight));

    const totalUsersWeight = await mainPool.totalUsersWeight();

    assert.equal(
      totalUsersWeight.toString(),
      expectedTotalWeight.toString(),
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

  /**
   * Process rewards for `staker` and test staked tokens, new pending rewards, new weight and lock times
   */
  const processRewards = async (staker) => {
    const userOldPoolProfile = await mainPool.getUser(staker);

    const userRewards = await getNextPendingRewards(staker);

    await mainPool.processRewards({
      from: staker,
    });

    const userNewProfile = await mainPool.getUser(staker);
    const userNewPendingRewards = await mainPool.pendingRewards(staker);
    const lastDeposit =
      userNewProfile.deposits[userNewProfile.deposits.length - 1];
    const lastBlock = await time.latestBlock();

    // Add rewards deposit
    const newDeposit = {
      id: userNewProfile.deposits.length - 1,
      block:
        mainStakingPoolData.initBlock.cmp(lastBlock) == -1
          ? lastBlock
          : mainStakingPoolData.initBlock,
      amount: userRewards,
      weight: userRewards
        .mul(getWeightMultiplierRange(mainStakingPoolData.rewardsLockingPeriod))
        .div(WEIGHT_MULTIPLIER),
    };
    usersDeposits[staker] = usersDeposits[staker] || [];
    usersDeposits[staker].push(newDeposit);

    // Staked token test
    assert.equal(
      userNewProfile.totalStaked.toString(),
      getBN(userOldPoolProfile.totalStaked).add(userRewards).toString(),
      "Incorrect user tokens staked"
    );

    // Pending rewards test
    assert.equal(
      userNewPendingRewards.toString(),
      "0",
      "Incorrect new pending rewards"
    );

    // Weight test
    assert.equal(
      userNewProfile.totalWeight.toString(),
      usersDeposits[staker]
        .reduce((acc, value) => acc.add(value.weight), getBN(0))
        .toString(),
      "Incorrect user weight"
    );
    expectedTotalWeight = expectedTotalWeight.add(getBN(lastDeposit.weight));
    const totalUsersWeight = await mainPool.totalUsersWeight();
    assert.equal(
      totalUsersWeight.toString(),
      expectedTotalWeight.toString(),
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
      latestTime.add(mainStakingPoolData.rewardsLockingPeriod).toString(),
      "Incorrect deposit lockedUntil"
    );
  };

  /**
   * Unstake `deposit` for `staker` and test staked tokens, balances, new pending rewards, new weight and lock times
   *
   * @param {number[]|number} deposit can by an array of depositId or a simple deposit ID
   */
  const unstake = async (staker, deposit) => {
    const userOldPoolProfile = await mainPool.getUser(staker);
    const userOldBalance = await token.balanceOf(staker);
    const poolOldBalance = await token.balanceOf(mainPool.address);

    const userRewards = await getNextPendingRewards(staker);

    if (Array.isArray(deposit)) {
      await mainPool.methods["unstake(uint256[])"](deposit, {
        from: staker,
      });
    } else {
      await mainPool.methods["unstake(uint256)"](deposit, {
        from: staker,
      });
    }
    const userNewBalance = await token.balanceOf(staker);
    const poolNewBalance = await token.balanceOf(mainPool.address);
    const userNewProfile = await mainPool.getUser(staker);
    const userNewPendingRewards = await mainPool.pendingRewards(staker);
    const poolNewTotalStaked = await mainPool.totalTokensStaked();
    const lastDeposit =
      userNewProfile.deposits[userNewProfile.deposits.length - 1];
    const lastBlock = await time.latestBlock();

    // Add rewards deposit
    const newDeposit = {
      id: userNewProfile.deposits.length - 1,
      block:
        mainStakingPoolData.initBlock.cmp(lastBlock) == -1
          ? lastBlock
          : mainStakingPoolData.initBlock,
      amount: userRewards,
      weight: userRewards
        .mul(getWeightMultiplierRange(mainStakingPoolData.rewardsLockingPeriod))
        .div(WEIGHT_MULTIPLIER),
    };
    usersDeposits[staker] = usersDeposits[staker] || [];
    usersDeposits[staker].push(newDeposit);

    // Force array
    const deposits = Array.isArray(deposit) ? deposit : [deposit];

    // Remove unstake deposits
    let unstakedAmount = getBN(0);
    let unstakedWeight = getBN(0);
    deposits.forEach((id) => {
      unstakedAmount = unstakedAmount.add(usersDeposits[staker][id].amount);
      unstakedWeight = unstakedWeight.add(usersDeposits[staker][id].weight);
      usersDeposits[staker][id].amount = getBN(0);
      usersDeposits[staker][id].weight = getBN(0);
    });

    // Staked token test
    assert.equal(
      userNewProfile.totalStaked.toString(),
      getBN(userOldPoolProfile.totalStaked)
        .add(userRewards)
        .sub(unstakedAmount)
        .toString(),
      "Incorrect user tokens staked"
    );

    // Pending rewards test
    assert.equal(
      userNewPendingRewards.toString(),
      "0",
      "Incorrect new pending rewards"
    );

    // Weight test
    assert.equal(
      userNewProfile.totalWeight.toString(),
      usersDeposits[staker]
        .reduce((acc, value) => acc.add(value.weight), getBN(0))
        .toString(),
      "Incorrect user weight"
    );
    expectedTotalWeight = expectedTotalWeight
      .add(getBN(lastDeposit.weight))
      .sub(unstakedWeight);
    const totalUsersWeight = await mainPool.totalUsersWeight();
    assert.equal(
      totalUsersWeight.toString(),
      expectedTotalWeight.toString(),
      "Incorrect total weight"
    );

    // Balances tests
    assert.equal(
      userNewBalance.toString(),
      userOldBalance.add(unstakedAmount).toString(),
      "Incorrect user token balance"
    );
    assert.equal(
      poolNewBalance.toString(),
      poolOldBalance.sub(unstakedAmount).toString(),
      "Incorrect pool balance"
    );

    // TotalStaked test
    assert.equal(
      poolNewTotalStaked.toString(),
      Object.keys(usersDeposits)
        .reduce(
          (acc, key) =>
            acc.add(
              usersDeposits[key].reduce(
                (acc2, value) => acc2.add(value.amount),
                getBN(0)
              )
            ),
          getBN(0)
        )
        .toString(),
      "Incorrect pool total staked"
    );

    // Lock times tests
    const latestTime = await time.latest();
    assert.equal(
      lastDeposit.lockedFrom.toString(),
      latestTime.toString(),
      "Incorrect deposit lockedFrom"
    );
    assert.equal(
      lastDeposit.lockedUntil.toString(),
      latestTime.add(mainStakingPoolData.rewardsLockingPeriod).toString(),
      "Incorrect deposit lockedUntil"
    );
  };

  /**
   * Return the pending rewards for the next block
   */
  const getNextPendingRewards = async (staker) => {
    // advance one block and revert it to have the same block number as in processRewards
    const snapshotA = await snapshot();
    await time.advanceBlock();
    const userRewards = await mainPool.pendingRewards(staker);
    await snapshotA.restore(); // revert the last block

    return userRewards;
  };

  const updatedRewardsPerWeight = async () => {
    const latestBlock = await time.latestBlock();

    if (latestBlock.toString() < mainStakingPoolData.initBlock.toString()) {
      return getBN(0);
    }

    const passedBlocks = await getPassedBlocks(true);

    let cumulatedRewards = passedBlocks.mul(
      mainStakingPoolData.rewardsPerBlock
    );

    const totalUsersWeight = await mainPool.totalUsersWeight();

    cumulatedRewards = cumulatedRewards.mul(WEIGHT_MULTIPLIER);

    const _rewardsPerWeight = cumulatedRewards.div(totalUsersWeight);

    return _rewardsPerWeight;
  };

  const getPassedBlocks = async (addBlock) => {
    const latestBlock = await time.latestBlock();

    let passedBlocks = latestBlock.sub(mainStakingPoolData.initBlock);

    if (addBlock) {
      passedBlocks = passedBlocks.add(getBN(1));
    }

    return passedBlocks;
  };

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

  it("Can't instantiate a pool if rewardsPerBlock is null", async () => {
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

  it("Can't instantiate a pool if minStakingTime is greater than maxStakingTime", async () => {
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

  it("Can't instantiate a pool if minWeightMultiplier is greater than maxWeightMultiplier", async () => {
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

  it("Can't instantiate a pool if minWeightMultiplier is null", async () => {
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

    mainPool = await factory.registeredPoolsList(0);
    mainPool = await MechaniumStakingPool.at(mainPool);

    assert(mainPool);

    const poolBalance = await token.balanceOf(mainPool.address);

    assert.equal(
      poolBalance.cmp(mainStakingPoolData.allocatedTokens),
      0,
      "Wrong pool balance"
    );
  });

  it("Owner of the pool should be the factory", async () => {
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
    const userProfile = await mainPool.getUser(staker);

    assert.equal(
      userProfile.totalWeight.toString(),
      amount.mul(mainStakingPoolData.maxWeightMultiplier).toString(), // 100 * 2 = 200
      "Incorrect weight"
    );
  });

  it("Staker2 can stake his tokens (3/4 of weight)", async () => {
    await time.advanceBlockTo(mainStakingPoolData.initBlock - 10);

    await token.transfer(staker2, getAmount(1000));

    const amount = getAmount(300);
    const staker = staker2;

    await stake(amount, staker, mainStakingPoolData.maxStakingTime);
    const totalUsersWeight = await mainPool.totalUsersWeight();
    const expectedWeight = totalUsersWeight.div(getBN(4)).mul(getBN(3));
    const userProfile = await mainPool.getUser(staker);

    assert.equal(
      userProfile.totalWeight.toString(), // 300 * 2 = 600
      expectedWeight.toString(),
      "Incorrect weight"
    );
  });

  it("No rewards should be distributed before iniBlock", async () => {
    await time.advanceBlockTo(mainStakingPoolData.initBlock - 3);

    await expectRevert(mainPool.updateRewards(), "initBlock is not reached");

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

    await mainPool.updateRewards();

    const _rewardsPerWeight = await mainPool.rewardsPerWeight();

    assert.equal(
      _rewardsPerWeight.toString(),
      calculatedRewardsPerWeight.toString(),
      "Incorrect rewardsPerWeight"
    );

    let staker1PendingRewards = await mainPool.pendingRewards(staker1);

    const expectedStaker1PendingRewards =
      mainStakingPoolData.rewardsPerBlock.div(getBN(4));

    assert.equal(
      staker1PendingRewards.toString(),
      expectedStaker1PendingRewards.toString(), // Staker 1 must have 1/4 of totalWeight
      "Incorrect pendingRewards of staker1: must have 1/4 of totalWeight"
    );

    const staker2PendingRewards = await mainPool.pendingRewards(staker2);

    const expectedStaker2PendingRewards = mainStakingPoolData.rewardsPerBlock
      .div(getBN(4))
      .mul(getBN(3));

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

    const calculatedRemainingAllocatedTokens =
      mainStakingPoolData.allocatedTokens.sub(
        mainStakingPoolData.rewardsPerBlock.mul(blockPassed)
      );

    const remainingAllocatedTokens = await mainPool.remainingAllocatedTokens();

    assert.equal(
      calculatedRemainingAllocatedTokens.toString(),
      remainingAllocatedTokens.toString(),
      "Incorrect remainingAllocatedTokens"
    );
  });

  it("Staker3 can stake his tokens (weight x1.25 => 1/5 of total weight)", async () => {
    await token.transfer(staker3, getAmount(1000));

    const amount = getAmount(160);

    const quarterTime = mainStakingPoolData.maxStakingTime
      .sub(mainStakingPoolData.minStakingTime)
      .div(getBN(4))
      .add(mainStakingPoolData.minStakingTime);

    await stake(amount, staker3, quarterTime);

    const weightMultiplier =
      (mainStakingPoolData.maxWeightMultiplier.toNumber() -
        mainStakingPoolData.minWeightMultiplier.toNumber()) /
        4 +
      1;

    const userProfile = await mainPool.getUser(staker3);

    const expectedWeight = getAmount(160 * weightMultiplier);

    assert.equal(
      userProfile.totalWeight.toString(),
      expectedWeight.toString(), // 160 * 1.25 = 200
      "Incorrect weight"
    );
  });

  it("Weight verification for staker1 (1/5), staker2 (3/5) and staker3 (1/5)", async () => {
    const staker1Profile = await mainPool.getUser(staker1);
    const staker2Profile = await mainPool.getUser(staker2);
    const staker3Profile = await mainPool.getUser(staker3);
    const totalUsersWeight = await mainPool.totalUsersWeight();

    assert.equal(
      staker1Profile.totalWeight.toString(),
      totalUsersWeight.div(getBN(5)).toString(),
      "Incorrect weight for staker1"
    );

    assert.equal(
      staker2Profile.totalWeight.toString(),
      totalUsersWeight.div(getBN(5)).mul(getBN(3)).toString(),
      "Incorrect weight for staker2"
    );

    assert.equal(
      staker3Profile.totalWeight.toString(),
      totalUsersWeight.div(getBN(5)).toString(),
      "Incorrect weight for staker3"
    );
  });

  it("Pending Rewards must take weight change in count", async () => {
    const oldPendingRewardsStaker1 = await mainPool.pendingRewards(staker1);
    const oldPendingRewardsStaker2 = await mainPool.pendingRewards(staker2);
    const oldPendingRewardsStaker3 = await mainPool.pendingRewards(staker3);

    const blockPassed = await getPassedBlocks();

    assert.equal(
      oldPendingRewardsStaker1.toString(),
      mainStakingPoolData.rewardsPerBlock
        .mul(blockPassed)
        .div(getBN(4))
        .toString(),
      "Incorrect pendingRewards of staker1: must still have 1/4 of totalWeight"
    );

    assert.equal(
      oldPendingRewardsStaker2.toString(),
      mainStakingPoolData.rewardsPerBlock
        .mul(blockPassed)
        .div(getBN(4))
        .mul(getBN(3))
        .toString(),
      "Incorrect pendingRewards of staker2: must still have 3/4 of totalWeight"
    );

    assert.equal(
      oldPendingRewardsStaker3.toString(),
      "0",
      "Incorrect pendingRewards of staker3: must have 0"
    );

    // advance 4 blocks
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    const newPendingRewardsStaker1 = await mainPool.pendingRewards(staker1);
    const newPendingRewardsStaker2 = await mainPool.pendingRewards(staker2);
    const newPendingRewardsStaker3 = await mainPool.pendingRewards(staker3);

    // Pending rewards must be increase by 4 * rewardsPerBlock / weight
    assert.equal(
      newPendingRewardsStaker1.toString(),
      oldPendingRewardsStaker1
        .add(mainStakingPoolData.rewardsPerBlock.mul(getBN(4)).div(getBN(5)))
        .toString(),
      "Incorrect pendingRewards of staker1"
    );
    assert.equal(
      newPendingRewardsStaker2.toString(),
      oldPendingRewardsStaker2
        .add(
          mainStakingPoolData.rewardsPerBlock
            .mul(getBN(4))
            .div(getBN(5))
            .mul(getBN(3))
        )
        .toString(),
      "Incorrect pendingRewards of staker2"
    );

    assert.equal(
      newPendingRewardsStaker3.toString(),
      mainStakingPoolData.rewardsPerBlock
        .mul(getBN(4))
        .div(getBN(5))
        .toString(),
      "Incorrect pendingRewards of staker3"
    );
  });

  it("Staker1 can process his rewards and these are stacked again (weight test)", async () => {
    // advance 4 blocks
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    await processRewards(staker1);
  });

  it("Pending Rewards of staker1 should now be 0", async () => {
    const userNewPendingRewards = await mainPool.pendingRewards(staker1);

    assert.equal(
      userNewPendingRewards.toString(),
      "0",
      "Incorrect new pending rewards"
    );
  });

  it("Staker2 can't unstake his tokens (reason: deposit does not exist)", async () => {
    await expectRevert(
      mainPool.methods["unstake(uint256)"](2, {
        from: staker2,
      }),
      "Deposit does not exist"
    );
  });

  it("Staker2 can't unstake his tokens (reason: deposit not yet complete)", async () => {
    await expectRevert(
      mainPool.methods["unstake(uint256)"](0, {
        from: staker2,
      }),
      "Staking of this deposit is not yet complete"
    );
  });

  it("Staker3 can unstake his tokens after the locking period and his rewards are stacked", async () => {
    const deposit = await mainPool.getDeposit(staker3, 0);
    await time.increase(deposit.lockedUntil);

    await unstake(staker3, 0);
  });

  it("Staker3 can't unstake the same deposit a second time (reason: Deposit already claimed)", async () => {
    await expectRevert(
      mainPool.methods["unstake(uint256)"](0, {
        from: staker3,
      }),
      "Deposit already claimed"
    );
  });

  it("Remaining allocated tokens takes into account the number of rewarded tokens", async () => {
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    const blockPassed = await getPassedBlocks();

    const calculatedRemainingAllocatedTokens =
      mainStakingPoolData.allocatedTokens.sub(
        mainStakingPoolData.rewardsPerBlock.mul(blockPassed)
      );

    const remainingAllocatedTokens = await mainPool.remainingAllocatedTokens();

    assert.equal(
      calculatedRemainingAllocatedTokens.toString(),
      remainingAllocatedTokens.toString(),
      "Incorrect remainingAllocatedTokens"
    );
  });

  it("Admin or random user can't directly change rewardsPerBlock (reason: no owner)", async () => {
    await expectRevert(
      mainPool.setRewardsPerBlock(
        mainStakingPoolData.rewardsPerBlock.mul(getBN(2)),
        {
          from: staker2,
        }
      ),
      "Ownable: caller is not the owner"
    );
    await expectRevert(
      mainPool.setRewardsPerBlock(
        mainStakingPoolData.rewardsPerBlock.mul(getBN(2)),
        {
          from: owner,
        }
      ),
      "Ownable: caller is not the owner"
    );
  });

  it("Random user can refill the pool by sending own tokens", async () => {
    const amount = getAmount(10);
    const poolOldRemaining = await mainPool.remainingAllocatedTokens();

    await token.transfer(mainPool.address, amount, {
      from: staker1,
    });

    const poolNewRemaining = await mainPool.remainingAllocatedTokens();

    const expectedRemaining = poolOldRemaining
      .add(amount)
      // the remaining has decrease with the block of the transfer so rewards increased by one block
      .sub(mainStakingPoolData.rewardsPerBlock);

    assert.equal(
      poolNewRemaining.toString(),
      expectedRemaining.toString(),
      "Incorrect remainingAllocatedTokens"
    );
  });

  it("Admin can't change rewardsPerBlock through the factory (reason: Rewards per block must be greater than the previous one)", async () => {
    await expectRevert(
      factory.addAllocatedTokens(
        mainPool.address,
        getAmount(20),
        mainStakingPoolData.rewardsPerBlock.div(getBN(2)),
        {
          from: owner,
        }
      ),
      "Rewards per block must be greater than the previous one"
    );
  });

  it("Admin can refill the staking pool through the factory and change rewardsPerBlock", async () => {
    const amount = getAmount(20);
    const poolOldRemaining = await mainPool.remainingAllocatedTokens();
    const poolOldRewardsPerBlock = await mainPool.rewardsPerBlock();

    const newRewardsPerBlock = poolOldRemaining.add(amount).div(getBN(10)); // Pool must be empty in 10 blocks

    await factory.addAllocatedTokens(
      mainPool.address,
      amount,
      newRewardsPerBlock,
      {
        from: owner,
      }
    );
    mainStakingPoolData.rewardsPerBlock = newRewardsPerBlock;

    const poolNewRemaining = await mainPool.remainingAllocatedTokens();
    const poolNewRewardsPerBlock = await mainPool.rewardsPerBlock();

    const expectedRemaining = poolOldRemaining
      .add(amount)
      // the remaining has decrease with the block of the allocated (before rewardsPerBlock has changed)
      .sub(poolOldRewardsPerBlock);

    assert.equal(
      poolNewRemaining.toString(),
      expectedRemaining.toString(),
      "Incorrect remainingAllocatedTokens"
    );

    assert.equal(
      poolNewRewardsPerBlock.toString(),
      newRewardsPerBlock.toString(),
      "Incorrect rewardsPerBlock"
    );

    // Next block must increase rewards by the newRewardsPerBlock
    const poolOldUpdatedRewards = await mainPool.updatedTotalRewards();
    await time.advanceBlock();
    const poolNewUpdatedRewards = await mainPool.updatedTotalRewards();

    assert.equal(
      poolNewUpdatedRewards.toString(),
      poolOldUpdatedRewards.add(newRewardsPerBlock).toString(),
      "Incorrect updatedTotalRewards (not increase by the new rewardsPerBlock)"
    );
  });

  it("Stakers can unstake all tokens and rewards after locking periods (multiple unstake)", async () => {
    await time.increase(mainStakingPoolData.maxStakingTime);
    await time.advanceBlock();

    // Foreach users
    for (const user of Object.keys(usersDeposits)) {
      await unstake(
        user,
        usersDeposits[user]
          .filter((deposit) => deposit.amount > 0)
          .map((deposit) => deposit.id)
      );
    }
  });
  return;

  it("The rewards of the penultimate block must be lower than the rewards per block", async () => {
    const poolRewardsPerBlock = await mainPool.rewardsPerBlock();
    const poolRemaining = await mainPool.remainingAllocatedTokens();

    const blockNumber = poolRemaining.div(poolRewardsPerBlock).sub(getBN(1));
    const lastBlock = await time.latestBlock();

    // Advance to penultimate block
    await time.advanceBlockTo(lastBlock + blockNumber.toNumber());

    const poolNewRemaining = await mainPool.remainingAllocatedTokens();

    console.log("poolRewardsPerBlock", poolRewardsPerBlock.toString());
    console.log("poolNewRemaining", poolNewRemaining.toString());
  });

  it("The pool is now empty (no more remaining allocated tokens)", async () => {});

  it("Pending rewards does not increase if the pool is empty", async () => {
    // TODO
  });

  it("Stakers can unstake all rewards", async () => {
    // TODO
  });

  it("The pool must no longer have any tokens and totalUsersWeight and totalTokensStaked are 0", async () => {
    // TODO
  });
});
