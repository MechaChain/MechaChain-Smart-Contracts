// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev Mechanim distribution smart contract interface
 */
interface IMechaniumDistribution {
    /**
     * @dev Allocate an amount of tokens to an address ( only allocator role )
     */
    function allocateTokens(address to, uint256 amount) external returns (bool);

    /**
     * @dev Get balance of allocated tokens of an address
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Get unlockable tokens of an address
     */
    function unlockableTokens(address account) external view returns (uint256);

    /**
     * @dev Get unlockable tokens of an address
     */
    function releasedTokensOf(address account) external view returns (uint256);

    /**
     * @dev Transfers the allocated tokens to an address ( once the distribution has started )
     */
    function claimTokens(address account) external returns (bool);

    /**
     * @dev Transfers the all the allocated tokens to the respective addresses ( once the distribution has started )
     */
    function claimTokensForAll() external returns (bool);

    /**
     * @dev Starts the vesting immediatly ( only owner role )
     */
    function startVesting() external returns (bool);

    /**
     * @dev Starts the vesting immediatly ( only owner role )
     */
    function startVesting(uint256 startTime) external returns (bool);

    /**
     * @dev Sets the Play to Earn pool address
     */
    function setPTEPool(address poolAddress) external returns (bool);

    /**
     * @dev Transfer the unclaimed tokens to the play to earn pool
     */
    function transfertToPTEPool() external returns (bool);

    /**
     * @dev Sets the Staking pool address
     */
    function setStakingPool(address stakingPoolAddress) external returns (bool);

    /**
     * @dev Transfer account's unlocked tokens to the staking pool
     */
    function transfertToStakingPool(address account) external returns (bool);

    /**
     * @dev Get pending tokens of an account ( amont / time )
     */
    function pendingTokensOf(address account) external view returns (uint256);

    /**
     * @dev Get total tokens supply
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Get total unallocated tokens
     */
    function totalUnallocatedTokens() external view returns (uint256);

    /**
     * @dev Check if vesting has started
     */
    function hasVestingStarted() external view returns (bool);
}
