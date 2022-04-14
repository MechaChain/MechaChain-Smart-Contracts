// Load modules
const { time } = require("@openzeppelin/test-helpers");

// Load artifacts
const Mechanium = artifacts.require("Mechanium");
const MechaniumStakingPoolFactory = artifacts.require(
  "MechaniumStakingPoolFactory"
);
const MechaniumStakingPool = artifacts.require("MechaniumStakingPool");

// Load utils
const { getAmount } = require("../utils");

contract("MechaniumStakingPoolFactory", (accounts) => {
  const [owner, user1, user2, user3] = accounts;
  let instance, token, mainPool;

  const costs = [];

  const mainStakingPoolData = {
    allocatedTokens: getAmount(100000),
    initBlock: 0,
    minStakingTime: time.duration.days(30),
    maxStakingTime: time.duration.days(360),
    minWeightMultiplier: 1,
    maxWeightMultiplier: 2,
    rewardsLockingPeriod: time.duration.days(90),
    rewardsPerBlock: getAmount(1),
  };

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

  it("Users stake tokens in pool", async () => {
    /* ======= USER 1 ======= */
    const amount = getAmount(100);
    txData = await stake(user1, amount, time.duration.days(30));

    /* ======= USER 2 ======= */
    txData = await stake(user2, amount, time.duration.days(30));

    txData = await stake(user2, amount, time.duration.days(360));

    /* ======= USER 3 ======= */
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(30));
    txData = await stake(user3, amount, time.duration.days(90));

    /* ======= USER 1 ( after 10 days ) ======= */
    await time.increase(time.duration.days(10));
    txData = await stake(user1, amount, time.duration.days(30));

    /* ======= USER 1 ( after 20 days ) ======= */
    await time.increase(time.duration.days(10));
    txData = await stake(user1, amount, time.duration.days(30));
  });

  it("Update rewards", async () => {
    const txData = await mainPool.updateRewards();

    await addCost('Update Rewards', txData);
  });

  it("Process the rewards", async () => {
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();
    await time.advanceBlock();

    const txData = await mainPool.processRewards({ from: user1 });

    await addCost('Process Rewards', txData);
  });

  it("Unstake tokens ( 1 deposit )", async () => {
    await time.increase(time.duration.days(50));

    const txData = await mainPool.methods["unstake(uint256)"](0, { from: user1 });

    await addCost('Unstake Deposit', txData);
  });

  it("Unstake tokens ( 2 deposits )", async () => {
    await time.increase(time.duration.days(50));

    const txData = await mainPool.methods["unstake(uint256[])"]([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { from: user3 });

    await addCost('Unstake Multiple Deposits', txData);
  });

  it("Get stats on gas", async () => {
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
  });
});
