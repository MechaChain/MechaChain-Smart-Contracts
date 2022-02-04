// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev Staking pool smart contract interface
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
interface IStakingPool {
    /**
     * @dev Stake tokens
     */
    function depositFor(address account, uint256 amount, uint256 stakingTime)
        external
        returns (bool);

    function getAllocatedTokens() external view returns (uint256);

    function setRewardsPerBlock(uint256 rewardsPerBlock) external returns (bool);
}
