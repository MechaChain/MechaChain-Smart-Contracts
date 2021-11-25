// Load modules
const { expectRevert } = require('@openzeppelin/test-helpers');

// Load artifacts
const Mechanium = artifacts.require('Mechanium');
const MechaniumPresaleDistribution = artifacts.require('MechaniumPresaleDistribution');

// Load utils
const { getAmount, getBN } = require('../utils');

contract('MechaniumPresaleDistribution', (accounts) => {
  let instance, token, gasUsedForMultipleTransactions, gasUsedForOneTransaction;

  it('Smart contract should be deployed', async () => {
    instance = await MechaniumPresaleDistribution.deployed();
    assert(instance.address !== '');
    token = await Mechanium.deployed();
  });

  it('Admin should be able to allocate tokens to multiple users', async () => {
    const amount = getAmount(1000);

    for (let i = 1; i <= accounts.length - 1; i++) {
      const _user = accounts[i];
      await instance.allocateTokens(_user, amount);
      const userBalance = await instance.balanceOf(_user);
      assert.equal(userBalance.cmp(amount), 0, "Allocated amout not valid");
    }
  });

  it('Admin should be able to start the vesting immediatly', async () => {
    await instance.startVesting();
    const hasStarted = await instance.hasVestingStarted();
    assert.equal(hasStarted, true, "Vesting should be started");
  });

  it('Admin should claim all users tokens', async () => {
    const oneClaimResponse = await instance.claimTokens(accounts[501]);
    gasUsedForOneTransaction = oneClaimResponse.receipt.gasUsed;

    const multipleClaimsResponse = await instance.claimTokensForAll();
    gasUsedForMultipleTransactions = multipleClaimsResponse.receipt.gasUsed;

    for (let i = 1; i < accounts.length - 1; i++) {
      const _user = accounts[i];
      await expectRevert(
        instance.claimTokens(_user),
        'No token can be unlocked for this account'
      );
    }
  });

  it('ClaimAll gas usage must be lower than claim one', async () => {
    console.log(`Gas used for one claim : ${gasUsedForOneTransaction}`);
    console.log(`${accounts.length - 2} x Gas used For one claim : ${getBN(gasUsedForOneTransaction).mul(getBN(accounts.length - 2))}`);
    console.log(`Gas used for claimAll function: ${gasUsedForMultipleTransactions}`);
    assert(getBN(gasUsedForMultipleTransactions).lt(getBN(gasUsedForOneTransaction).mul(getBN(accounts.length - 2))));
  });

});