// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./MechaniumVestingWallet.sol";

/**
 * @title MechaniumGrowthVestingWallet - Hold $MECHA allocated to the P2E pool with a vesting schedule
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaniumP2EVestingWallet is MechaniumVestingWallet {
    
    /**
     * @dev Contract constructor sets the configuration of the vesting schedule
     * @param token_ Address of the ERC20 token contract, this address cannot be changed later
     */
    constructor(IERC20 token_)
        MechaniumVestingWallet(
            token_,
            0, // Initially unlock 0%
            50, // then unlock 50%
            270 days // every 9 months
        )
    {}
}
