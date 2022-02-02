// Load modules
const { time, expectRevert } = require('@openzeppelin/test-helpers');

// Load artifacts
const Mechanium = artifacts.require('Mechanium');
const MechaniumStakingPoolFactory = artifacts.require('MechaniumStakingPoolFactory');

// Load utils
const { getAmount, getBN } = require('../utils');

contract('MechaniumStakingPoolFactory', (accounts) => {
  const [owner, fakePool] = accounts;
  let instance, token, mainPoolAddr;

  const mainStakingPoolData = {
    allocatedTokens: getAmount(10000),
    initBlock: 123456,
    minStakingTime: time.duration.days(30),
    maxStakingTime: time.duration.days(360),
    minWeightMultiplier: 1,
    maxWeightMultiplier: 2,
    minRewardsPerBlock: getAmount(1)
  };

  it('Smart contract should be deployed', async () => {
    instance = await MechaniumStakingPoolFactory.deployed();
    assert(instance.address !== '');
    token = await Mechanium.deployed();
  });

  it('Owner should be able to create staking pool instance', async () => {
    await instance.createPool(...Object.values(mainStakingPoolData));

    const poolsList = await instance.registredPoolsList();
    mainPoolAddr = poolsList[poolsList.length - 1];

    assert(mainPoolAddr);

    const boolBalance = await token.balanceOf(mainPoolAddr);

    assert.equal(boolBalance.cmp(mainStakingPoolData.allocatedTokens), 0, "Wrong pool balance");
  });

  it('Owner should be able to add allocated tokens to pool', async () => {
    const amount = getAmount(10000);

    await instance.addAllocatedTokens(mainPoolAddr, amount);

    const boolBalance = await token.balanceOf(mainPoolAddr);

    mainStakingPoolData.allocatedTokens = mainStakingPoolData.allocatedTokens.add(amount);

    assert.equal(boolBalance.cmp(mainStakingPoolData.allocatedTokens), 0, "Wrong pool balance");

  });

  it('Owner should not be able to allocate to a non registred pool', async () => {
    await expectRevert(
      instance.addAllocatedTokens(fakePool, getAmount(10000)),
      "Staking pool not registred"
    );
  });

  it('Owner should not be able to allocate an amount of 0', async () => {
    await expectRevert(
      instance.addAllocatedTokens(mainPoolAddr, getAmount(0)),
      "Amount must be superior to zero"
    );
  });

  it('Owner should not be able to allocate more tokens thant the factory balance', async () => {
    await expectRevert(
      instance.addAllocatedTokens(mainPoolAddr, getAmount(10000000)),
      "Not enough tokens in factory"
    );
  });

  it('Owner should not be able to withdraw to address(0)', async () => {
    await expectRevert(
      instance.withdrawUnallocated("0x0000000000000000000000000000000000000000", getAmount(1000)),
      "Address must not be 0"
    );
  });

  it('Owner should not be able to withdraw an amount of 0', async () => {
    await expectRevert(
      instance.withdrawUnallocated(owner, getAmount(0)),
      "Amount must be superior to zero"
    );
  });

  it('Owner should not be able to withdraw more than factory balance', async () => {
    await expectRevert(
      instance.withdrawUnallocated(owner, getAmount(10000000)),
      "Not enough tokens in factory"
    );
  });

  it('Owner should be able to withdraw unallocated tokens', async () => {
    const amount = getAmount(10000);
    const oldOwnerBalance = await token.balanceOf(owner);

    await instance.withdrawUnallocated(owner, amount);

    const newOwnerBalance = await token.balanceOf(owner);

    assert.equal(newOwnerBalance.cmp(oldOwnerBalance.add(amount)), 0, "Wrong owner balance");
  });

  it('Owner should not be able to get unregistred pool data', async () => {
    await expectRevert(
      instance.getPoolData(fakePool),
      "Pool not registred"
    );
  });

  it('Owner should be able to get registred pool data', async () => {
    const poolData = await instance.getPoolData(mainPoolAddr);

    Object.keys(mainStakingPoolData).forEach(key => {
      const initialValue = mainStakingPoolData[key];
      const poolValue = poolData[key];
      assert(initialValue.toString() === poolValue, `Wrong ${key} value`);
    });
  });
});