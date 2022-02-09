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

    function stake(uint256 amount, uint64 lockPeriod) external returns (bool);

    function stakeFor(
        address account,
        uint256 amount,
        uint64 lockPeriod
    ) external returns (bool);

    function updateStakeLock(uint256 depositId, uint64 lockPeriod)
        external
        returns (bool);

    function processRewards() external returns (bool);

    function unstake(uint256 depositId) external returns (bool);

    function updateRewardsPerWeight() external returns (bool);

    function setRewardsPerBlock(uint256 rewardsPerBlock)
        external
        returns (bool);

    function remainingAllocatedTokens()
        external
        returns (uint256);

    function pendingRewards(address account) external returns (uint256);

    function balanceOf(address account) external returns (uint256);

    function getDeposit(address account, uint256 depositId) external returns (Deposit memory);
    
    function getDepositsLength(address account) external returns (uint256);
}
