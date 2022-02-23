// Load modules
const { time } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

// Load utils
const { getAmount, getRandom, getBN, getBNRange } = require("../utils");

contract("MechaniumStakingPoolFactory", (accounts) => {
  let instance, token, mainPool;

  const costs = [];
  const stakes = [];

  const mainStakingPoolData = {
    allocatedTokens: getAmount(1000000),
    initBlock: 0,
    minStakingTime: time.duration.days(10),
    maxStakingTime: time.duration.days(100),
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
      .div(WEIGHT_MULTIPLIER)
  }

  async function addCost(action, data) {
    const tx = await web3.eth.getTransaction(data.tx);

    const price = data.receipt.gasUsed * Number(tx.gasPrice);

    const priceETH = price / (10 ** 18);

    const cost = {
      action,
      gasUsed: data.receipt.gasUsed,
      gasPrice: Number(tx.gasPrice),
      price,
      priceETH
    };

    costs.push(cost);
  }

  async function stake(user, amount, duration) {
    await token.transfer(user, amount);
    await token.approve(mainPool.address, amount, { from: user });
    const txData = await mainPool.stake(
      amount,
      duration,
      { from: user }
    );

    stakes.push({
      user,
      amount,
      duration,
      weight: calculateWeight(amount, duration)
    });

    await addCost('Stake Tokens', txData);

    return txData;
  }

  it("Smart contract should be deployed", async () => {
    instance = await MechaniumStakingPoolFactory.deployed();
    assert(instance.address !== "");
    token = await Mechanium.deployed();
  });

  it("Create staking pool from factory", async () => {
    const txData = await instance.createPool(...Object.values(mainStakingPoolData));

    await addCost('Create Pool', txData);

    const mainPoolAddr = await instance.registeredPoolsList.call(0);
    mainPool = await MechaniumStakingPool.at(mainPoolAddr);

    assert(mainPool, "Pool not created");
  });

  it(`${accounts.length - 1} Users should stake tokens in pool`, async () => {
    for (let i = 1; i < accounts.length; i++) {
      const amount = getAmount(getRandom(100, 500));
      const stakeTime = time.duration.days(getRandom(10, 100));
      const user = accounts[i];

      await stake(user, amount, stakeTime);

      for (let b = 0; b <= getRandom(0, 3); b++) {
        await time.advanceBlock();
      }
    }
  });

  it("Check weight", async () => {
    const totalCalculatedWeight = stakes.reduce((prev, curr) => {
      prev = prev.add(curr.weight);
      return prev;
    }, getBN(0));

    const totalPoolWeight = await mainPool.totalUsersWeight();

    assert.equal(
      totalCalculatedWeight.toString(),
      totalPoolWeight.toString(),
      "Wrong total users weight"
    );
  });

  it("Process the rewards", async () => {
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      const txData = await mainPool.processRewards({ from: user });

      await addCost('Process Rewards', txData);
    }
  });

  it("Change reward per block", async () => {
    let amount = getAmount(20);

    const poolOldRemaining = await mainPool.remainingAllocatedTokens();

    const newRewardsPerBlock = poolOldRemaining.add(amount).div(getBN(20));
    amount = amount.add(newRewardsPerBlock.div(getBN(4)));

    const txData = await instance.addAllocatedTokens(
      mainPool.address,
      amount,
      newRewardsPerBlock
    );
    await addCost('Change reward per block', txData);
  });

  it("Reprocess the rewards", async () => {
    await time.increase(mainStakingPoolData.maxStakingTime);
    const latestBlock = await time.latestBlock();
    await time.advanceBlockTo(latestBlock.add(getBN(20)));

    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      const txData = await mainPool.processRewards({ from: user });

      await addCost('Process Rewards', txData);
    }
  });

  it("Unstake tokens for all users", async () => {
    await time.increase(mainStakingPoolData.maxStakingTime);
    await time.advanceBlock();

    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      const txData = await mainPool.methods["unstake(uint256[])"]([0, 1, 2], { from: user });
      await addCost('Unstake Deposit', txData);
    }

    const totalUsersWeight = await mainPool.totalUsersWeight();
    const totalTokensStaked = await mainPool.totalTokensStaked();

    console.log("totalUsersWeight :", totalUsersWeight.toString());
    console.log("totalTokensStaked :", totalTokensStaked.toString());
    const poolBalance = await token.balanceOf(mainPool.address);
    console.log("poolBalance :", poolBalance.toString());
    console.log("Tokens loss :", (poolBalance.toNumber() / (10 ** 18)));
  });

  /* it("Get stats on gas", async () => {
    console.log("<====== Avg. per Action ======>");
    const totalStats = costs.reduce((prev, curr) => {
      // Init
      prev[curr.action] = prev[curr.action] || {
        totalCalls: 0,
        totalGasUsed: 0,
        totalPrice: 0,
        totalPriceETH: 0,
        avgPriceETH: 0,
        minGasUsed: curr.gasUsed,
        minPriceETH: curr.priceETH,
        maxGasUsed: 0,
        maxPriceETH: 0,
      };

      // Calcul
      const value = prev[curr.action];

      value.totalCalls++;
      value.totalGasUsed += curr.gasUsed;
      value.totalPrice += curr.price;
      value.totalPriceETH += curr.priceETH;
      value.avgPriceETH = value.totalPriceETH / value.totalCalls;

      if (curr.gasUsed < value.minGasUsed) {
        value.minGasUsed = curr.gasUsed;
        value.minPriceETH = curr.priceETH;
      }

      if (curr.gasUsed > value.maxGasUsed) {
        value.maxGasUsed = curr.gasUsed;
        value.maxPriceETH = curr.priceETH;
      }

      return prev;
    }, {});

    Object.keys(totalStats).forEach((key) => {
      console.log(`======> Action : ${key}`);
      Object.keys(totalStats[key]).forEach((_key) => {
        console.log(`${_key} :`, totalStats[key][_key]);
      });
    });
  }); */
});
