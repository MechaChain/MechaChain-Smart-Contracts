// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
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
    uint256 public minRewardsPerBlock;

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
        uint256 minRewardsPerBlock_
    ) {
        _token = token_;
        initBlock = initBlock_;
        minStakingTime = minStakingTime_;
        maxStakingTime = maxStakingTime_;
        minWeightMultiplier = minWeightMultiplier_;
        maxWeightMultiplier = maxWeightMultiplier_;
        minRewardsPerBlock = minRewardsPerBlock_;
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

    function getAllocatedTokens() public override view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    function getInitBlock() public override view returns (uint256) {
        return initBlock;
    }

    function getMinStakingTime() public override view returns (uint256) {
        return minStakingTime;
    }

    function getMaxStakingTime() public override view returns (uint256) {
        return maxStakingTime;
    }

    function getMinWeightMultiplier() public override view returns (uint256) {
        return minWeightMultiplier;
    }

    function getMaxWeightMultiplier() public override view returns (uint256) {
        return maxWeightMultiplier;
    }

    function getMinRewardsPerBlock() public override view returns (uint256) {
        return minRewardsPerBlock;
    }
}
