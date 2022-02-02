// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

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
        uint256 minRewardsPerBlock;
    }

    /**
     * @notice Function used to create a new staking pool
     */
    function createPool(
        uint256 allocatedTokens,
        uint256 initBlock,
        uint256 minStakingTime,
        uint256 maxStakingTime,
        uint256 minWeightMultiplier,
        uint256 maxWeightMultiplier,
        uint256 minRewardsPerBlock
    ) external returns (bool);

    /**
     * @notice Function used to add more tokens to a staking pool
     */
    function addAllocatedTokens(address pool, uint256 amount)
        external
        returns (bool);

    /**
     * @notice Function used to withdraw unallocated tokens
     */
    function withdrawUnallocated(address account, uint256 amount)
        external
        returns (bool);

    function getPoolData(address poolAddr)
        external
        view
        returns (PoolData memory);
}
