// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MechaniumTeamDistribution.sol";

/**
 * @title MechaniumAdvisorsDistribution - Vesting and distribution smart contract for the mechachain advisor
 */
contract MechaniumAdvisorsDistribution is MechaniumTeamDistribution {
    /**
     * @dev Contract constructor sets the configuration of the vesting schedule
     * @param token_ Address of the ERC20 token contract, this address cannot be changed later
     */
    constructor(IERC20 token_)
        MechaniumTeamDistribution(
            token_,
            180 days, // after 6 months (included)
            20, // unlock 20%
            180 days // every 6 month
        )
    {}
}
