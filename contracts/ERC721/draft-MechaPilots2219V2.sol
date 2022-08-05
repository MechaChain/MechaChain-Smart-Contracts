// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "./MechaPilots2219V1.sol";

/**
 * @title MechaPilots2219 - TODO
 * @author MechaChain - <https://mechachain.io/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaPilots2219V2 is MechaPilots2219V1 {
    /**
     * ========================
     *          Public
     * ========================
     */

    function initializeV2() public reinitializer(2) {
        // Storage initialisation
        version = 2;
    }
}
