// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "./IStakingPool.sol";
import "../Mechanium.sol";

/**
 * @title StakingPool - A dummy staking pool smart contract for tests
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract StakingPool is IStakingPool {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    /// ERC20 basic token contract being held
    IERC20 internal immutable _token;

    /// Mapping of address/amount of allocated toknes
    mapping(address => uint256) private _allocatedTokens;
    uint256 private _totalTokensStaked;

    uint256 public initBlock;
    uint256 public minStakingTime;
    uint256 public maxStakingTime;
    uint256 public minWeightMultiplier;
    uint256 public maxWeightMultiplier;
    uint256 public rewardsLockingPeriod;
    uint256 public rewardsPerBlock;

    /// Maximum staking time
    uint256 private _maximumStakingTime;

    /**
     * @dev Contract constructor sets the configuration of the vesting schedule
     * @param token_ Address of the ERC20 token contract, this address cannot be changed later
     */
    constructor(
        IERC20 token_,
        uint256 initBlock_,
        uint256 minStakingTime_,
        uint256 maxStakingTime_,
        uint256 minWeightMultiplier_,
        uint256 maxWeightMultiplier_,
        uint256 rewardsLockingPeriod_,
        uint256 rewardsPerBlock_
    ) {
        _token = token_;
        initBlock = initBlock_;
        minStakingTime = minStakingTime_;
        maxStakingTime = maxStakingTime_;
        minWeightMultiplier = minWeightMultiplier_;
        maxWeightMultiplier = maxWeightMultiplier_;
        rewardsLockingPeriod = rewardsLockingPeriod_;
        rewardsPerBlock = rewardsPerBlock_;
    }

    function depositFor(
        address account,
        uint256 amount,
        uint256 stakingTime
    ) public override returns (bool) {
        require(amount > 0, "Amount must be superior to zero");

        uint256 currentBalance = token().balanceOf(address(this));
        _token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 newBalance = token().balanceOf(address(this));

        require(
            newBalance == (currentBalance.add(amount)),
            "Tokens not transfered"
        );
        require(
            stakingTime <= _maximumStakingTime,
            "Staking time must be lower to maximum staking time"
        );

        _allocatedTokens[account] = _allocatedTokens[account].add(amount);
        _totalTokensStaked = _totalTokensStaked.add(amount);

        return true;
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function totalAllocatedTokens() public view returns (uint256) {
        return _totalTokensStaked;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _allocatedTokens[account];
    }

    function getAllocatedTokens() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function setRewardsPerBlock(uint256 rewardsPerBlock_)
        public
        returns (bool)
    {
        rewardsPerBlock = rewardsPerBlock_;
        return true;
    }
}
