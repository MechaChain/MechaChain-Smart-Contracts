// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./IMechaniumStakingPool.sol";

/**
 * @title MechaniumStakingPool - Staking pool smart contract
 * @author EthernalHorizons - <https://ethernalhorizons.com/>
 * @custom:project-website  https://mechachain.io/
 * @custom:security-contact contracts@ethernalhorizons.com
 */
contract MechaniumStakingPool is IMechaniumStakingPool, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    /**
     * ========================
     *          Events
     * ========================
     */

    /**
     * @notice Event emitted when an `account` stakes `amount` for `lockPeriod`
     */
    event Stake(address indexed account, uint256 amount, uint64 lockPeriod);

    /**
     * @notice Event emitted when an `account` unstaked a deposit (`depositId`)
     */
    event Unstake(address indexed account, uint256 depositId);

    /**
     * @notice Event emitted when an `account` updated stake `lockPeriod` for a `depositId`
     */
    event StakeLockUpdated(
        address indexed account,
        uint256 depositId,
        uint64 lockPeriod
    );

    /**
     * @notice Event emitted when an `rewardsPerBlock` is updated
     */
    event RewardsPerBlockChanged(uint256 rewardsPerBlock);

    /**
     * @notice Event emitted when `rewards` are processed for an `account`
     */
    event ProcessRewards(address indexed account, uint256 rewards);

    /**
     * @notice Event emitted when `rewardsPerWeight` is updated
     */
    event RewardsPerWeightUpdated(uint256 rewardsPerWeight);

    /**
     * ========================
     *  Constants & Immutables
     * ========================
     */

    /// ERC20 token to be staked
    IERC20 public immutable stakedToken;

    /// ERC20 token to be rewarded
    IERC20 public immutable rewardToken;

    /// Block number for staking pool start
    uint32 public immutable initBlock;

    /// Staking rewards locking period
    uint64 public immutable rewardsLockingPeriod;

    /// Minimum staking time
    uint64 public immutable minStakingTime;

    /// Maximum staking time
    uint64 public immutable maxStakingTime;

    /// Minimum weight multiplier
    uint16 public immutable minWeightMultiplier;

    /// Maximum weight multiplier
    uint16 public immutable maxWeightMultiplier;

    /// Weight multiplier ( used for floating weight )
    uint256 public immutable WEIGHT_MULTIPLIER = 1e6;

    /**
     * ========================
     *         Storage
     * ========================
     */

    /// Amount of tokens to be rewarded per block
    uint256 public rewardsPerBlock;

    /// Mapping of users addresses and User structure
    mapping(address => User) public users;

    /// Total staking weight for users
    uint256 public totalUsersWeight;

    /// Total tokens staked by users
    uint256 public totalTokensStaked;

    /// Rewards in tokens per weight
    uint256 public rewardsPerWeight;

    /// Total of processed rewards
    uint256 public totalProcessedRewards;

    /// Track the last block number of rewards update
    uint256 public lastRewardsUpdate;

    /**
     * ========================
     *     Public Functions
     * ========================
     */

    constructor(
        IERC20 stakedToken_,
        IERC20 rewardToken_,
        uint32 initBlock_,
        uint64 minStakingTime_,
        uint64 maxStakingTime_,
        uint16 minWeightMultiplier_,
        uint16 maxWeightMultiplier_,
        uint64 rewardsLockingPeriod_,
        uint256 rewardsPerBlock_
    ) {
        require(rewardsPerBlock_ > 0, "Rewards can't be null");
        require(minWeightMultiplier_ > 0, "minWeightMultiplier can't be null");
        require(
            minStakingTime_ <= maxStakingTime_,
            "minStakingTime can't be greater than maxStakingTime"
        );
        require(
            minWeightMultiplier_ <= maxWeightMultiplier_,
            "minWeightMultiplier can't be greater than maxWeightMultiplier"
        );

        /// Requirement to handle flash pools
        require(
            (address(stakedToken_) == address(rewardToken_)) ||
                rewardsLockingPeriod_ == 0,
            "Rewards locking period must be 0 for flash pools"
        );

        stakedToken = stakedToken_;
        rewardToken = rewardToken_;
        initBlock = initBlock_ == 0 ? uint32(block.number) : initBlock_;
        rewardsLockingPeriod = rewardsLockingPeriod_;
        minStakingTime = minStakingTime_;
        maxStakingTime = maxStakingTime_;
        minWeightMultiplier = minWeightMultiplier_;
        maxWeightMultiplier = maxWeightMultiplier_;
        rewardsPerBlock = rewardsPerBlock_;
    }

    /**
     * @notice Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`
     * @dev Uses the `stakeFor` function
     * @param amount The amount of tokens to stake
     * @param lockPeriod The locking period ( in seconds )
     */
    function stake(uint256 amount, uint64 lockPeriod)
        public
        override
        returns (bool)
    {
        address account = msg.sender;

        stakeFor(account, amount, lockPeriod);

        return true;
    }

    /**
     * @notice Used to stake an `amount` of tokens for a `lockPeriod` for an `account`
     * @dev Will make a safe transfer from the `account` and calculate the weight and create a deposit
     * @param account The account that we will stake the tokens for
     * @param amount The amount of tokens to stake
     * @param lockPeriod The locking period ( in seconds )
     */
    function stakeFor(
        address account,
        uint256 amount,
        uint64 lockPeriod
    ) public override returns (bool) {
        require(account != address(0), "Address must not be 0");
        require(amount > 0, "Amount must be superior to zero");
        require(
            lockPeriod >= minStakingTime,
            "Staking time less than minimum required"
        );
        require(
            lockPeriod <= maxStakingTime,
            "Staking time greater than maximum required"
        );

        // TODO - Call processRewards only if has it (user.totalStaked > 0)
        processRewards();
        // TODO - If no processRewards, updateRewardsPerWeight

        stakedToken.safeTransferFrom(account, address(this), amount);

        User storage user = users[account];

        uint256 weight = calculateUserWeight(amount, lockPeriod);

        uint64 lockStart = uint64(block.timestamp);
        uint64 lockEnd = lockStart + lockPeriod;

        // TODO - For a better understanding, can use an object instead of parameters on struct creation
        // ex: Deposit({amount: amount, weight: weight, lockStart: lockStart, lockEnd: lockEnd})
        // can avoid error on struct changement
        Deposit memory deposit = Deposit(amount, weight, lockStart, lockEnd);
        user.deposits.push(deposit);

        user.totalStaked = user.totalStaked.add(amount);
        user.totalWeight = user.totalWeight.add(weight);

        // TODO - Nico, update user.missingRewards

        totalUsersWeight = totalUsersWeight.add(weight);
        totalTokensStaked = totalTokensStaked.add(amount);

        emit Stake(account, amount, lockPeriod);

        return true;
    }

    /**
     * @notice Used to update a `depositId`'s `lockPeriod`
     * @dev Will recalculate substitue the old weight and calculate the new one
     * @param depositId The deposit id that will have it's locking period updated
     * @param lockPeriod The new locking period ( in seconds )
     */
    function updateStakeLock(uint256 depositId, uint64 lockPeriod)
        public
        override
        returns (bool)
    {
        require(
            lockPeriod >= minStakingTime,
            "Staking time less than minimum required"
        );
        require(
            lockPeriod <= maxStakingTime,
            "Staking time greater than maximum required"
        );

        processRewards();

        User storage user = users[msg.sender];

        require(depositId < user.deposits.length, "Deposit does not exist");

        Deposit storage deposit = user.deposits[depositId];

        // TODO the lockPeriod should be greater than the previous one

        deposit.lockedFrom = uint64(block.timestamp);
        deposit.lockedUntil = deposit.lockedFrom + lockPeriod;

        uint256 oldWeight = deposit.weight;
        uint256 newWeight = calculateUserWeight(deposit.amount, lockPeriod);

        // FIXME as we are in storage, isn't it better to change the variable at once?
        // ex : user.totalWeight = user.totalWeight.sub(oldWeight).add(newWeight);
        user.totalWeight = user.totalWeight.sub(oldWeight);
        totalUsersWeight = totalUsersWeight.sub(oldWeight);

        user.totalWeight = user.totalWeight.add(newWeight);
        totalUsersWeight = totalUsersWeight.add(newWeight);

        emit StakeLockUpdated(msg.sender, depositId, lockPeriod);

        return true;
    }

    /**
     * @notice Used to process the `msg.sender` rewards
     * @dev TODO
     */
    function processRewards() public override returns (bool) {
        // TODO Nico
        // User storage user = users[msg.sender];

        // user.releasedRewards = user.releasedRewards.add(1);

        emit ProcessRewards(msg.sender, 10);

        return true;
    }

    /**
     * @notice Used to unstake a `depositId` for the `msg.sender`
     * @dev TODO
     * @param depositId The deposit id that will be unstaked
     */
    function unstake(uint256 depositId) public override returns (bool) {
        // TODO Nico

        emit Unstake(msg.sender, depositId);
        return true;
    }

    /**
     * @notice Used to update the rewardsPerWeight
     */
    function updateRewardsPerWeight() public override returns (bool) {
        // TODO - also update a new variable `totalRewards`
        // TODO - rename if `updateRewards()`
        require(block.number >= initBlock, "initBlock is not reached");

        rewardsPerWeight = updatedRewardsPerWeight();

        lastRewardsUpdate = block.number;

        emit RewardsPerWeightUpdated(rewardsPerWeight);

        return true;
    }

    /**
     * @notice Used to change the rewardsPerBlock
     * @dev Will update the rewardsPerWeight before changing the rewardsPerBlock
     * @param rewardsPerBlock_ the new value for rewardsPerBlock ( must be superior to old value )
     */
    function setRewardsPerBlock(uint256 rewardsPerBlock_)
        public
        override
        onlyOwner
        returns (bool)
    {
        require(
            rewardsPerBlock_ > rewardsPerBlock,
            "Rewards per block new value must be superior to old value"
        );

        updateRewardsPerWeight();

        rewardsPerBlock = rewardsPerBlock_;

        emit RewardsPerBlockChanged(rewardsPerBlock);

        return true;
    }

    /**
     * ========================
     *           Views
     * ========================
     */

    /**
     * @notice Used to get the remaining allocated tokens
     */
    function remainingAllocatedTokens() public view override returns (uint256) {
        uint256 balance = rewardToken.balanceOf(address(this));

        balance = balance.sub(totalTokensStaked);

        if (block.number < initBlock) {
            return balance;
        }

        uint256 blocksPassed = block.number.sub(initBlock);
        // FIXME incorect calculation : rewardsPerBlock maybe changed after the initBlock and totalTokensStaked counts the rewards already processed
        // token.balance - (totalTokensStaked + updatedTotalRewards() - totalProcessedRewards)
        // 1. 12M - (2M + 0 - 0) = block 0, 10M de tokens alloués => remainingAllocatedTokens = 10M
        // 2. 12M - (2M + 2M - 0) = block X, 2M de tokens rewards prévu mais aucun process rewards => remainingAllocatedTokens = 8M
        // 3. 12M - (3M + 2M - 1M) = block X, 1M de tokens process (donc alloué)  => remainingAllocatedTokens = 8M
        // 3. 11.5M - (2.5M + 2M - 1M) = block X, 0.5M unstake (donc enelvé de la balance et le totalTokensStaked) = 8M

        // updatedTotalRewards() ~= rewardsPerBlock.mul(blocksPassed)
        return balance.sub(rewardsPerBlock.mul(blocksPassed));
    }

    /**
     * @notice Used to get the pending rewards for an `account`
     * @param account The account to calculate the pending rewards for
     */
    function pendingRewards(address account)
        public
        view
        override
        returns (uint256)
    {
        if (block.number < initBlock) {
            return 0;
        }

        uint256 _pendingRewards = users[account].totalWeight.mul(
            rewardsPerWeight
        );

        // TODO - Nico, remove missingRewards

        _pendingRewards = _pendingRewards.div(WEIGHT_MULTIPLIER);

        return _pendingRewards;
    }

    /**
     * @notice Used to get the balance for an `account`
     * @param account The account to get the balance for
     */
    function balanceOf(address account) public view override returns (uint256) {
        User memory user = users[account];
        return user.totalStaked.sub(user.releasedRewards);
    }

    /**
     * @notice Used to get the deposit (`depositId`) for an `account`
     * @param account The account to get the balance for
     * @param depositId The deposit id the get
     */
    function getDeposit(address account, uint256 depositId)
        public
        view
        override
        returns (Deposit memory)
    {
        User memory user = users[account];

        require(depositId < user.deposits.length, "Deposit does not exist");

        Deposit memory deposit = user.deposits[depositId];

        return deposit;
    }

    /**
     * @notice Used to get the length of deposits for an `account`
     * @param account The account to get the balance for
     */
    function getDepositsLength(address account)
        public
        view
        override
        returns (uint256)
    {
        User memory user = users[account];

        return user.deposits.length;
    }

    /**
     * @notice Used to get the User data for an `account`
     * @param account The account address
     */
    function getUser(address account) public view returns (User memory) {
        User memory user = users[account];

        return user;
    }

    // TODO updatedTotalRewards() = like updatedRewardsPerWeight, but without the weight

    /**
     * @notice Get the updated rewards per weight
     * @dev Used to calculate the rewardsPerWeight without updating them
     */
    function updatedRewardsPerWeight() public view returns (uint256) {
        if (block.number < initBlock) {
            return 0;
        }

        uint256 _remainingAllocatedTokens = remainingAllocatedTokens();

        uint256 _rewardsPerBlock = _remainingAllocatedTokens < rewardsPerBlock
            ? _remainingAllocatedTokens
            : rewardsPerBlock;

        uint256 _lastRewardsUpdate = lastRewardsUpdate > 0
            ? lastRewardsUpdate
            : initBlock;

        uint256 passedBlocks = block.number.sub(_lastRewardsUpdate);

        uint256 cumulatedRewards = passedBlocks.mul(_rewardsPerBlock);

        cumulatedRewards = cumulatedRewards.mul(WEIGHT_MULTIPLIER);

        uint256 _rewardsPerWeight = cumulatedRewards.div(totalUsersWeight);

        // FIXME does not take into account the old rewardsPerWeight ???

        return _rewardsPerWeight;
    }

    /**
     * @notice Calculate the weight based on `amount` and `stakingTime`
     * @param amount The staking amount
     * @param stakingTime The staking time
     */
    function calculateUserWeight(uint256 amount, uint64 stakingTime)
        public
        view
        returns (uint256)
    {
        return
            amount
                .mul(
                    _getRange(
                        minStakingTime,
                        uint256(minWeightMultiplier).mul(WEIGHT_MULTIPLIER),
                        maxStakingTime,
                        uint256(maxWeightMultiplier).mul(WEIGHT_MULTIPLIER),
                        uint256(stakingTime)
                    )
                )
                .div(WEIGHT_MULTIPLIER);
    }

    /**
     * ========================
     *     Private functions
     * ========================
     */

    /**
     * @notice Used to get the range for the staking time
     * @param x1 The minimum staking time
     * @param y1 The minimum weight time
     * @param x2 The maximum staking time
     * @param y2 The maximum weight time
     * @param a The actual staking time
     */
    function _getRange(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2,
        uint256 a
    ) private pure returns (uint256) {
        return y1.add(a.sub(x1).mul(y2.sub(y1)).div(x2.sub(x1)));
    }
}
