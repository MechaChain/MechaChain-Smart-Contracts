// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IStakingPool.sol";
import "../Mechanium.sol";

/**
 * @title StakingPool - A dummy staking pool smart contract for tests
 */
contract StakingPool is IStakingPool {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    /// ERC20 basic token contract being held
    IERC20 internal immutable _token;

    /// Mapping of address/amount of allocated toknes
    mapping(address => uint256) private _allocatedTokens;
    uint256 private _totalAllocatedTokens;

    /**
     * @dev Contract constructor sets the configuration of the vesting schedule
     * @param token_ Address of the ERC20 token contract, this address cannot be changed later
     */
    constructor(IERC20 token_) {
        _token = token_;
    }

    function stakeTokensFromDistribution(address account, uint256 amount)
        public
        override
        returns (bool)
    {
        uint256 currentBalance = token().balanceOf(address(this));
        require(
            totalAllocatedTokens().add(amount) == currentBalance,
            "Tokens not transfered"
        );

        _allocatedTokens[account] = _allocatedTokens[account].add(amount);
        _totalAllocatedTokens = _totalAllocatedTokens.add(amount);

        return true;
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function totalAllocatedTokens() public view returns (uint256) {
        return _totalAllocatedTokens;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _allocatedTokens[account];
    }
}
