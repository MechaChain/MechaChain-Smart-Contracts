// Load modules
const { time } = require("@openzeppelin/test-helpers");
const cliProgress = require("cli-progress");
const web3Utils = require("web3-utils");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

// Load utils
const {
  getAmount,
  getRandom,
  getBN,
  getBNRange,
  gasTracker,
} = require("../utils");

contract("MechaniumStakingPoolFactory", (accounts) => {
  let instance, token, mainPool, initBlock;

  const stakes = [];

  const CONFIG = {
    stakedAmount: {
      min: 100,
      max: 1000,
    },
    stakedTimeInDays: {
      min: 10,
      max: 100,
    },
    stakesPerUsers: {
      min: 1,
      max: 3,
    },
    blockAdvanceBeforeStake: {
      min: 10,
      max: 100,
    },
    blockAdvanceBeforeProcessRewards: {
      min: 50,
      max: 100,
    },
  };

  const mainStakingPoolData = {
    allocatedTokens: getAmount(1000000),
    initBlock: 0,
    minStakingTime: time.duration.days(CONFIG.stakedTimeInDays.min),
    maxStakingTime: time.duration.days(CONFIG.stakedTimeInDays.max),
    minWeightMultiplier: getBN(1),
    maxWeightMultiplier: getBN(2),
    rewardsLockingPeriod: time.duration.days(90),
    rewardsPerBlock: getAmount(1),
  };

  const WEIGHT_MULTIPLIER = getBN(1e12);

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

  const calculateWeight = (amount, stakingTime) => {
    return amount
      .mul(getWeightMultiplierRange(stakingTime))
      .div(WEIGHT_MULTIPLIER);
  };

  async function stake(user, amount, duration) {
    await token.transfer(user, amount);
    await token.approve(mainPool.address, amount, { from: user });
    const txData = await mainPool.stake(amount, duration, { from: user });

    const stakeId = stakes.filter((stake) => stake.user === user).length;
    stakes.push({
      user,
      amount,
      stakeId,
      duration,
      weight: calculateWeight(amount, duration),
    });
    await gasTracker.addCost(`Stake Tokens n°${stakeId + 1}`, txData);

    return txData;
  }
  it("Smart contract should be deployed", async () => {
    instance = await MechaniumStakingPoolFactory.deployed();
    assert(instance.address !== "");
    token = await Mechanium.deployed();
  });

  it("Create staking pool from factory", async () => {
    const txData = await instance.createPool(
      ...Object.values(mainStakingPoolData)
    );

    await gasTracker.addCost("Create Pool", txData);

    const mainPoolAddr = await instance.registeredPoolsList.call(0);
    mainPool = await MechaniumStakingPool.at(mainPoolAddr);
    initBlock = await time.latestBlock();

    assert(mainPool, "Pool not created");
  });

  it(`${accounts.length} Users should stake tokens in pool`, async () => {
    // Set progress bar
    console.log("\tWait while users stake tokens in pool...");
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tStaking: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length, 0);

    // Foreach users
    for (let i = 0; i < accounts.length; i++) {
      const user = accounts[i];

      // Launch multiple stakes
      const stakeNumber = getRandom(
        CONFIG.stakesPerUsers.min,
        CONFIG.stakesPerUsers.max
      );
      for (let b = 0; b < stakeNumber; b++) {
        // Advance some blocks
        const passBlockNumber = getRandom(
          CONFIG.blockAdvanceBeforeStake.min,
          CONFIG.blockAdvanceBeforeStake.max
        );
        const latestBlock = await time.latestBlock();
        await time.advanceBlockTo(latestBlock.add(getBN(passBlockNumber)));

        const amount = getAmount(
          getRandom(CONFIG.stakedAmount.min, CONFIG.stakedAmount.max)
        );
        const stakeTime = time.duration.days(
          getRandom(CONFIG.stakedTimeInDays.min, CONFIG.stakedTimeInDays.max)
        );
        await stake(user, amount, stakeTime);
      }

      // Progress
      progressBar.increment();
    }

    progressBar.stop();
  });

  it("Process the rewards", async () => {
    // Advance 10 blocks
    await Promise.all(Array(10).fill(time.advanceBlock()));

    // Set progress bar
    console.log("\tWait while users process their rewards...");
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tProcess rewards: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length, 0);

    // Process rewards
    for (let i = 0; i < accounts.length; i++) {
      // Advance some blocks
      const passBlockNumber = getRandom(
        CONFIG.blockAdvanceBeforeProcessRewards.min,
        CONFIG.blockAdvanceBeforeProcessRewards.max
      );
      const latestBlock = await time.latestBlock();
      await time.advanceBlockTo(latestBlock.add(getBN(passBlockNumber)));

      const user = accounts[i];
      const txData = await mainPool.processRewards({ from: user });

      await gasTracker.addCost("Process Rewards", txData);

      progressBar.increment();
    }

    progressBar.stop();
  });

  it("Change reward per block", async () => {
    let amount = getAmount(20);

    const poolOldRemaining = await mainPool.remainingAllocatedTokens();

    const newRewardsPerBlock = poolOldRemaining.add(amount).div(getBN(100)); // Pool is empty in 100 blocks
    amount = amount.add(newRewardsPerBlock.div(getBN(4)));

    const txData = await instance.addAllocatedTokens(
      mainPool.address,
      amount,
      newRewardsPerBlock
    );
  });

  it("Reprocess the rewards after the pool is empty", async () => {
    await time.increase(mainStakingPoolData.maxStakingTime);
    const latestBlock = await time.latestBlock();
    await time.advanceBlockTo(latestBlock.add(getBN(100))); // 100 blocks after, the pool is empty

    // Set progress bar
    console.log("\tWait while users process their rewards...");
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tProcess rewards: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length, 0);

    // Process rewards
    for (let i = 0; i < accounts.length; i++) {
      const user = accounts[i];
      const txData = await mainPool.processRewards({ from: user });

      await gasTracker.addCost("Process Rewards", txData);

      progressBar.increment();
    }

    progressBar.stop();
  });

  it("Unstake tokens for all users", async () => {
    await time.increase(mainStakingPoolData.maxStakingTime);
    await time.advanceBlock();

    // Set progress bar
    console.log("\tWait while users process their rewards...");
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tProcess rewards: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length, 0);

    // Unstake
    for (let i = 0; i < accounts.length; i++) {
      const user = accounts[i];
      const userDepositsLength = await mainPool.getDepositsLength(user);
      const depositIds = [...Array(userDepositsLength.toNumber()).keys()];

      const txData = await mainPool.methods["unstake(uint256[])"](depositIds, {
        from: user,
      });
      await gasTracker.addCost(`Unstake ${depositIds.length} Deposits`, txData);

      progressBar.increment();
    }

    progressBar.stop();
  });

  it("The pool must no longer have any tokens (>1 000 $MECHA) and totalUsersWeight and totalTokensStaked are 0", async () => {
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    const poolBalance = await token.balanceOf(mainPool.address);
    const totalUsersWeight = await mainPool.totalUsersWeight();
    const totalTokensStaked = await mainPool.totalTokensStaked();

    assert.equal(
      totalTokensStaked.toString(),
      "0",
      "Incorrect totalTokensStaked"
    );
    assert.equal(
      totalUsersWeight.toString(),
      "0",
      "Incorrect totalUsersWeight"
    );

    const poolBalanceOnMecha = web3Utils.fromWei(poolBalance, "ether");
    console.log(
      "\tTokens loss at the end of the pool :",
      poolBalanceOnMecha,
      " $MECHA"
    );
    assert.equal(
      poolBalance.cmp(getAmount(1000)),
      -1,
      "Incorrect pool balance (must not exceed 1 000 $MECHA of loss)"
    );

    const latestBlock = await time.latestBlock();
    console.log(
      "\tNumber of blocks passed:",
      latestBlock.sub(initBlock).toString()
    );
  });

  it("Get stats on gas", async () => {
    gasTracker.consoleStats();
  });
});
