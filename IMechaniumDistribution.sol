// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
* Mechanim distribution smart contract interface
*/
interface IMechaniumDistribution {
    // Allocate an amount of tokens to an address ( only allocator role )
    function allocateTokens(address to, uint256 amount) external returns (bool);

    // Get balance of allocated tokens of an address
    function balanceOf(address account) external view returns (uint256);
    
    // Transfers the allocated tokens to an address ( once the distribution has started )
    function claimTokens(address account) external returns (bool);

    // Transfers the all the allocated tokens to the respective addresses ( once the distribution has started )
    function claimTokensForAll() external returns (bool);

    // Starts the vesting immediatly ( only owner role )
    function startVesting() external returns (bool);

    // Sets the Play to Earn pool address
    function setPTEPool(address poolAddress) external returns (bool);

    // Transfer the unclaimed tokens to the play to earn pool
    function transfertToPTEPool() external returns (bool);

    // Sets the Staking pool address
    function setStakingPool(address stakingPoolAddress) external returns (bool);

    // Transfer account's unlocked tokens to the staking pool
    function transfertToStakingPool(address account) external returns (bool);

    // Get pending tokens of an account ( amont / time )
    function pendingTokensOf(address account) external view returns (uint256);

    // Get remaining untransfered tokens
    function totalUntransferedTokens() external view returns (uint256);

    // Get total unallocated tokens
    function totalUnallocatedTokens() external view returns (uint256);

    // Check if vesting has started
    function hasVestingStarted() external view returns (bool);
}