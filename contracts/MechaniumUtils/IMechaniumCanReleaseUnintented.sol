// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
 * @dev Mechanim can release unintented smart contract interface
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
interface IMechaniumCanReleaseUnintented {
    
    /**
     * @dev Release unintented tokens sent to smart contract ( only admin role )
     */
    function releaseUnintented(address token, address account, uint256 amount) external returns (bool);

}