// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IMechaniumStakingPoolFactory.sol";
import "./IStakingPool.sol";
import "./StakingPool.sol";

/**
 * @title MechaniumStakingPoolFactory - Staking pool factory smart contract
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaniumStakingPoolFactory is IMechaniumStakingPoolFactory, Ownable {
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
        uint256 minRewardsPerBlock
    );

    /**
     * @notice Event emitted when an `amount` of tokens is added to `poolAddress` token allocation
     */
    event AddAllocatedTokens(address indexed poolAddress, uint256 amount);

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
    IERC20 immutable _token;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// List of registred staking pools
    mapping(address => bool) public registredPools;
    address[] public registredPoolsList;

    /**
     * ========================
     *     Public Functions
     * ========================
     */

    constructor(IERC20 token_) {
        require(address(token_) != address(0));
        _token = token_;
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
     * @param minRewardsPerBlock The minimum reward per block
     */
    function createPool(
        uint256 allocatedTokens,
        uint256 initBlock,
        uint256 minStakingTime,
        uint256 maxStakingTime,
        uint256 minWeightMultiplier,
        uint256 maxWeightMultiplier,
        uint256 minRewardsPerBlock
    ) public override onlyOwner returns (bool) {
        uint256 factoryBalance = _token.balanceOf(address(this));

        require(
            factoryBalance >= allocatedTokens,
            "Not enough tokens in factory"
        );

        IStakingPool stakingPool = new StakingPool(
            _token,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            minRewardsPerBlock
        );

        address stakingPoolAddr = address(stakingPool);

        registredPools[stakingPoolAddr] = true;
        registredPoolsList.push(stakingPoolAddr);

        addAllocatedTokens(stakingPoolAddr, allocatedTokens);

        emit CreatePool(
            stakingPoolAddr,
            allocatedTokens,
            initBlock,
            minStakingTime,
            maxStakingTime,
            minWeightMultiplier,
            maxWeightMultiplier,
            minRewardsPerBlock
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
        require(registredPools[poolAddr], "Staking pool not registred");

        _transferTokens(poolAddr, amount);

        emit AddAllocatedTokens(poolAddr, amount);

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

        uint256 factoryBalance = _token.balanceOf(address(this));

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
     * @notice Get staking pool data
     * @param poolAddr The pool address
     */
    function getPoolData(address poolAddr)
        public
        view
        override
        returns (PoolData memory)
    {
        require(registredPools[poolAddr], "Pool not registred");

        IStakingPool pool = IStakingPool(poolAddr);

        PoolData memory poolData = PoolData(
            pool.getAllocatedTokens(),
            pool.getInitBlock(),
            pool.getMinStakingTime(),
            pool.getMaxStakingTime(),
            pool.getMinWeightMultiplier(),
            pool.getMaxWeightMultiplier(),
            pool.getMinRewardsPerBlock()
        );

        return poolData;
    }
}
