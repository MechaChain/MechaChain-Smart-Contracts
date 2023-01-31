# `MechaniumStakingPool`
**Documentation of `MechaniumStaking/MechaniumStakingPool.sol`.**

MechaniumStakingPool - Staking pool smart contract




## TABLE OF CONTENTS
- [Events](#events)
    - [`Stake`](#MechaniumStakingPool-Stake-address-uint256-uint64-) 
    - [`Unstake`](#MechaniumStakingPool-Unstake-address-uint256-uint256-) 
    - [`Unstake`](#MechaniumStakingPool-Unstake-address-uint256-uint256---) 
    - [`StakeLockUpdated`](#MechaniumStakingPool-StakeLockUpdated-address-uint256-uint64-) 
    - [`RewardsPerBlockChanged`](#MechaniumStakingPool-RewardsPerBlockChanged-uint256-) 
    - [`ProcessRewards`](#MechaniumStakingPool-ProcessRewards-address-uint256-) 
    - [`RewardsPerWeightUpdated`](#MechaniumStakingPool-RewardsPerWeightUpdated-uint256-) 
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-) (inherited)
    - [`OwnershipTransferred`](#Ownable-OwnershipTransferred-address-address-) (inherited)

- [Public Functions](#public-functions)
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
    - [`fallback`](#MechaniumCanReleaseUnintendedOwnable-fallback--) (inherited)
    - [`receive`](#MechaniumCanReleaseUnintendedOwnable-receive--) (inherited)
    - [`releaseUnintended`](#MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-) (inherited)
    - [`owner`](#Ownable-owner--) (inherited)
    - [`renounceOwnership`](#Ownable-renounceOwnership--) (inherited)
    - [`transferOwnership`](#Ownable-transferOwnership-address-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_increaseUserRecords`](#MechaniumStakingPool-_increaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-) 
    - [`_decreaseUserRecords`](#MechaniumStakingPool-_decreaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-) 
    - [`_drainDeposit`](#MechaniumStakingPool-_drainDeposit-struct-IMechaniumStakingPool-User-uint256-) 
    - [`_processRewards`](#MechaniumStakingPool-_processRewards-address-bool-) 
    - [`_getRange`](#MechaniumStakingPool-_getRange-uint256-uint256-uint256-uint256-uint256-) 
    - [`_addLockedToken`](#MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-) (inherited)
    - [`_checkOwner`](#Ownable-_checkOwner--) (inherited)
    - [`_transferOwnership`](#Ownable-_transferOwnership-address-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyOwner`](#Ownable-onlyOwner--) (inherited)

- [Structs](#structs)
    - [`User`](#IMechaniumStakingPool-User) (inherited)
    - [`Deposit`](#IMechaniumStakingPool-Deposit) (inherited)



## EVENTS

### `Stake(address account, uint256 amount, uint64 lockPeriod)`  <a name="MechaniumStakingPool-Stake-address-uint256-uint64-" id="MechaniumStakingPool-Stake-address-uint256-uint64-"></a>
Event emitted when an `account` stakes `amount` for `lockPeriod`





### `Unstake(address account, uint256 amount, uint256 depositId)`  <a name="MechaniumStakingPool-Unstake-address-uint256-uint256-" id="MechaniumStakingPool-Unstake-address-uint256-uint256-"></a>
Event emitted when an `account` unstaked a deposit (`depositId`)





### `Unstake(address account, uint256 amount, uint256[] depositIds)`  <a name="MechaniumStakingPool-Unstake-address-uint256-uint256---" id="MechaniumStakingPool-Unstake-address-uint256-uint256---"></a>
Event emitted when an `account` unstaked several deposits (`depositIds`)





### `StakeLockUpdated(address account, uint256 depositId, uint64 lockPeriod)`  <a name="MechaniumStakingPool-StakeLockUpdated-address-uint256-uint64-" id="MechaniumStakingPool-StakeLockUpdated-address-uint256-uint64-"></a>
Event emitted when an `account` updated stake `lockPeriod` for a `depositId`





### `RewardsPerBlockChanged(uint256 rewardsPerBlock)`  <a name="MechaniumStakingPool-RewardsPerBlockChanged-uint256-" id="MechaniumStakingPool-RewardsPerBlockChanged-uint256-"></a>
Event emitted when an `rewardsPerBlock` is updated





### `ProcessRewards(address account, uint256 rewards)`  <a name="MechaniumStakingPool-ProcessRewards-address-uint256-" id="MechaniumStakingPool-ProcessRewards-address-uint256-"></a>
Event emitted when `rewards` are processed for an `account`





### `RewardsPerWeightUpdated(uint256 _rewardsPerWeight)`  <a name="MechaniumStakingPool-RewardsPerWeightUpdated-uint256-" id="MechaniumStakingPool-RewardsPerWeightUpdated-uint256-"></a>
Event emitted when `_rewardsPerWeight` is updated





### `ReleaseUintentedTokens(address token, address account, uint256 amount)` (inherited) <a name="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-" id="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-"></a>
Event emitted when release unintended `amount` of `token` for `account` address



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `OwnershipTransferred(address previousOwner, address newOwner)` (inherited) <a name="Ownable-OwnershipTransferred-address-address-" id="Ownable-OwnershipTransferred-address-address-"></a>




_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 stakedToken_, contract IERC20 rewardToken_, uint32 initBlock_, uint64 minStakingTime_, uint64 maxStakingTime_, uint16 minWeightMultiplier_, uint16 maxWeightMultiplier_, uint64 rewardsLockingPeriod_, uint256 rewardsPerBlock_)` (public) <a name="MechaniumStakingPool-constructor-contract-IERC20-contract-IERC20-uint32-uint64-uint64-uint16-uint16-uint64-uint256-" id="MechaniumStakingPool-constructor-contract-IERC20-contract-IERC20-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></a>
Contract constructor sets the configuration of the staking pool



Parameters:
- `stakedToken_`: The token to be staked ( can be same as rewardToken if not flash pool )

- `rewardToken_`:  The token to be rewarded

- `initBlock_`: The init block ( if set to 0 will take the current block )

- `minStakingTime_`: The minimum allowed locking time

- `maxStakingTime_`: The maximum allowed locking time

- `minWeightMultiplier_`: The minimum weight multiplier ( Used to calculate weight range )

- `maxWeightMultiplier_`: The maximum weight multiplier ( Used to calculate weight range )

- `rewardsLockingPeriod_`:  The rewards locking period ( Can be 0 if flash pool )

- `rewardsPerBlock_`: The amount of tokens to be rewarded per block passed



### `stake(uint256 amount, uint64 lockPeriod) → bool` (public) <a name="MechaniumStakingPool-stake-uint256-uint64-" id="MechaniumStakingPool-stake-uint256-uint64-"></a>
Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`

Uses the `depositFor` function


Parameters:
- `amount`: The amount of tokens to stake

- `lockPeriod`: The locking period ( in seconds )



### `depositFor(address account, uint256 amount, uint256 lockPeriod) → bool` (public) <a name="MechaniumStakingPool-depositFor-address-uint256-uint256-" id="MechaniumStakingPool-depositFor-address-uint256-uint256-"></a>
Used to stake an `amount` of tokens for a `lockPeriod` for an `account`

Will make a safe transfer from the `account` and calculate the weight and create a deposit


Parameters:
- `account`: The account that we will stake the tokens for

- `amount`: The amount of tokens to stake

- `lockPeriod`: The locking period ( in seconds )



### `processRewards() → uint256 userPendingRewards` (public) <a name="MechaniumStakingPool-processRewards--" id="MechaniumStakingPool-processRewards--"></a>
Used to calculate and pay pending rewards to the `msg.sender`


Automatically updates rewards before processing them
When there are no rewards to calculate, throw error
If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     otherwise they are transmitted directly to the user (as for flash pools)






### `unstake(uint256[] depositIds) → bool` (public) <a name="MechaniumStakingPool-unstake-uint256---" id="MechaniumStakingPool-unstake-uint256---"></a>
Used to unstake several deposits for the `msg.sender`


ProcessRewards and transfer all deposits to the user
Revert if the `lockedUntil` of a deposit has not passed



Parameters:
- `depositIds`: Array of deposit id that will be unstaked



### `unstake(uint256 depositId) → bool` (public) <a name="MechaniumStakingPool-unstake-uint256-" id="MechaniumStakingPool-unstake-uint256-"></a>
Used to unstake a `depositId` for the `msg.sender`


ProcessRewards and transfer all the deposit to the user
Revert if the `lockedUntil` of the deposit has not passed



Parameters:
- `depositId`: The deposit id that will be unstaked



### `updateRewards() → bool` (public) <a name="MechaniumStakingPool-updateRewards--" id="MechaniumStakingPool-updateRewards--"></a>
Used to update the rewards per weight and the total rewards

Must be called before each total weight change




### `setRewardsPerBlock(uint256 rewardsPerBlock_) → bool` (public) <a name="MechaniumStakingPool-setRewardsPerBlock-uint256-" id="MechaniumStakingPool-setRewardsPerBlock-uint256-"></a>
Used to change the rewardsPerBlock


Will update rewards before changing the rewardsPerBlock
Can only by call by owner (the factory if deployed by it)
Revert if the new rewards per block is less than the previous one



Parameters:
- `rewardsPerBlock_`: the new value for rewardsPerBlock ( must be superior to old value )



### `remainingAllocatedTokens() → uint256` (public) <a name="MechaniumStakingPool-remainingAllocatedTokens--" id="MechaniumStakingPool-remainingAllocatedTokens--"></a>
Used to get the remaining allocated tokens





### `pendingRewards(address account) → uint256` (public) <a name="MechaniumStakingPool-pendingRewards-address-" id="MechaniumStakingPool-pendingRewards-address-"></a>
Used to get the pending rewards for an `account`



Parameters:
- `account`: The account to calculate the pending rewards for




### `canUpdateRewards() → bool` (public) <a name="MechaniumStakingPool-canUpdateRewards--" id="MechaniumStakingPool-canUpdateRewards--"></a>
Can we call the rewards update function or is it useless and will cause an error





### `balanceOf(address account) → uint256` (public) <a name="MechaniumStakingPool-balanceOf-address-" id="MechaniumStakingPool-balanceOf-address-"></a>
Used to get the balance for an `account`



Parameters:
- `account`: The account to get the balance for



### `getDeposit(address account, uint256 depositId) → struct IMechaniumStakingPool.Deposit` (public) <a name="MechaniumStakingPool-getDeposit-address-uint256-" id="MechaniumStakingPool-getDeposit-address-uint256-"></a>
Used to get the deposit (`depositId`) for an `account`



Parameters:
- `account`: The account to get the balance for

- `depositId`: The deposit id the get



### `getDepositsLength(address account) → uint256` (public) <a name="MechaniumStakingPool-getDepositsLength-address-" id="MechaniumStakingPool-getDepositsLength-address-"></a>
Used to get the length of deposits for an `account`



Parameters:
- `account`: The account to get the balance for



### `getUser(address account) → struct IMechaniumStakingPool.User` (public) <a name="MechaniumStakingPool-getUser-address-" id="MechaniumStakingPool-getUser-address-"></a>
Used to get the User data for an `account`



Parameters:
- `account`: The account address



### `updatedRewards() → uint256` (public) <a name="MechaniumStakingPool-updatedRewards--" id="MechaniumStakingPool-updatedRewards--"></a>
Get the updated rewards

Used to calculate the rewards for last period ( in blocks ) without updating them




### `updatedTotalRewards() → uint256` (public) <a name="MechaniumStakingPool-updatedTotalRewards--" id="MechaniumStakingPool-updatedTotalRewards--"></a>
Get the total updated rewards

Used to calculate the rewards from the init block without updating them




### `updatedRewardsPerWeight() → uint256` (public) <a name="MechaniumStakingPool-updatedRewardsPerWeight--" id="MechaniumStakingPool-updatedRewardsPerWeight--"></a>
Get the updated rewards per weight

Used to calculate `_rewardsPerWeight` without updating them




### `calculateUserWeight(uint256 amount, uint64 stakingTime) → uint256` (public) <a name="MechaniumStakingPool-calculateUserWeight-uint256-uint64-" id="MechaniumStakingPool-calculateUserWeight-uint256-uint64-"></a>
Calculate the weight based on `amount` and `stakingTime`



Parameters:
- `amount`: The staking amount

- `stakingTime`: The staking time



### `weightToReward(uint256 weight_, uint256 rewardsPerWeight_) → uint256` (public) <a name="MechaniumStakingPool-weightToReward-uint256-uint256-" id="MechaniumStakingPool-weightToReward-uint256-uint256-"></a>

Converts stake weight to reward value, applying the division on weight



Parameters:
- `weight_`: stake weight

- `rewardsPerWeight_`: reward per weight




### `fallback()` (external) (inherited)<a name="MechaniumCanReleaseUnintendedOwnable-fallback--" id="MechaniumCanReleaseUnintendedOwnable-fallback--"></a>
fallback payable function ( used to receive ETH in tests )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `receive()` (external) (inherited)<a name="MechaniumCanReleaseUnintendedOwnable-receive--" id="MechaniumCanReleaseUnintendedOwnable-receive--"></a>
receive payable function ( used to receive ETH in tests )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `releaseUnintended(address token, address account, uint256 amount) → bool` (public) (inherited)<a name="MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-" id="MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-"></a>
Release an `amount` of `token` to an `account`
This function is used to prevent unintended tokens that got sent to be stuck on the contract



Parameters:
- `token`: The address of the token contract (zero address for claiming native coins).

- `account`: The address of the tokens/coins receiver.

- `amount`: Amount to claim.

_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `owner() → address` (public) (inherited)<a name="Ownable-owner--" id="Ownable-owner--"></a>

Returns the address of the current owner.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `renounceOwnership()` (public) (inherited)<a name="Ownable-renounceOwnership--" id="Ownable-renounceOwnership--"></a>

Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions anymore. Can only be called by the current owner.
NOTE: Renouncing ownership will leave the contract without an owner,
thereby removing any functionality that is only available to the owner.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `transferOwnership(address newOwner)` (public) (inherited)<a name="Ownable-transferOwnership-address-" id="Ownable-transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


## INTERNAL FUNCTIONS

### `_increaseUserRecords(struct IMechaniumStakingPool.User user, uint256 amount, uint256 weight, bool updateMissingRewards) → bool` (internal)  <a name="MechaniumStakingPool-_increaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-" id="MechaniumStakingPool-_increaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-"></a>
Update the user and total records by increasing the weight and the total staked


Increase user's `totalStaked`, `totalWeight` and reset `missingRewards`
Increase `totalUsersWeight` and `totalTokensStaked`
Rewards MUST be updated before and processed for this users



Parameters:
- `user`: The user to update

- `amount`: The amount to increase

- `weight`: The weight to increase



### `_decreaseUserRecords(struct IMechaniumStakingPool.User user, uint256 amount, uint256 weight, bool updateMissingRewards) → bool` (internal)  <a name="MechaniumStakingPool-_decreaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-" id="MechaniumStakingPool-_decreaseUserRecords-struct-IMechaniumStakingPool-User-uint256-uint256-bool-"></a>
Update the user and total records by decreasing the weight and the total staked


Decrease user's `totalStaked`, `totalWeight` and reset `missingRewards`
Decrease `totalUsersWeight` and `totalTokensStaked`
Rewards MUST be updated before and processed for this users
If `updateMissingRewards` is false, `missingRewards` rewards MUST be updated after



Parameters:
- `user`: The user to update

- `amount`: The amount to decrease

- `weight`: The weight to decrease

- `updateMissingRewards`: If we have to update the missing rewards of the user



### `_drainDeposit(struct IMechaniumStakingPool.User user, uint256 depositId) → uint256 amount, uint256 weight` (internal)  <a name="MechaniumStakingPool-_drainDeposit-struct-IMechaniumStakingPool-User-uint256-" id="MechaniumStakingPool-_drainDeposit-struct-IMechaniumStakingPool-User-uint256-"></a>
Remove a deposit if the locking is over and return its amount and weight


Set the deposit's `isClaimed` to true
Revert if `depositId` does not exist or if the `lockedUntil`
     of the deposit has not passed
Does not update records : rewards MUST be updated before and
     user's profile and total record MUST be updated after



Parameters:
- `user`: The user who owns the deposit

- `depositId`: The deposit id that will be drain



### `_processRewards(address _staker, bool _withUpdate) → uint256 userPendingRewards` (internal)  <a name="MechaniumStakingPool-_processRewards-address-bool-" id="MechaniumStakingPool-_processRewards-address-bool-"></a>
Used to calculate and pay pending rewards to the `_staker`


When there are no rewards to calculate, function doesn't throw and exits silently
If `rewardsLockingPeriod` is set, rewards are staked in a new deposit,
     otherwise they are transmitted directly to the user (as for flash pools)
If `_withUpdate` is false, rewards MUST be updated before and user's missing rewards
     MUST be reset after
Executed internally in `unstake`, `depositFor`, `updateStakeLock` and `processRewards` functions



Parameters:
- `_staker`: Staker address

- `_withUpdate`: If we need to update rewards and user's missing rewards in this function





### `_getRange(uint256 x1, uint256 y1, uint256 x2, uint256 y2, uint256 a) → uint256` (internal)  <a name="MechaniumStakingPool-_getRange-uint256-uint256-uint256-uint256-uint256-" id="MechaniumStakingPool-_getRange-uint256-uint256-uint256-uint256-uint256-"></a>
Used to get the range for the staking time



Parameters:
- `x1`: The minimum staking time

- `y1`: The minimum weight time

- `x2`: The maximum staking time

- `y2`: The maximum weight time

- `a`: The actual staking time



### `_addLockedToken(address token_)` (internal) (inherited) <a name="MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-" id="MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-"></a>
Add a locked `token_` ( can't be released )



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `_checkOwner()` (internal) (inherited) <a name="Ownable-_checkOwner--" id="Ownable-_checkOwner--"></a>

Throws if the sender is not the owner.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `_transferOwnership(address newOwner)` (internal) (inherited) <a name="Ownable-_transferOwnership-address-" id="Ownable-_transferOwnership-address-"></a>

Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


### `_msgSender() → address` (internal) (inherited) <a name="Context-_msgSender--" id="Context-_msgSender--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.


### `_msgData() → bytes` (internal) (inherited) <a name="Context-_msgData--" id="Context-_msgData--"></a>




_Inherited from `../@openzeppelin/contracts/utils/Context.sol`_.



## MODIFIERS

### `onlyOwner()` (inherited) <a name="Ownable-onlyOwner--" id="Ownable-onlyOwner--"></a>


Throws if called by any account other than the owner.


_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.


## STRUCTS

### `User` (inherited) <a name="IMechaniumStakingPool-User" id="IMechaniumStakingPool-User"></a>
- uint256 totalStaked
- uint256 totalWeight
- uint256 missingRewards
- uint256 releasedRewards
- struct IMechaniumStakingPool.Deposit[] deposits

_Inherited from `MechaniumStaking/IMechaniumStakingPool.sol`_.


### `Deposit` (inherited) <a name="IMechaniumStakingPool-Deposit" id="IMechaniumStakingPool-Deposit"></a>
- uint256 amount
- uint256 weight
- uint64 lockedFrom
- uint64 lockedUntil
- bool isRewards
- bool isClaimed

_Inherited from `MechaniumStaking/IMechaniumStakingPool.sol`_.


