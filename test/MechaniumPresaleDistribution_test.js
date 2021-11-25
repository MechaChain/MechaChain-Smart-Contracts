// Load modules
const { time, expectRevert } = require('@openzeppelin/test-helpers');

// Load artifacts
const Mechanium = artifacts.require('Mechanium');
const MechaniumPresaleDistribution = artifacts.require('MechaniumPresaleDistribution');
const StakingPool = artifacts.require('StakingPool');

// Load utils
const { getAmount, getBN } = require('../utils');

contract('MechaniumPresaleDistribution', (accounts) => {
  const [owner, allocator, user, ptePoolAddr] = accounts;
  let instance, token, stakingPool, ALLOCATOR_ROLE, DEFAULT_ADMIN_ROLE;

  it('Smart contract should be deployed', async () => {
    instance = await MechaniumPresaleDistribution.deployed();
    assert(instance.address !== '');
    token = await Mechanium.deployed();
    stakingPool = await StakingPool.deployed();
    DEFAULT_ADMIN_ROLE = await instance.DEFAULT_ADMIN_ROLE();
  });

  it('Allocator account should not have ALLOCATOR_ROLE', async () => {
    ALLOCATOR_ROLE = await instance.ALLOCATOR_ROLE();
    const hasAllocatorRole = await instance.hasRole(ALLOCATOR_ROLE, allocator);
    assert(!hasAllocatorRole);
  });

  it('Admin should be able to set ALLOCATOR_ROLE', async () => {
    await instance.grantRole(ALLOCATOR_ROLE, allocator);
    const hasAllocatorRole = await instance.hasRole(ALLOCATOR_ROLE, allocator);
    assert(hasAllocatorRole);
  });

  it('Allocator should not be able to allocate amount superior to balance', async () => {
    const amount = getAmount(1000000000000);

    await expectRevert(
      instance.allocateTokens(user, amount, { from: allocator }),
      'The contract does not have enough available token to allocate -- Reason given: The contract does not have enough available token to allocate.'
    );
  });

  it('User should not be able to allocate tokens', async () => {
    const amount = getAmount(10);
    await expectRevert(
      instance.allocateTokens(user, amount, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${ALLOCATOR_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${ALLOCATOR_ROLE.toLowerCase()}.`
    );
  });

  it('Contract should have 10M of balance', async () => {
    const amount = getAmount(10000000);
    const balance = await token.balanceOf(instance.address);
    assert.equal(amount.cmp(balance), 0, 'Balance not valid');
  });

  it('Vesting should not be started if starting time has not arrived', async () => {
    const hasStarted = await instance.hasVestingStarted();
    assert.equal(hasStarted, false, "Vesting should not be started");
  });

  it('Allocator should be able to allocate tokens to multiple users', async () => {
    const amount = getAmount(100);
    for (let i = 4; i < 10; i++) {
      const _user = accounts[i];
      await instance.allocateTokens(_user, amount, { from: allocator });
      const userBalance = await instance.balanceOf(_user);
      assert.equal(userBalance.cmp(amount), 0, "Allocated amout not valid");
    }
  });

  it('Allocator should be able to allocate tokens to user', async () => {
    const amount = getAmount(100);
    await instance.allocateTokens(user, amount, { from: allocator });
    const userBalance = await instance.balanceOf(user);
    assert.equal(userBalance.cmp(amount), 0, "Allocated amout not valid");
  });

  it('User balance should increase after allocation', async () => {
    const oldUserBalance = await instance.balanceOf(user);
    const amount = getAmount(100);
    await instance.allocateTokens(user, amount, { from: allocator });
    const newUserBalance = await instance.balanceOf(user);

    assert.equal(
      newUserBalance.cmp(oldUserBalance.add(amount)), 0,
      "Allocated amout not valid"
    );
  });

  it('User balance should be locked if vesting time not started', async () => {
    const unlockableAmount = await instance.unlockableTokens(user);

    assert.equal(unlockableAmount.cmp(getAmount(0)), 0, "Amount must be 0");
  });

  it('Admin should be able to change vesting start time', async () => {
    let timeToSet = await time.latest();
    timeToSet = timeToSet.add(time.duration.days(3))

    await instance.startVesting(timeToSet);
    const hasStarted = await instance.hasVestingStarted();
    assert.equal(hasStarted, false, "Vesting should not be started");

    const vestingStartingTime = await instance.vestingStartingTime();

    assert.equal(vestingStartingTime.cmp(timeToSet), 0, "Vesting start time not valid");
  });

  it('Admin should not be able to set vesting start time after max start time', async () => {
    let timeToSet = await time.latest();
    timeToSet = timeToSet.add(time.duration.days(200));

    await expectRevert(
      instance.startVesting(timeToSet),
      'Vesting start time must not be more than 6 months -- Reason given: Vesting start time must not be more than 6 months.'
    );
  });

  it('Admin should not be able to transfer unallocated tokens to PTE pool if the vesting has not started', async () => {
    await expectRevert(
      instance.transferUnsoldToPTEPool(),
      `The vesting schedule has not started yet -- Reason given: The vesting schedule has not started yet.`,
    )
  });

  it('Admin should not be able to claim user tokens if vesting has not started', async () => {
    await expectRevert(
      instance.claimTokens(user),
      `No token can be unlocked for this account -- Reason given: No token can be unlocked for this account.`,
    )
  });

  it('Admin should be able to start the vesting immediatly', async () => {
    await instance.startVesting();
    const hasStarted = await instance.hasVestingStarted();
    assert.equal(hasStarted, true, "Vesting should be started");
  });

  it('Allocator should be able to allocate tokens if the vesting has started', async () => {
    const amount = getAmount(10);
    await expectRevert(
      instance.allocateTokens(user, amount, { from: allocator }),
      `The vesting schedule has already started -- Reason given: The vesting schedule has already started.`
    );
  });

  it('Unlockable amount must be 20% of total user balance ( first month )', async () => {
    const userBalance = await instance.balanceOf(user);
    const unlockableAmount = await instance.unlockableTokens(user);

    const expectedUnlockableAmount = userBalance.div(getBN(5));

    assert.equal(
      unlockableAmount.cmp(expectedUnlockableAmount),
      0,
      "Amount must be 20% of the balance"
    );
  });

  it('Pending tokens must be calculated per seconds', async () => {
    const diff = time.duration.days(2);
    await time.increase(diff);
    const vct = await instance.vestingClockTime();
    const vpc = await instance.vestingPerClock();

    const balance = await instance.allocatedTokensOf(user);
    const divPerClock = getBN(100).div(vpc);
    const releasePerClock = balance.div(divPerClock);
    const releasePerSecond = releasePerClock.div(vct);
    let toRelease = releasePerSecond.mul(diff);
    const unlockableTokens = await instance.unlockableTokens(user);
    toRelease = toRelease.add(unlockableTokens);
    toRelease = toRelease.div(getBN(10 ** 12));

    let pendingTokens = await instance.pendingTokensOf(user);
    pendingTokens = pendingTokens.div(getBN(10 ** 12));

    assert.equal(toRelease.toString(), pendingTokens.toString(), 'Pending tokens not valid');
  });

  it('Admin should claim user\'s unlockable tokens ( 20% )', async () => {
    const oldUserBalance = await instance.balanceOf(user);
    const expectedClaimedAmount = oldUserBalance.div(getBN(5));
    const restUserBalance = oldUserBalance.sub(expectedClaimedAmount);

    await instance.claimTokens(user);

    const userTokenBalance = await token.balanceOf(user);

    assert.equal(
      userTokenBalance.cmp(expectedClaimedAmount),
      0,
      "Claimend amount must be 20% of the balance"
    );

    const newUserBalance = await instance.balanceOf(user);

    assert.equal(
      newUserBalance.cmp(restUserBalance),
      0,
      "Rest user balance must be 80% of the total allocated tokes"
    );
  });

  it('Admin should not be able to claim user\'s tokens in same period', async () => {
    await expectRevert(
      instance.claimTokens(user),
      `No token can be unlocked for this account -- Reason given: No token can be unlocked for this account.`,
    )
  });

  it('Admin should set pte pool address', async () => {
    await instance.setPTEPool(ptePoolAddr);

    const _ptePoolAddress = await instance.getPTEPoolAddress();

    assert.equal(ptePoolAddr, _ptePoolAddress, "PTE pool address not set");
  });

  it('User shoud not be able to transfer to staking pool if the staking pool is not set', async () => {
    const _user = accounts[9];

    await expectRevert(
      instance.transferToStakingPool({ from: _user }),
      'Staking pool address is not set',
    );
  });

  it('Admin shoud be able to set staking pool address', async () => {
    await instance.setStakingPool(stakingPool.address);

    const stakingPoolAddress = await instance.getStakingPoolAddress();

    assert.equal(stakingPool.address, stakingPoolAddress, 'Staking pool address not valid');
  });

  it('User shoud not be able to set staking pool address', async () => {
    await expectRevert(
      instance.setStakingPool(stakingPool.address, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`,
    );
  });

  it('User shoud be able to transfer all unclaimed tokens to staking pool', async () => {
    const _user = accounts[9];
    const userBalance = await instance.balanceOf(_user);

    await instance.transferToStakingPool({ from: _user });

    const stakedBalance = await stakingPool.balanceOf(_user);

    const contractTokens = await token.balanceOf(stakingPool.address);

    assert.equal(contractTokens.cmp(stakedBalance), 0, 'Staking Contract balance not valid');
    assert.equal(userBalance.cmp(stakedBalance), 0, 'User staking balance not valid');
  });

  it('User should not set pte pool address', async () => {
    await expectRevert(
      instance.setPTEPool(ptePoolAddr, { from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`,
    )
  });

  it('Admin should be able to transfer unallocated tokens to PTE pool once the vesting has started', async () => {
    const unallocated = await instance.totalUnallocatedTokens();
    await instance.transferUnsoldToPTEPool();
    const ptePoolBalance = await token.balanceOf(ptePoolAddr);
    assert.equal(
      ptePoolBalance.cmp(unallocated),
      0,
      "PTE Pool balance not correct"
    );
  });

  it('User should not be able to transfer unallocated tokens to PTE pool', async () => {
    await expectRevert(
      instance.transferUnsoldToPTEPool({ from: user }),
      `AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()} -- Reason given: AccessControl: account ${user.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE.toLowerCase()}.`,
    )
  });

  it('Unlockable amount must be 60% of total allocated tokens ( after 60 days )', async () => {
    await time.increase(time.duration.days(63));

    let userBalance = await instance.balanceOf(user);
    const releaseUserTokens = await instance.releasedTokensOf(user);
    const unlockableAmount = await instance.unlockableTokens(user);
    userBalance = userBalance.add(releaseUserTokens);

    const expectedUnlockableAmount = userBalance.div(getBN(5)).mul(getBN(2));

    assert.equal(
      unlockableAmount.cmp(expectedUnlockableAmount),
      0,
      "Amount must be 60% of the balance"
    );
  });

  it('Admin should claim user\'s unlockable tokens ( 60% )', async () => {
    const oldUserBalance = await instance.balanceOf(user);
    const releaseUserTokens = await instance.releasedTokensOf(user);
    const totalUserBalance = await instance.allocatedTokensOf(user);
    const expectedClaimedAmount = totalUserBalance.div(getBN(5)).mul(getBN(2));

    const restUserBalance = oldUserBalance.sub(expectedClaimedAmount);

    await instance.claimTokens(user);

    const userTokenBalance = await token.balanceOf(user);

    assert.equal(
      userTokenBalance.cmp(expectedClaimedAmount.add(releaseUserTokens)),
      0,
      "Claimend amount must be 60% of the balance"
    );

    const newUserBalance = await instance.balanceOf(user);

    assert.equal(
      newUserBalance.cmp(restUserBalance),
      0,
      "Rest user balance must be 40% of the total allocated tokes"
    );
  });

  it('Unlockable amount must be 100% of total user balance ( after 5 months )', async () => {
    await time.increase(time.duration.days(90));

    let userBalance = await instance.balanceOf(user);
    const releaseUserTokens = await instance.releasedTokensOf(user);
    const unlockableAmount = await instance.unlockableTokens(user);
    userBalance = userBalance.add(releaseUserTokens);

    const expectedUnlockableAmount = userBalance.div(getBN(5)).mul(getBN(2));

    assert.equal(
      unlockableAmount.cmp(expectedUnlockableAmount),
      0,
      "Amount must be 100% of the balance"
    );
  });

  it('Admin should claim user\'s unlockable tokens ( 100% )', async () => {
    const oldUserBalance = await instance.balanceOf(user);
    const releaseUserTokens = await instance.releasedTokensOf(user);
    const totalUserBalance = await instance.allocatedTokensOf(user);
    const expectedClaimedAmount = totalUserBalance.div(getBN(5)).mul(getBN(2));

    const restUserBalance = oldUserBalance.sub(expectedClaimedAmount);

    await instance.claimTokens(user);

    const userTokenBalance = await token.balanceOf(user);

    assert.equal(
      userTokenBalance.cmp(expectedClaimedAmount.add(releaseUserTokens)),
      0,
      "Claimend amount must be 100% of the balance"
    );

    const newUserBalance = await instance.balanceOf(user);

    assert.equal(
      newUserBalance.cmp(restUserBalance),
      0,
      "Rest user balance must be 0% of the total allocated tokes"
    );
  });

  it('Admin should not be able to claim user\'s tokens after they where all claimed', async () => {
    await expectRevert(
      instance.claimTokens(user),
      `No token can be unlocked for this account -- Reason given: No token can be unlocked for this account.`,
    )
  });

  it('Admin should claim all users tokens', async () => {
    await instance.claimTokensForAll();

    for (let i = 4; i < 10; i++) {
      const _user = accounts[i];
      await expectRevert(
        instance.claimTokens(_user),
        'No token can be unlocked for this account'
      );
    }
  });

  it('Admin should not be able to claim all users tokens once they are already claimed', async () => {
    await expectRevert(
      instance.claimTokensForAll(),
      'No token can be unlocked'
    );
  });
});