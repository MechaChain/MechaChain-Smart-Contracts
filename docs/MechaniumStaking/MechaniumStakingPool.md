# `MechaniumStakingPool`
MechaniumStakingPool - Staking pool smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`Stake`](#MechaniumStakingPool-Stake-address-uint256-uint64-)
    - [`Unstake`](#MechaniumStakingPool-Unstake-address-uint256-uint256-)
    - [`Unstake`](#MechaniumStakingPool-Unstake-address-uint256-uint256---)
    - [`StakeLockUpdated`](#MechaniumStakingPool-StakeLockUpdated-address-uint256-uint64-)
    - [`RewardsPerBlockChanged`](#MechaniumStakingPool-RewardsPerBlockChanged-uint256-)
    - [`ProcessRewards`](#MechaniumStakingPool-ProcessRewards-address-uint256-)
    - [`RewardsPerWeightUpdated`](#MechaniumStakingPool-RewardsPerWeightUpdated-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`constructor`](#MechaniumStakingPool-constructor-contract-IERC20-contract-IERC20-uint32-uint64-uint64-uint16-uint16-uint64-uint256-)
    - [`stake`](#MechaniumStakingPool-stake-uint256-uint64-)
    - [`depositFor`](#MechaniumStakingPool-depositFor-address-uint256-uint256-)
    - [`processRewards`](#MechaniumStakingPool-processRewards--)
    - [`unstake`](#MechaniumStakingPool-unstake-uint256---)
    - [`unstake`](#MechaniumStakingPool-unstake-uint256-)
    - [`updateRewards`](#MechaniumStakingPool-updateRewards--)
    - [`setRewardsPerBlock`](#MechaniumStakingPool-setRewardsPerBlock-uint256-)
    - [`remainingAllocatedTokens`](#MechaniumStakingPool-remainingAllocatedTokens--)
    - [`pendingRewards`](#MechaniumStakingPool-pendingRewards-address-)
    - [`canUpdateRewards`](#MechaniumStakingPool-canUpdateRewards--)
    - [`balanceOf`](#MechaniumStakingPool-balanceOf-address-)
    - [`getDeposit`](#MechaniumStakingPool-getDeposit-address-uint256-)
    - [`getDepositsLength`](#MechaniumStakingPool-getDepositsLength-address-)
    - [`getUser`](#MechaniumStakingPool-getUser-address-)
    - [`updatedRewards`](#MechaniumStakingPool-updatedRewards--)
    - [`updatedTotalRewards`](#MechaniumStakingPool-updatedTotalRewards--)
    - [`updatedRewardsPerWeight`](#MechaniumStakingPool-updatedRewardsPerWeight--)
    - [`calculateUserWeight`](#MechaniumStakingPool-calculateUserWeight-uint256-uint64-)
    - [`weightToReward`](#MechaniumStakingPool-weightToReward-uint256-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)
    - [`_increaseUserRecords`](#MechaniumStakingPool-_increaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-)
    - [`_decreaseUserRecords`](#MechaniumStakingPool-_decreaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-)
    - [`_drainDeposit`](#MechaniumStakingPool-_drainDeposit-struct-IMechaniumStakingPool-User-uint256-)
    - [`_processRewards`](#MechaniumStakingPool-_processRewards-address-bool-)
    - [`_getRange`](#MechaniumStakingPool-_getRange-uint256-uint256-uint256-uint256-uint256-)





## EVENTS

### `Stake(address account, uint256 amount, uint64 lockPeriod)` <span id="MechaniumStakingPool-Stake-address-uint256-uint64-"></span>
Event emitted when an `account` stakes `amount` for `lockPeriod`


### `Unstake(address account, uint256 amount, uint256 depositId)` <span id="MechaniumStakingPool-Unstake-address-uint256-uint256-"></span>
Event emitted when an `account` unstaked a deposit (`depositId`)


### `Unstake(address account, uint256 amount, uint256[] depositIds)` <span id="MechaniumStakingPool-Unstake-address-uint256-uint256---"></span>
Event emitted when an `account` unstaked several deposits (`depositIds`)


### `StakeLockUpdated(address account, uint256 depositId, uint64 lockPeriod)` <span id="MechaniumStakingPool-StakeLockUpdated-address-uint256-uint64-"></span>
Event emitted when an `account` updated stake `lockPeriod` for a `depositId`


### `RewardsPerBlockChanged(uint256 rewardsPerBlock)` <span id="MechaniumStakingPool-RewardsPerBlockChanged-uint256-"></span>
Event emitted when an `rewardsPerBlock` is updated


### `ProcessRewards(address account, uint256 rewards)` <span id="MechaniumStakingPool-ProcessRewards-address-uint256-"></span>
Event emitted when `rewards` are processed for an `account`


### `RewardsPerWeightUpdated(uint256 _rewardsPerWeight)` <span id="MechaniumStakingPool-RewardsPerWeightUpdated-uint256-"></span>
Event emitted when `_rewardsPerWeight` is updated



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 stakedToken_, contract IERC20 rewardToken_, uint32 initBlock_, uint64 minStakingTime_, uint64 maxStakingTime_, uint16 minWeightMultiplier_, uint16 maxWeightMultiplier_, uint64 rewardsLockingPeriod_, uint256 rewardsPerBlock_)` (public) <span id="MechaniumStakingPool-constructor-contract-IERC20-contract-IERC20-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></span>
Contract constructor sets the configuration of the staking pool


- `stakedToken_`: The token to be staked ( can be same as rewardToken if not flash pool )

- `rewardToken_`:  The token to be rewarded

- `initBlock_`: The init block ( if set to 0 will take the current block )

- `minStakingTime_`: The minimum allowed locking time

- `maxStakingTime_`: The maximum allowed locking time

- `minWeightMultiplier_`: The minimum weight multiplier ( Used to calculate weight range )

- `maxWeightMultiplier_`: The maximum weight multiplier ( Used to calculate weight range )

- `rewardsLockingPeriod_`:  The rewards locking period ( Can be 0 if flash pool )

- `rewardsPerBlock_`: The amount of tokens to be rewarded per block passed

### `stake(uint256 amount, uint64 lockPeriod) → bool` (public) <span id="MechaniumStakingPool-stake-uint256-uint64-"></span>
Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`

Uses the `depositFor` function

- `amount`: The amount of tokens to stake

- `lockPeriod`: The locking period ( in seconds )

### `depositFor(address account, uint256 amount, uint256 lockPeriod) → bool` (public) <span id="MechaniumStakingPool-depositFor-address-uint256-uint256-"></span>
Used to stake an `amount` of tokens for a `lockPeriod` for an `account`

Will make a safe transfer from the `account` and calculate the weight and create a deposit

- `account`: The account that we will stake the tokens for

- `amount`: The amount of tokens to stake

- `lockPeriod`: The locking period ( in seconds )

### `processRewards() → uint256 userPendingRewards` (public) <span id="MechaniumStakingPool-processRewards--"></span>
Used to calculate and pay pending rewards to the `msg.sender`


Automatically updates rewards before processing them
When there are no rewards to calculate, throw error
If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     otherwise they are transmitted directly to the user (as for flash pools)



### `unstake(uint256[] depositIds) → bool` (public) <span id="MechaniumStakingPool-unstake-uint256---"></span>
Used to unstake several deposits for the `msg.sender`


ProcessRewards and transfer all deposits to the user
Revert if the `lockedUntil` of a deposit has not passed


- `depositIds`: Array of deposit id that will be unstaked

### `unstake(uint256 depositId) → bool` (public) <span id="MechaniumStakingPool-unstake-uint256-"></span>
Used to unstake a `depositId` for the `msg.sender`


ProcessRewards and transfer all the deposit to the user
Revert if the `lockedUntil` of the deposit has not passed


- `depositId`: The deposit id that will be unstaked

### `updateRewards() → bool` (public) <span id="MechaniumStakingPool-updateRewards--"></span>
Used to update the rewards per weight and the total rewards

Must be called before each total weight change

### `setRewardsPerBlock(uint256 rewardsPerBlock_) → bool` (public) <span id="MechaniumStakingPool-setRewardsPerBlock-uint256-"></span>
Used to change the rewardsPerBlock


Will update rewards before changing the rewardsPerBlock
Can only by call by owner (the factory if deployed by it)
Revert if the new rewards per block is less than the previous one


- `rewardsPerBlock_`: the new value for rewardsPerBlock ( must be superior to old value )

### `remainingAllocatedTokens() → uint256` (public) <span id="MechaniumStakingPool-remainingAllocatedTokens--"></span>
Used to get the remaining allocated tokens


### `pendingRewards(address account) → uint256` (public) <span id="MechaniumStakingPool-pendingRewards-address-"></span>
Used to get the pending rewards for an `account`


- `account`: The account to calculate the pending rewards for


### `canUpdateRewards() → bool` (public) <span id="MechaniumStakingPool-canUpdateRewards--"></span>
Can we call the rewards update function or is it useless and will cause an error


### `balanceOf(address account) → uint256` (public) <span id="MechaniumStakingPool-balanceOf-address-"></span>
Used to get the balance for an `account`


- `account`: The account to get the balance for

### `getDeposit(address account, uint256 depositId) → struct IMechaniumStakingPool.Deposit` (public) <span id="MechaniumStakingPool-getDeposit-address-uint256-"></span>
Used to get the deposit (`depositId`) for an `account`


- `account`: The account to get the balance for

- `depositId`: The deposit id the get

### `getDepositsLength(address account) → uint256` (public) <span id="MechaniumStakingPool-getDepositsLength-address-"></span>
Used to get the length of deposits for an `account`


- `account`: The account to get the balance for

### `getUser(address account) → struct IMechaniumStakingPool.User` (public) <span id="MechaniumStakingPool-getUser-address-"></span>
Used to get the User data for an `account`


- `account`: The account address

### `updatedRewards() → uint256` (public) <span id="MechaniumStakingPool-updatedRewards--"></span>
Get the updated rewards

Used to calculate the rewards for last period ( in blocks ) without updating them

### `updatedTotalRewards() → uint256` (public) <span id="MechaniumStakingPool-updatedTotalRewards--"></span>
Get the total updated rewards

Used to calculate the rewards from the init block without updating them

### `updatedRewardsPerWeight() → uint256` (public) <span id="MechaniumStakingPool-updatedRewardsPerWeight--"></span>
Get the updated rewards per weight

Used to calculate `_rewardsPerWeight` without updating them

### `calculateUserWeight(uint256 amount, uint64 stakingTime) → uint256` (public) <span id="MechaniumStakingPool-calculateUserWeight-uint256-uint64-"></span>
Calculate the weight based on `amount` and `stakingTime`


- `amount`: The staking amount

- `stakingTime`: The staking time

### `weightToReward(uint256 weight_, uint256 rewardsPerWeight_) → uint256` (public) <span id="MechaniumStakingPool-weightToReward-uint256-uint256-"></span>

Converts stake weight to reward value, applying the division on weight


- `weight_`: stake weight

- `rewardsPerWeight_`: reward per weight


## PRIVATE FUNCTIONS
### `_increaseUserRecords(struct IMechaniumStakingPool.User user, uint256 amount, uint256 weight, bool updateMissingRewards) → bool` (internal) <span id="MechaniumStakingPool-_increaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-"></span>
Update the user and total records by increasing the weight and the total staked


Increase user's `totalStaked`, `totalWeight` and reset `missingRewards`
Increase `totalUsersWeight` and `totalTokensStaked`
Rewards MUST be updated before and processed for this users


- `user`: The user to update

- `amount`: The amount to increase

- `weight`: The weight to increase
### `_decreaseUserRecords(struct IMechaniumStakingPool.User user, uint256 amount, uint256 weight, bool updateMissingRewards) → bool` (internal) <span id="MechaniumStakingPool-_decreaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-"></span>
Update the user and total records by decreasing the weight and the total staked


Decrease user's `totalStaked`, `totalWeight` and reset `missingRewards`
Decrease `totalUsersWeight` and `totalTokensStaked`
Rewards MUST be updated before and processed for this users
If `updateMissingRewards` is false, `missingRewards` rewards MUST be updated after


- `user`: The user to update

- `amount`: The amount to decrease

- `weight`: The weight to decrease

- `updateMissingRewards`: If we have to update the missing rewards of the user
### `_drainDeposit(struct IMechaniumStakingPool.User user, uint256 depositId) → uint256 amount, uint256 weight` (internal) <span id="MechaniumStakingPool-_drainDeposit-struct-IMechaniumStakingPool-User-uint256-"></span>
Remove a deposit if the locking is over and return its amount and weight


Set the deposit's `isClaimed` to true
Revert if `depositId` does not exist or if the `lockedUntil`
     of the deposit has not passed
Does not update records : rewards MUST be updated before and
     user's profile and total record MUST be updated after


- `user`: The user who owns the deposit

- `depositId`: The deposit id that will be drain
### `_processRewards(address _staker, bool _withUpdate) → uint256 userPendingRewards` (internal) <span id="MechaniumStakingPool-_processRewards-address-bool-"></span>
Used to calculate and pay pending rewards to the `_staker`


When there are no rewards to calculate, function doesn't throw and exits silently
If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     otherwise they are transmitted directly to the user (as for flash pools)
If `_withUpdate` is false, rewards MUST be updated before and user's missing rewards
     MUST be reset after
Executed internally in `unstake`, `depositFor`, `updateStakeLock` and `processRewards` functions


- `_staker`: Staker address

- `_withUpdate`: If we need to update rewards and user's missing rewards in this function


### `_getRange(uint256 x1, uint256 y1, uint256 x2, uint256 y2, uint256 a) → uint256` (internal) <span id="MechaniumStakingPool-_getRange-uint256-uint256-uint256-uint256-uint256-"></span>
Used to get the range for the staking time


- `x1`: The minimum staking time

- `y1`: The minimum weight time

- `x2`: The maximum staking time

- `y2`: The maximum weight time

- `a`: The actual staking time



