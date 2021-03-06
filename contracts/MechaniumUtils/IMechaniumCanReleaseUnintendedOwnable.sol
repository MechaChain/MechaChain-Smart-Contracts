// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev Mechanium can release unintended ( ownable ) smart contract interface
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
interface IMechaniumCanReleaseUnintendedOwnable {
    /**
     * @dev Release unintended tokens sent to smart contract ( only owner )
     * This function is used to prevent unintended tokens that got sent to be stuck on the contract
     * @param token The address of the token contract (zero address for claiming native coins).
     * @param account The address of the tokens/coins receiver.
     * @param amount Amount to claim.
     */
    function releaseUnintended(
        address token,
        address account,
        uint256 amount
    ) external returns (bool);
}
