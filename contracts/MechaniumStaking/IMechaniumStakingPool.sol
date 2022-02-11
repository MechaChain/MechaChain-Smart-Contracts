// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @title Staking pool smart contract interface
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
interface IMechaniumStakingPool {
    struct User {
        uint256 totalStaked;
        uint256 totalWeight;
        uint256 missingRewards;
        uint256 releasedRewards;
        Deposit[] deposits;
    }

    struct Deposit {
        uint256 amount;
        uint256 weight;
        uint64 lockedFrom;
        uint64 lockedUntil;
    }

    /**
     * @notice Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`
     */
    function stake(uint256 amount, uint64 lockPeriod) external returns (bool);

    /**
     * @notice Used to stake an `amount` of tokens for a `lockPeriod` for an `account`
     */
    function stakeFor(
        address account,
        uint256 amount,
        uint64 lockPeriod
    ) external returns (bool);

    /**
     * @notice Used to update a `depositId`'s `lockPeriod`
     */
    function updateStakeLock(uint256 depositId, uint64 lockPeriod)
        external
        returns (bool);

    /**
     * @notice Used to calculate and pay pending rewards to the `msg.sender`
     */
    function processRewards() external returns (uint256);

    /**
     * @notice Used to unstake several deposits for the `msg.sender`
     */
    function unstake(uint256[] memory depositIds) external returns (bool);

    /**
     * @notice Used to unstake a `depositId` for the `msg.sender`
     */
    function unstake(uint256 depositId) external returns (bool);

    /**
     * @notice Used to update the rewards per weight and the total rewards
     */
    function updateRewards() external returns (bool);

    /**
     * @notice Used to change the rewardsPerBlock
     */
    function setRewardsPerBlock(uint256 rewardsPerBlock)
        external
        returns (bool);

    /**
     * @notice Used to get the remaining allocated tokens
     */
    function remainingAllocatedTokens() external returns (uint256);

    /**
     * @notice Used to get the pending rewards for an `account`
     */
    function pendingRewards(address account) external returns (uint256);

    /**
     * @notice Can we call the rewards function or is it useless and will cause an error
     */
    function canUpdateRewards() external returns (bool);

    /**
     * @notice Used to get the balance for an `account`
     */
    function balanceOf(address account) external returns (uint256);

    /**
     * @notice Used to get the deposit (`depositId`) for an `account`
     */
    function getDeposit(address account, uint256 depositId)
        external
        returns (Deposit memory);

    /**
     * @notice Used to get the length of deposits for an `account`
     */
    function getDepositsLength(address account) external returns (uint256);

    /**
     * @notice Used to get the User data for an `account`
     */
    function getUser(address account) external returns (User memory);

    /**
     * @notice Get the updated rewards
     */
    function updatedRewards() external returns (uint256);

    /**
     * @notice Get the total updated rewards
     */
    function updatedTotalRewards() external returns (uint256);

    /**
     * @notice Get the updated rewards per weight
     */
    function updatedRewardsPerWeight() external returns (uint256);

    /**
     * @notice Calculate the weight based on `amount` and `stakingTime`
     */
    function calculateUserWeight(uint256 amount, uint64 stakingTime)
        external
        returns (uint256);

    /**
     * @notice Converts stake weight to reward value, applying the division on weight
     */
    function weightToReward(uint256 _weight, uint256 _rewardsPerWeight)
        external
        returns (uint256);
}
