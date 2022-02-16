# `IMechaniumStakingPool`
Staking pool smart contract interface




**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
    - [`stake`](#IMechaniumStakingPool-stake-uint256-uint64-)
    - [`depositFor`](#IMechaniumStakingPool-depositFor-address-uint256-uint256-)
    - [`processRewards`](#IMechaniumStakingPool-processRewards--)
    - [`unstake`](#IMechaniumStakingPool-unstake-uint256---)
    - [`unstake`](#IMechaniumStakingPool-unstake-uint256-)
    - [`updateRewards`](#IMechaniumStakingPool-updateRewards--)
    - [`setRewardsPerBlock`](#IMechaniumStakingPool-setRewardsPerBlock-uint256-)
    - [`remainingAllocatedTokens`](#IMechaniumStakingPool-remainingAllocatedTokens--)
    - [`pendingRewards`](#IMechaniumStakingPool-pendingRewards-address-)
    - [`canUpdateRewards`](#IMechaniumStakingPool-canUpdateRewards--)
    - [`balanceOf`](#IMechaniumStakingPool-balanceOf-address-)
    - [`getDeposit`](#IMechaniumStakingPool-getDeposit-address-uint256-)
    - [`getDepositsLength`](#IMechaniumStakingPool-getDepositsLength-address-)
    - [`getUser`](#IMechaniumStakingPool-getUser-address-)
    - [`updatedRewards`](#IMechaniumStakingPool-updatedRewards--)
    - [`updatedTotalRewards`](#IMechaniumStakingPool-updatedTotalRewards--)
    - [`updatedRewardsPerWeight`](#IMechaniumStakingPool-updatedRewardsPerWeight--)
    - [`calculateUserWeight`](#IMechaniumStakingPool-calculateUserWeight-uint256-uint64-)
    - [`weightToReward`](#IMechaniumStakingPool-weightToReward-uint256-uint256-)

- [PRIVATE FUNCTIONS](#private-functions)


- [STRUCTS](#structs)
    - [`User`](#IMechaniumStakingPool-User)
    - [`Deposit`](#IMechaniumStakingPool-Deposit)





## PUBLIC FUNCTIONS

### `stake(uint256 amount, uint64 lockPeriod) → bool` (external) <span id="IMechaniumStakingPool-stake-uint256-uint64-"></span>
Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`


### `depositFor(address account, uint256 amount, uint256 lockPeriod) → bool` (external) <span id="IMechaniumStakingPool-depositFor-address-uint256-uint256-"></span>
Used to stake an `amount` of tokens for a `lockPeriod` for an `account`


### `processRewards() → uint256` (external) <span id="IMechaniumStakingPool-processRewards--"></span>
Used to calculate and pay pending rewards to the `msg.sender`


### `unstake(uint256[] depositIds) → bool` (external) <span id="IMechaniumStakingPool-unstake-uint256---"></span>
Used to unstake several deposits for the `msg.sender`


### `unstake(uint256 depositId) → bool` (external) <span id="IMechaniumStakingPool-unstake-uint256-"></span>
Used to unstake a `depositId` for the `msg.sender`


### `updateRewards() → bool` (external) <span id="IMechaniumStakingPool-updateRewards--"></span>
Used to update the rewards per weight and the total rewards


### `setRewardsPerBlock(uint256 rewardsPerBlock) → bool` (external) <span id="IMechaniumStakingPool-setRewardsPerBlock-uint256-"></span>
Used to change the rewardsPerBlock


### `remainingAllocatedTokens() → uint256` (external) <span id="IMechaniumStakingPool-remainingAllocatedTokens--"></span>
Used to get the remaining allocated tokens


### `pendingRewards(address account) → uint256` (external) <span id="IMechaniumStakingPool-pendingRewards-address-"></span>
Used to get the pending rewards for an `account`


### `canUpdateRewards() → bool` (external) <span id="IMechaniumStakingPool-canUpdateRewards--"></span>
Can we call the rewards function or is it useless and will cause an error


### `balanceOf(address account) → uint256` (external) <span id="IMechaniumStakingPool-balanceOf-address-"></span>
Used to get the balance for an `account`


### `getDeposit(address account, uint256 depositId) → struct IMechaniumStakingPool.Deposit` (external) <span id="IMechaniumStakingPool-getDeposit-address-uint256-"></span>
Used to get the deposit (`depositId`) for an `account`


### `getDepositsLength(address account) → uint256` (external) <span id="IMechaniumStakingPool-getDepositsLength-address-"></span>
Used to get the length of deposits for an `account`


### `getUser(address account) → struct IMechaniumStakingPool.User` (external) <span id="IMechaniumStakingPool-getUser-address-"></span>
Used to get the User data for an `account`


### `updatedRewards() → uint256` (external) <span id="IMechaniumStakingPool-updatedRewards--"></span>
Get the updated rewards


### `updatedTotalRewards() → uint256` (external) <span id="IMechaniumStakingPool-updatedTotalRewards--"></span>
Get the total updated rewards


### `updatedRewardsPerWeight() → uint256` (external) <span id="IMechaniumStakingPool-updatedRewardsPerWeight--"></span>
Get the updated rewards per weight


### `calculateUserWeight(uint256 amount, uint64 stakingTime) → uint256` (external) <span id="IMechaniumStakingPool-calculateUserWeight-uint256-uint64-"></span>
Calculate the weight based on `amount` and `stakingTime`


### `weightToReward(uint256 _weight, uint256 _rewardsPerWeight) → uint256` (external) <span id="IMechaniumStakingPool-weightToReward-uint256-uint256-"></span>
Converts stake weight to reward value, applying the division on weight


## PRIVATE FUNCTIONS


## STRUCTS

### `User` <span id="IMechaniumStakingPool-User"></span>
- uint256 totalStaked
- uint256 totalWeight
- uint256 missingRewards
- uint256 releasedRewards
- struct IMechaniumStakingPool.Deposit[] deposits

### `Deposit` <span id="IMechaniumStakingPool-Deposit"></span>
- uint256 amount
- uint256 weight
- uint64 lockedFrom
- uint64 lockedUntil
- bool isRewards
- bool isClaimed

