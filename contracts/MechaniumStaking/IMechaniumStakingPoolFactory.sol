// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Staking pool factory smart contract interface
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
interface IMechaniumStakingPoolFactory {
    /// Pool data structure
    struct PoolData {
        uint256 allocatedTokens;
        uint256 initBlock;
        uint256 minStakingTime;
        uint256 maxStakingTime;
        uint256 minWeightMultiplier;
        uint256 maxWeightMultiplier;
        uint256 rewardsLockingPeriod;
        uint256 rewardsPerBlock;
    }

    /**
     * @notice Function used to create a new staking pool
     */
    function createPool(
        uint256 allocatedTokens,
        uint32 initBlock,
        uint64 minStakingTime,
        uint64 maxStakingTime,
        uint16 minWeightMultiplier,
        uint16 maxWeightMultiplier,
        uint64 rewardsLockingPeriod,
        uint256 rewardsPerBlock
    ) external returns (bool);

    /**
     * @notice Function used to create a new staking flash pool
     */
    function createFlashPool(
        IERC20 stakedToken,
        uint256 allocatedTokens,
        uint32 initBlock,
        uint64 minStakingTime,
        uint64 maxStakingTime,
        uint16 minWeightMultiplier,
        uint16 maxWeightMultiplier,
        uint256 rewardsPerBlock
    ) external returns (bool);

    /**
     * @notice Function used to add more tokens to a staking pool
     */
    function addAllocatedTokens(address pool, uint256 amount)
        external
        returns (bool);

    /**
     * @notice Function used to add more tokens to a staking pool
     */
    function addAllocatedTokens(
        address payable pool,
        uint256 amount,
        uint256 rewardPerBlock
    ) external returns (bool);

    /**
     * @notice Function used to withdraw unallocated tokens
     */
    function withdrawUnallocated(address account, uint256 amount)
        external
        returns (bool);

    function releaseUnintendedFromPool(
        address payable pool,
        address token_,
        address account,
        uint256 amount
    ) external returns (bool);

    function getPoolData(address payable poolAddr)
        external
        view
        returns (PoolData memory);
}
