// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IMechaniumStakingPoolFactory.sol";
import "./IMechaniumStakingPool.sol";
import "./MechaniumStakingPool.sol";
import "../MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol";

/**
 * @title MechaniumStakingPoolFactory - Staking pool factory smart contract
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaniumStakingPoolFactory is
    IMechaniumStakingPoolFactory,
    Ownable,
    MechaniumCanReleaseUnintendedOwnable
{
    using SafeERC20 for IERC20;

    /**
     * ========================
     *          Events
     * ========================
     */

    /**
     * @notice Event emitted when a staking pool is created
     */
    event CreatePool(
        address indexed poolAddress,
        uint256 allocatedTokens,
        uint256 initBlock,
        uint256 minStakingTime,
        uint256 maxStakingTime,
        uint256 minWeightMultiplier,
        uint256 maxWeightMultiplier,
        uint256 rewardsLockingPeriod,
        uint256 rewardsPerBlock
    );

    /**
     * @notice Event emitted when a staking flash pool is created
     */
    event CreateFlashPool(
        address indexed poolAddress,
        uint256 allocatedTokens,
        uint256 initBlock,
        uint256 minStakingTime,
        uint256 maxStakingTime,
        uint256 minWeightMultiplier,
        uint256 maxWeightMultiplier,
        uint256 rewardsPerBlock
    );

    /**
     * @notice Event emitted when an `amount` of tokens is added to `poolAddress` token allocation
     */
    event AddAllocatedTokens(address indexed poolAddress, uint256 amount);

    /**
     * @notice Event emitted when an `amount` of tokens is added to `poolAddress` token allocation
     */
    event AddAllocatedTokens(
        address indexed poolAddress,
        uint256 amount,
        uint256 rewardsPerBlock
    );

    /**
     * @notice Event emitted when `amount` of unallocated tokens is withdrawn to an `account`
     */
    event WithdrawUnallocated(address indexed account, uint256 amount);

    /**
     * ========================
     *  Constants & Immutables
     * ========================
     */

    /// Main staking ERC20 token
    IERC20 private immutable _token;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// List of registered staking pools
    mapping(address => bool) public registeredPools;
    address[] public registeredPoolsList;

    /**
     * ========================
     *     Public Functions
     * ========================
     */

    constructor(IERC20 token_) {
        require(address(token_) != address(0));
        _token = token_;

        _addLockedToken(address(token_));
    }

    /**
     * @notice Create new staking pool
     * @dev Deploy an instance of the StakingPool smart contract and transfer the tokens to it
     * @param allocatedTokens The number of tokens allocated for the pool
     * @param initBlock The initial block of the pool to start
     * @param minStakingTime The minimum time allowed for staking
     * @param maxStakingTime The maximum time allowed for staking
     * @param minWeightMultiplier The minimum weight multiplier
     * @param maxWeightMultiplier The maximum weight multiplier
     * @param rewardsLockingPeriod The rewards locking period
     * @param rewardsPerBlock The rewards per block
     */
    function createPool(
        uint256 allocatedTokens,
        uint32 initBlock,
        uint64 minStakingTime,
        uint64 maxStakingTime,
        uint16 minWeightMultiplier,
        uint16 maxWeightMultiplier,
        uint64 rewardsLockingPeriod,
        uint256 rewardsPerBlock
    ) public override onlyOwner returns (bool) {
        uint256 factoryBalance = _token.balanceOf(address(this));

        require(
            factoryBalance >= allocatedTokens,
            "Not enough tokens in factory"
        );

        IMechaniumStakingPool stakingPool = new MechaniumStakingPool(
            _token,
            _token,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            rewardsLockingPeriod,
            rewardsPerBlock
        );

        address stakingPoolAddr = address(stakingPool);

        registeredPools[stakingPoolAddr] = true;
        registeredPoolsList.push(stakingPoolAddr);

        addAllocatedTokens(stakingPoolAddr, allocatedTokens);

        emit CreatePool(
            stakingPoolAddr,
            allocatedTokens,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            rewardsLockingPeriod,
            rewardsPerBlock
        );

        return true;
    }

    /**
     * @notice Create new staking flash pool
     * @dev Deploy an instance of the StakingPool smart contract and transfer the tokens to it
     * @param allocatedTokens The number of tokens allocated for the pool
     * @param initBlock The initial block of the pool to start
     * @param minStakingTime The minimum time allowed for staking
     * @param maxStakingTime The maximum time allowed for staking
     * @param minWeightMultiplier The minimum weight multiplier
     * @param maxWeightMultiplier The maximum weight multiplier
     * @param rewardsPerBlock The rewards per block
     */
    function createFlashPool(
        IERC20 stakedToken,
        uint256 allocatedTokens,
        uint32 initBlock,
        uint64 minStakingTime,
        uint64 maxStakingTime,
        uint16 minWeightMultiplier,
        uint16 maxWeightMultiplier,
        uint256 rewardsPerBlock
    ) public override onlyOwner returns (bool) {
        uint256 factoryBalance = _token.balanceOf(address(this));

        require(
            factoryBalance >= allocatedTokens,
            "Not enough tokens in factory"
        );

        IMechaniumStakingPool stakingPool = new MechaniumStakingPool(
            stakedToken,
            _token,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            0,
            rewardsPerBlock
        );

        address stakingPoolAddr = address(stakingPool);

        registeredPools[stakingPoolAddr] = true;
        registeredPoolsList.push(stakingPoolAddr);

        addAllocatedTokens(stakingPoolAddr, allocatedTokens);

        emit CreateFlashPool(
            stakingPoolAddr,
            allocatedTokens,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            rewardsPerBlock
        );

        return true;
    }

    /**
     * @notice Allocate more tokens to a staking pool
     * @dev Safe transfer the tokens to the pool
     * @param poolAddr The pool address
     * @param amount The amount of tokens to allocate
     */
    function addAllocatedTokens(address poolAddr, uint256 amount)
        public
        override
        onlyOwner
        returns (bool)
    {
        require(registeredPools[poolAddr], "Staking pool not registered");

        _transferTokens(poolAddr, amount);

        emit AddAllocatedTokens(poolAddr, amount);

        return true;
    }

    /**
     * @notice Allocate more tokens to a staking pool and change the rewards per block
     * @dev Safe transfer the tokens to the pool
     * @param poolAddr The pool address
     * @param amount The amount of tokens to allocate
     * @param rewardsPerBlock The new rewards per block
     */
    function addAllocatedTokens(
        address poolAddr,
        uint256 amount,
        uint256 rewardsPerBlock
    ) public override onlyOwner returns (bool) {
        require(registeredPools[poolAddr], "Staking pool not registered");

        _transferTokens(poolAddr, amount);

        IMechaniumStakingPool pool = MechaniumStakingPool(poolAddr);

        pool.setRewardsPerBlock(rewardsPerBlock);

        emit AddAllocatedTokens(poolAddr, amount, rewardsPerBlock);

        return true;
    }

    /**
     * @notice Withdraw unallocated tokens
     * @param account The account that will receive the tokens
     * @param amount The amount of tokens to withdraw
     */
    function withdrawUnallocated(address account, uint256 amount)
        public
        override
        onlyOwner
        returns (bool)
    {
        _transferTokens(account, amount);

        emit WithdrawUnallocated(account, amount);

        return true;
    }

    /**
     * ========================
     *    Private functions
     * ========================
     */

    function _transferTokens(address account, uint256 amount)
        private
        returns (bool)
    {
        require(account != address(0), "Address must not be 0");
        require(amount > 0, "Amount must be superior to zero");

        uint256 factoryBalance = balance();

        require(factoryBalance >= amount, "Not enough tokens in factory");

        _token.safeTransfer(account, amount);

        return true;
    }

    /**
     * ========================
     *          Views
     * ========================
     */

    /**
     * @notice Get the factory ERC20 token
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @notice Get the factory ERC20 token balance
     */
    function balance() public view returns (uint256) {
        return _token.balanceOf(address(this));
    }

    /**
     * @notice Get staking pool data
     * @param poolAddr The pool address
     */
    function getPoolData(address poolAddr)
        public
        view
        override
        returns (PoolData memory)
    {
        require(registeredPools[poolAddr], "Pool not registered");

        MechaniumStakingPool pool = MechaniumStakingPool(poolAddr);

        PoolData memory poolData = PoolData(
            pool.totalTokensStaked(),
            pool.initBlock(),
            pool.minStakingTime(),
            pool.maxStakingTime(),
            pool.minWeightMultiplier(),
            pool.maxWeightMultiplier(),
            pool.rewardsLockingPeriod(),
            pool.rewardsPerBlock()
        );

        return poolData;
    }
}
