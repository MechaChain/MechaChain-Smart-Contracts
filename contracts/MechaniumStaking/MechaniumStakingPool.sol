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
    event Unstake(address indexed account, uint256 amount, uint256 depositId);

    /**
     * @notice Event emitted when an `account` unstaked several deposits (`depositIds`)
     */
    event Unstake(
        address indexed account,
        uint256 amount,
        uint256[] depositIds
    );

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

    /// Track total rewards
    uint256 public totalRewards;

    /**
     * ========================
     *     Public Functions
     * ========================
     */

    /**
     * @notice Contract constructor sets the configuration of the staking pool
     * @param stakedToken_ The token to be staked ( can be same as rewardToken if not flash pool )
     * @param rewardToken_  The token to be rewarded
     * @param initBlock_ The init block ( if set to 0 will take the current block )
     * @param minStakingTime_ The minimum allowed locking time
     * @param maxStakingTime_ The maximum allowed locking time
     * @param minWeightMultiplier_ The minimum weight multipler ( Used to calculate weight range )
     * @param maxWeightMultiplier_ The maximum weight multipler ( Used to calculate weight range )
     * @param rewardsLockingPeriod_  The rewards locking period ( Can be 0 if flash pool )
     * @param rewardsPerBlock_ The amount of tokens to be rewarded per block passed
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
        require(
            rewardsLockingPeriod_ == 0 ||
                rewardsLockingPeriod_ >= minStakingTime_,
            "Rewards locking period must be 0 or lower than minStakingTime"
        );
        require(
            rewardsLockingPeriod_ == 0 ||
                rewardsLockingPeriod_ <= maxStakingTime_,
            "Rewards locking period must be 0 or greater than maxStakingTime"
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

    // TODO : add depositFor()

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

        // Update rewards
        if (canUpdateRewards()) {
            updateRewards();
        }

        // Process rewards with no update to not do it twice
        _processRewards(account, false);

        stakedToken.safeTransferFrom(account, address(this), amount);

        User storage user = users[account];

        uint256 weight = calculateUserWeight(amount, lockPeriod);

        uint64 lockStart = uint64(block.timestamp);
        uint64 lockEnd = lockStart + lockPeriod;

        Deposit memory deposit = Deposit({
            amount: amount,
            weight: weight,
            lockedFrom: lockStart,
            lockedUntil: lockEnd
        });

        // Update user and total records
        user.deposits.push(deposit);
        _increaseUserRecords(user, amount, weight, true);

        emit Stake(account, amount, lockPeriod);

        return true;
    }

    /**
     * @notice Used to calculate and pay pending rewards to the `msg.sender`
     *
     * @dev Automatically updates rewards before processing them
     * @dev When there are no rewards to calculate, throw error
     * @dev If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     *      otherwise they are transmitted directly to the user (as for flash pools)
     *
     * @return userPendingRewards rewards calculated and optionally re-staked
     */
    function processRewards()
        public
        override
        returns (uint256 userPendingRewards)
    {
        userPendingRewards = _processRewards(msg.sender, true);
        require(userPendingRewards != 0, "No rewards to process");
    }

    /**
     * @notice Used to unstake several deposits for the `msg.sender`
     *
     * @dev ProccessRewards and transfer all deposits to the user
     * @dev Revert if the `lockedUntil` of a deposit has not passed
     *
     * @param depositIds Array of deposit id that will be unstaked
     */
    function unstake(uint256[] memory depositIds)
        public
        override
        returns (bool)
    {
        // Update rewards
        if (canUpdateRewards()) {
            updateRewards();
        }

        // Process rewards with no update to not do it twice
        _processRewards(msg.sender, false);

        User storage user = users[msg.sender];

        uint256 totalAmount;
        uint256 totalWeight;
        for (uint256 i = 0; i < depositIds.length; i++) {
            (uint256 amount, uint256 weight) = _drainDeposit(
                user,
                depositIds[i]
            );
            totalAmount = totalAmount.add(amount);
            totalWeight = totalWeight.add(weight);
        }

        // Update user and total records
        _decreaseUserRecords(user, totalAmount, totalWeight, true);

        // Transfer tokens
        rewardToken.safeTransfer(msg.sender, totalAmount);

        emit Unstake(msg.sender, totalAmount, depositIds);
        return true;
    }

    /**
     * @notice Used to unstake a `depositId` for the `msg.sender`
     *
     * @dev ProccessRewards and transfer all the deposit to the user
     * @dev Revert if the `lockedUntil` of the deposit has not passed
     *
     * @param depositId The deposit id that will be unstaked
     */
    function unstake(uint256 depositId) public override returns (bool) {
        // Update rewards
        if (canUpdateRewards()) {
            updateRewards();
        }

        // Process rewards with no update to not do it twice
        _processRewards(msg.sender, false);

        User storage user = users[msg.sender];
        (uint256 amount, uint256 weight) = _drainDeposit(user, depositId);

        // Update user and total records
        _decreaseUserRecords(user, amount, weight, true);

        // Transfer tokens
        stakedToken.safeTransfer(msg.sender, amount);

        emit Unstake(msg.sender, amount, depositId);
        return true;
    }

    /**
     * @notice Used to update the rewards per weight and the total rewards
     * @dev Must be called before each total weight change
     */
    function updateRewards() public override returns (bool) {
        require(canUpdateRewards(), "initBlock is not reached");

        totalRewards = updatedTotalRewards();

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

        if (canUpdateRewards()) {
            updateRewards();
        }

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

        uint256 remainingTokens = balance.sub(
            totalTokensStaked.add(updatedTotalRewards()).sub(
                totalProcessedRewards
            )
        );

        return remainingTokens;
    }

    /**
     * @notice Used to get the pending rewards for an `account`
     * @param account The account to calculate the pending rewards for
     * @return the rewards that the user has but which have not been processed
     */
    function pendingRewards(address account)
        public
        view
        override
        returns (uint256)
    {
        if (block.number < initBlock || users[account].totalStaked == 0) {
            return 0;
        }

        // All rewards according to account weight
        uint256 _pendingRewards = weightToReward(
            users[account].totalWeight,
            updatedRewardsPerWeight()
        );

        // Remove rewards released before accounts allocations or that they have already been processed
        _pendingRewards = _pendingRewards.sub(users[account].missingRewards);

        return _pendingRewards;
    }

    /**
     * @notice Can we call the rewards update function or is it useless and will cause an error
     */
    function canUpdateRewards() public view override returns (bool) {
        return block.number >= initBlock;
    }

    /**
     * @notice Used to get the balance for an `account`
     * @param account The account to get the balance for
     */
    function balanceOf(address account) public view override returns (uint256) {
        User memory user = users[account];
        return user.totalStaked.add(pendingRewards(account));
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
    function getUser(address account)
        public
        view
        override
        returns (User memory)
    {
        User memory user = users[account];

        return user;
    }

    /**
     * @notice Get the updated rewards
     * @dev Used to calculate the rewards for last period ( in blocks ) without updating them
     */
    function updatedRewards() public view override returns (uint256) {
        if (block.number < initBlock) {
            return 0;
        }

        uint256 _lastRewardsUpdate = lastRewardsUpdate > 0
            ? lastRewardsUpdate
            : initBlock;

        uint256 passedBlocks = block.number.sub(_lastRewardsUpdate);

        uint256 cumulatedRewards = passedBlocks.mul(rewardsPerBlock);

        /**
         * Calculate old remaining tokens
         * Used to check if we have enough tokens to reward
         */
        uint256 balance = rewardToken.balanceOf(address(this));

        uint256 oldRemainingTokens = balance.sub(
            totalTokensStaked.add(totalRewards).sub(totalProcessedRewards)
        );

        return
            cumulatedRewards > oldRemainingTokens
                ? oldRemainingTokens
                : cumulatedRewards;
    }

    /**
     * @notice Get the total updated rewards
     * @dev Used to calculate the rewards from the init block without updating them
     */
    function updatedTotalRewards() public view override returns (uint256) {
        uint256 _updatedTotalRewards = totalRewards.add(updatedRewards());

        return _updatedTotalRewards;
    }

    /**
     * @notice Get the updated rewards per weight
     * @dev Used to calculate the rewardsPerWeight without updating them
     */
    function updatedRewardsPerWeight() public view override returns (uint256) {
        uint256 cumulatedRewards = updatedRewards();

        cumulatedRewards = cumulatedRewards.mul(WEIGHT_MULTIPLIER);

        uint256 _rewardsPerWeight = cumulatedRewards.div(totalUsersWeight);

        _rewardsPerWeight = _rewardsPerWeight.add(rewardsPerWeight);

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
        override
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
     * @dev Converts stake weight to reward value, applying the division on weight
     *
     * @param _weight stake weight
     * @param _rewardsPerWeight reward per weight
     * @return reward value normalized with WEIGHT_MULTIPLIER
     */
    function weightToReward(uint256 _weight, uint256 _rewardsPerWeight)
        public
        pure
        override
        returns (uint256)
    {
        return _weight.mul(_rewardsPerWeight).div(WEIGHT_MULTIPLIER);
    }

    /**
     * ========================
     *     Private functions
     * ========================
     */

    /**
     * @notice Update the user and total records by increasing the weight and the total staked
     *
     * @dev Increase user's `totalStaked`, `totalWeight` and reset `missingRewards`
     * @dev Increase `totalUsersWeight` and `totalTokensStaked`
     * @dev Rewards MUST be updated before and processed for this users
     *
     * @param user The user to update
     * @param amount The amount to increase
     * @param weight The weight to increase
     */
    function _increaseUserRecords(
        User storage user,
        uint256 amount,
        uint256 weight,
        bool updateMissingRewards
    ) private returns (bool) {
        // Update user records
        user.totalStaked = user.totalStaked.add(amount);
        user.totalWeight = user.totalWeight.add(weight);

        if (updateMissingRewards) {
            // Reset the missingRewards of the user
            user.missingRewards = weightToReward(
                user.totalWeight,
                rewardsPerWeight
            );
        }

        // Update total records
        totalUsersWeight = totalUsersWeight.add(weight);
        totalTokensStaked = totalTokensStaked.add(amount);
        return true;
    }

    /**
     * @notice Update the user and total records by decreasing the weight and the total staked
     *
     * @dev Decrease user's `totalStaked`, `totalWeight` and reset `missingRewards`
     * @dev Decrease `totalUsersWeight` and `totalTokensStaked`
     * @dev Rewards MUST be updated before and processed for this users
     * @dev If `updateMissingRewards` is false, `missingRewards` rewards MUST be updated after
     *
     * @param user The user to update
     * @param amount The amount to decrease
     * @param weight The weight to decrease
     * @param updateMissingRewards If we have to update the missing rewards of the user
     */
    function _decreaseUserRecords(
        User storage user,
        uint256 amount,
        uint256 weight,
        bool updateMissingRewards
    ) private returns (bool) {
        // Update user records
        user.totalStaked = user.totalStaked.sub(amount);
        user.totalWeight = user.totalWeight.sub(weight);

        if (updateMissingRewards) {
            // Reset the missingRewards of the user
            user.missingRewards = weightToReward(
                user.totalWeight,
                rewardsPerWeight
            );
        }

        // Update total records
        totalUsersWeight = totalUsersWeight.sub(weight);
        totalTokensStaked = totalTokensStaked.sub(amount);
        return true;
    }

    /**
     * @notice Remove a deposit if the locking is over and return its amount and weight
     *
     * @dev Delete the deposit by resetting all its values : the deposit
     *      will always be present in the array but set to 0
     * @dev Revert if `depositId` does not exist or if the `lockedUntil`
     *      of the deposit has not passed
     * @dev Does not update records : rewards MUST be updated before and
     *      user's profil and total record MUST be updated after
     *
     * @param user The user who owns the deposit
     * @param depositId The deposit id that will be drain
     */
    function _drainDeposit(User storage user, uint256 depositId)
        private
        returns (uint256 amount, uint256 weight)
    {
        require(depositId < user.deposits.length, "Deposit does not exist");
        Deposit memory deposit = user.deposits[depositId];
        // TODO : Need test for already deleted deposit ?
        require(
            deposit.lockedUntil <= uint64(block.timestamp),
            "Staking of this deposit is not yet complete"
        );

        amount = deposit.amount;
        weight = deposit.weight;

        // Reset deposit
        delete user.deposits[depositId];
    }

    /**
     * @notice Used to calculate and pay pending rewards to the `_staker`
     *
     * @dev When there are no rewards to calculate, function doesn't throw and exits silently
     * @dev If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     *      otherwise they are transmitted directly to the user (as for flash pools)
     * @dev If `_withUpdate` is false, rewards MUST be updated before and user's missing rewards
     *      MUST be reset after
     * @dev Executed internally in `unstake`, `stakeFor`, `updateStakeLock` and `processRewards` functions
     *
     * @param _staker Staker address
     * @param _withUpdate If we need to update rewards and user's missing rewards in this function
     *
     * @return userPendingRewards rewards calculated and optionally re-staked
     */

    function _processRewards(address _staker, bool _withUpdate)
        private
        returns (uint256 userPendingRewards)
    {
        if (_withUpdate && canUpdateRewards()) {
            // Update rewards before use them if it hasn't been done before
            updateRewards();
        }

        userPendingRewards = pendingRewards(_staker);
        if (userPendingRewards == 0) {
            return 0;
        }

        User storage user = users[_staker];

        // If no locking/staking for rewards
        if (rewardsLockingPeriod == 0) {
            // transfer tokens for user
            rewardToken.safeTransfer(_staker, userPendingRewards);
        } else {
            // Stake rewards
            uint256 weight = calculateUserWeight(
                userPendingRewards,
                rewardsLockingPeriod
            );

            uint64 lockStart = uint64(block.timestamp);
            uint64 lockEnd = lockStart + rewardsLockingPeriod;

            Deposit memory deposit = Deposit({
                amount: userPendingRewards,
                weight: weight,
                lockedFrom: lockStart,
                lockedUntil: lockEnd
            });

            // Update user and total records
            user.deposits.push(deposit);
            _increaseUserRecords(user, userPendingRewards, weight, false);
        }

        user.releasedRewards = user.releasedRewards.add(userPendingRewards);
        totalProcessedRewards = totalProcessedRewards.add(userPendingRewards);

        if (_withUpdate) {
            // Reset the missingRewards of the user if it will not be done next
            user.missingRewards = weightToReward(
                user.totalWeight,
                rewardsPerWeight
            );
        }

        emit ProcessRewards(_staker, userPendingRewards);
    }

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
