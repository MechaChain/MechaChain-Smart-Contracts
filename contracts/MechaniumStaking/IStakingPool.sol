// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev Staking pool smart contract interface
 * @author EthernalHorizons - <https://mechachain.io/>
 * @custom:security-contact hello@mechachain.io
 */
interface IStakingPool {
    /**
     * @dev Stake tokens ( only from distribution contract )
     */
    function stakeTokensFromDistribution(address to, uint256 amount)
        external
        returns (bool);
}
