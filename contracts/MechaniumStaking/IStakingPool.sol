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
     * @dev Stake tokens ( only from distribution contract )
     */
    function stakeTokensFromDistribution(address to, uint256 amount)
        external
        returns (bool);

    function getAllocatedTokens() external view returns (uint256);

    function getInitBlock() external view returns (uint256);

    function getMinStakingTime() external view returns (uint256);

    function getMaxStakingTime() external view returns (uint256);

    function getMinWeightMultiplier() external view returns (uint256);

    function getMaxWeightMultiplier() external view returns (uint256);

    function getMinRewardsPerBlock() external view returns (uint256);
}
