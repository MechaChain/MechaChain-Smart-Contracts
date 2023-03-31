// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./MechaLandsV2.sol";

/**
 * @title MechaLandsV2 - TODO
 * @author MechaChain - <https://mechachain.io/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaLandsV3 is MechaLandsV2 {
    /**
     * ========================
     *          Public
     * ========================
     */

    function initializeV3() public reinitializer(3) {}

    function tellMeWhatIWant() public pure returns (uint256) {
        return 926391;
    }
}
