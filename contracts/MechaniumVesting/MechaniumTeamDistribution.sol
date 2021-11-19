// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MechaniumVesting.sol";

/**
 * @title MechaniumTeamDistribution - Vesting and distribution smart contract for the mechachain team
 * @notice Can manage multiple allocations with a specific schedule to each
 */
contract MechaniumTeamDistribution is MechaniumVesting {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    /**
     * ========================
     *  Constants & Immutables
     * ========================
     */

    /// Number of seconds to wait between allocation and the start of the schedule
    uint256 private immutable _timeBeforeStarting;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// Counter for allocation id
    Counters.Counter internal _allocationIdCounter;

    /// Mapping of allocationId/allocated tokens
    mapping(uint256 => uint256) public tokensPerAllocation;

    /// Mapping of allocationId/wallet tokens
    mapping(uint256 => address) public walletPerAllocation;

    /// Mapping of startingTime/allocationId tokens
    mapping(uint256 => uint256) public startingTimePerAllocation;

    /// Mapping of wallet/array of allocationId tokens
    mapping(address => uint256[]) internal _ownedAllocation;

    /**
     * ========================
     *     Public Functions
     * ========================
     */
    /**
     * @dev Contract constructor sets the configuration of the vesting schedule
     * @param token_ Address of the ERC20 token contract, this address cannot be changed later
     * @param timeBeforeStarting Number of seconds to wait between allocation and the start of the schedule
     * @param vestingPerClock Percentage of unlocked tokens per _vestingClockTime once the vesting schedule has started
     * @param vestingClockTime Number of seconds between two _vestingPerClock
     */
    constructor(
        IERC20 token_,
        uint256 timeBeforeStarting,
        uint256 vestingPerClock,
        uint256 vestingClockTime
    ) MechaniumVesting(token_, vestingPerClock, vestingClockTime) {
        _timeBeforeStarting = timeBeforeStarting;
    }

    /**
     * @notice Allocate 'amount' token 'to' address
     * @param to Address of the beneficiary
     * @param amount Total token to be allocated
     */
    function allocateTokens(address to, uint256 amount)
        public
        override
        onlyRole(ALLOCATOR_ROLE)
        tokensAvailable(amount)
        returns (bool)
    {
        require(amount > 0, "Amount must be superior to 0");
        require(to != address(0), "Address must not be address(0)");

        if (_ownedAllocation[to].length == 0) {
            /// first allocation
            beneficiaryList.push(to);
        }
        uint256 allocationId = _allocationIdCounter.current();
        _allocationIdCounter.increment();

        tokensPerAllocation[allocationId] = amount;
        walletPerAllocation[allocationId] = to;
        startingTimePerAllocation[allocationId] = block.timestamp.add(
            _timeBeforeStarting
        );
        _ownedAllocation[to].push(allocationId);

        totalAllocatedTokens = totalAllocatedTokens.add(amount);

        emit AllocationAddition(to, amount);
        return true;
    }

    /**
     * ========================
     *          Views
     * ========================
     */

    /**
     * @return the amount of allocated tokens for `account` from the beginning
     */
    function allocatedTokensOf(address account)
        public
        view
        override
        returns (uint256)
    {
        uint256 allocatedTokens = 0;
        for (uint256 i = 0; i < _ownedAllocation[account].length; i++) {
            uint256 allocationId = _ownedAllocation[account][i];
            allocatedTokens = allocatedTokens.add(
                tokensPerAllocation[allocationId]
            );
        }
        return allocatedTokens;
    }

    /**
     * @return the amount of tokens that the `account` can unlock in real time
     */
    function pendingTokensOf(address account)
        public
        view
        override
        returns (uint256)
    {
        uint256 pendingTokens = 0;
        for (uint256 i = 0; i < _ownedAllocation[account].length; i++) {
            uint256 allocationId = _ownedAllocation[account][i];
            uint256 allocationTokens = tokensPerAllocation[allocationId];
            uint256 allocationStartingTime = startingTimePerAllocation[
                allocationId
            ];

            uint256 allocationPendingTokens = _pendingTokensCalc(
                allocationStartingTime,
                allocationTokens
            );
            pendingTokens = pendingTokens.add(allocationPendingTokens);
        }
        return pendingTokens.sub(releasedTokensOf(account));
    }

    /**
     * @return the amount of tokens that the `account` can unlock per month
     */
    function unlockableTokens(address account)
        public
        view
        override
        returns (uint256)
    {
        uint256 unlockTokens = 0;
        for (uint256 i = 0; i < _ownedAllocation[account].length; i++) {
            uint256 allocationId = _ownedAllocation[account][i];
            uint256 allocationTokens = tokensPerAllocation[allocationId];
            uint256 allocationStartingTime = startingTimePerAllocation[
                allocationId
            ];

            uint256 allocationUnlockTokens = _unlockTokensCalc(
                allocationStartingTime,
                allocationTokens
            );
            unlockTokens = unlockTokens.add(allocationUnlockTokens);
        }
        return unlockTokens.sub(releasedTokensOf(account));
    }
}
