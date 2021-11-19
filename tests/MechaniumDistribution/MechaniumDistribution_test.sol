// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol";

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../contracts/Mechanium.sol";
import "../contracts/MechaniumDistribution/MechaniumDistribution.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract myTestSuite is MechaniumDistribution {
    using SafeMath for uint256;

    constructor() MechaniumDistribution(new Mechanium(address(this))) {}

    address ownerAcc;
    address allocatorAcc;
    address userAcc;

    uint256 constant decimals = 18;

    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        /// Set accounts
        ownerAcc = TestsAccounts.getAccount(0);
        allocatorAcc = TestsAccounts.getAccount(1);
        userAcc = TestsAccounts.getAccount(2);

        grantRole(DEFAULT_ADMIN_ROLE, ownerAcc);
    }

    /**
     * =======================
     *         Private
     * =======================
     */

    /**
     * Get amount in decimals
     */
    function getAmount(uint256 amount) private returns (uint256) {
        return amount * (10**decimals);
    }

    /**
     * =======================
     *         Public
     * =======================
     */

    /**
     * Requirement: Account 1 must not have role ( ALLOCATOR_ROLE )
     */
    function checkNotAllocatorRole() public {
        bool hasAllocatorRole = hasRole(ALLOCATOR_ROLE, allocatorAcc);
        Assert.equal(
            hasAllocatorRole,
            false,
            "Account 1 should not have allocator role"
        );
    }

    /**
     * Requirement: Account 1 must have role ( ALLOCATOR_ROLE )
     */
    function checkAllocatorRole() public {
        grantRole(ALLOCATOR_ROLE, allocatorAcc);
        bool hasAllocatorRole = hasRole(ALLOCATOR_ROLE, allocatorAcc);
        Assert.equal(
            hasAllocatorRole,
            true,
            "Account 1 should have allocator role"
        );
    }

    /**
     * ~~ Should Fail ~~
     * Requirement: Account 1 must not be able to allocate tokens ( Reason : No balance )
     * #sender: account-1
     */
    function shouldFail_AllocationIfNoBalance() public {
        uint256 amount = getAmount(1000000000000);

        allocateTokens(userAcc, amount);
    }

    /**
     * Requirement: Contract must have transfered amount in balance
     */
    function checkHasBalance() public {
        uint256 amount = getAmount(100000000);
        uint256 currentBalance = _token.balanceOf(address(this));
        Assert.equal(currentBalance, amount, "Balance not valid");
    }

    /**
     * Requirement: Vesting must not be started
     */
    function checkVestingNotStarted() public {
        bool hasStarted = hasVestingStarted();
        Assert.equal(hasStarted, false, "Vesting should not be started");
    }

    /**
     * Requirement: Account 1 must be able to allocate tokens
     * #sender: account-1
     */
    function checkAllocateToUser() public {
        uint256 amount = getAmount(100);
        allocateTokens(userAcc, amount);
        uint256 userBalance = balanceOf(userAcc);
        Assert.equal(userBalance, amount, "Allocated amout not valid");
    }

    /**
     * Requirement: User's balance must increase
     * #sender: account-1
     */
    function checkAllocateBalanceIncrease() public {
        uint256 oldUserBalance = balanceOf(userAcc);
        uint256 amount = getAmount(100);
        allocateTokens(userAcc, amount);
        uint256 newUserBalance = balanceOf(userAcc);
        Assert.equal(
            newUserBalance,
            oldUserBalance.add(amount),
            "Allocated amout not valid"
        );
    }

    /**
     * Requirement: User's balance should still be locked ( Reason : vesting not started )
     */
    function checkAllocatedAmountStillLocked() public {
        uint256 unlockableAmount = unlockableTokens(userAcc);

        Assert.equal(unlockableAmount, 0, "Amount must be 0");
    }

    /**
     * Requirement: Vesting starting time must change
     */
    function checkChangeVestingStartTime() public {
        uint256 time = block.timestamp.add(3 days);

        startVesting(time);
        bool hasStarted = hasVestingStarted();
        Assert.equal(hasStarted, false, "Vesting should not be started");

        Assert.equal(vestingStartingTime, time, "Vesting start time not valid");
    }

    /**
     * ~~ Should Fail ~~
     * Requirement: Vesting starting time must not change ( Reason : Start time over limit )
     */
    function shouldFail_ChangeVestingStartTimeIfOverMaxTime() public {
        uint256 time = block.timestamp.add(200 days);

        startVesting(time);
    }

    /**
     * ~~ Should Fail ~~
     * Requirement: Account 2 must not be able to allocate tokens ( Reason : No access )
     * #sender: account-2
     */
    function shouldFail_AllocationIfNoAccess() public {
        uint256 amount = getAmount(10000000);

        allocateTokens(userAcc, amount);
    }

    /**
     * Requirement: Vesting must be started
     */
    function checkVestingStarted() public {
        startVesting();
        bool hasStarted = hasVestingStarted();
        Assert.equal(hasStarted, true, "Vesting should be started");
    }

    /**
     * ~~ Should fail ~~
     * Requirement: Account 1 must not be able to allocate tokens ( Reason : Vesting Started )
     * #sender: account-1
     */
    function shouldFail_AllocationIfVestingStarted() public {
        uint256 amount = getAmount(100);

        allocateTokens(userAcc, amount);
    }

    /**
     * Requirement: 20% of users's balance should be unlocked
     */
    function checkAllocatedAmountUnlocked() public {
        uint256 userBalance = balanceOf(userAcc);
        uint256 unlockableAmount = unlockableTokens(userAcc);

        uint256 expectedUnlockableAmount = userBalance.div(5);

        Assert.equal(
            unlockableAmount,
            expectedUnlockableAmount,
            "Amount must be 20% of the balance"
        );
    }

    /**
     * Requirement: Claimed tokens must be 20% of the balance
     */
    function checkClaimUnlockedTokens() public {
        uint256 oldUserBalance = balanceOf(userAcc);
        uint256 expectedClaimedAmount = oldUserBalance.div(5);
        uint256 restUserBalance = oldUserBalance.sub(expectedClaimedAmount);

        claimTokens(userAcc);

        uint256 userTokenBalance = _token.balanceOf(userAcc);

        Assert.equal(
            userTokenBalance,
            expectedClaimedAmount,
            "Claimend amount must be 20% of the balance"
        );

        uint256 newUserBalance = balanceOf(userAcc);

        Assert.equal(
            newUserBalance,
            restUserBalance,
            "Rest user balance must be 80% of the old balance"
        );
    }

    /**
     * Requirement: Must set pool address
     */
    function checkSetPTEPool() public {
        address addrToSet = address(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);

        setPTEPool(addrToSet);

        Assert.equal(addrToSet, _ptePoolAddress, "PTE pool address not set");
    }

    /**
     * ~~ Should Fail ~~
     * Requirement: Account 2 must not set pool address ( Reason: No access )
     * #sender: account-2
     */
    function shouldFail_SetPTEPool() public {
        address addrToSet = address(0x583031D1113aD414F02576BD6afaBfb302140225);

        setPTEPool(addrToSet);
    }

    /**
     * Requirement: Must transfer all unallocated tokens to PTE Pool
     */
    function checkTransferToPTEPool() public {
        uint256 unallocated = totalUnallocatedTokens();
        transfertToPTEPool();
        uint256 ptePoolBalance = _token.balanceOf(_ptePoolAddress);
        Assert.equal(
            ptePoolBalance,
            unallocated,
            "PTE Pool balance not correct"
        );
    }
}
