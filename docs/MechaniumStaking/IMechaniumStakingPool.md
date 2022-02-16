# `IMechaniumStakingPool`
**Documentation of `MechaniumStaking/IMechaniumStakingPool.sol`.**

Staking pool smart contract interface




## TABLE OF CONTENTS

- [Public Functions](#public-functions)
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

- [Internal Functions](#internal-functions)




- [Structs](#structs)
    - [`User`](#IMechaniumStakingPool-User) 
    - [`Deposit`](#IMechaniumStakingPool-Deposit) 





## PUBLIC FUNCTIONS

### `stake(uint256 amount, uint64 lockPeriod) → bool` (external) <a name="IMechaniumStakingPool-stake-uint256-uint64-" id="IMechaniumStakingPool-stake-uint256-uint64-"></a>
Used to stake an `amount` of tokens for a `lockPeriod` for the `msg.sender`




### `depositFor(address account, uint256 amount, uint256 lockPeriod) → bool` (external) <a name="IMechaniumStakingPool-depositFor-address-uint256-uint256-" id="IMechaniumStakingPool-depositFor-address-uint256-uint256-"></a>
Used to stake an `amount` of tokens for a `lockPeriod` for an `account`




### `processRewards() → uint256` (external) <a name="IMechaniumStakingPool-processRewards--" id="IMechaniumStakingPool-processRewards--"></a>
Used to calculate and pay pending rewards to the `msg.sender`




### `unstake(uint256[] depositIds) → bool` (external) <a name="IMechaniumStakingPool-unstake-uint256---" id="IMechaniumStakingPool-unstake-uint256---"></a>
Used to unstake several deposits for the `msg.sender`




### `unstake(uint256 depositId) → bool` (external) <a name="IMechaniumStakingPool-unstake-uint256-" id="IMechaniumStakingPool-unstake-uint256-"></a>
Used to unstake a `depositId` for the `msg.sender`




### `updateRewards() → bool` (external) <a name="IMechaniumStakingPool-updateRewards--" id="IMechaniumStakingPool-updateRewards--"></a>
Used to update the rewards per weight and the total rewards




### `setRewardsPerBlock(uint256 rewardsPerBlock) → bool` (external) <a name="IMechaniumStakingPool-setRewardsPerBlock-uint256-" id="IMechaniumStakingPool-setRewardsPerBlock-uint256-"></a>
Used to change the rewardsPerBlock




### `remainingAllocatedTokens() → uint256` (external) <a name="IMechaniumStakingPool-remainingAllocatedTokens--" id="IMechaniumStakingPool-remainingAllocatedTokens--"></a>
Used to get the remaining allocated tokens




### `pendingRewards(address account) → uint256` (external) <a name="IMechaniumStakingPool-pendingRewards-address-" id="IMechaniumStakingPool-pendingRewards-address-"></a>
Used to get the pending rewards for an `account`




### `canUpdateRewards() → bool` (external) <a name="IMechaniumStakingPool-canUpdateRewards--" id="IMechaniumStakingPool-canUpdateRewards--"></a>
Can we call the rewards function or is it useless and will cause an error




### `balanceOf(address account) → uint256` (external) <a name="IMechaniumStakingPool-balanceOf-address-" id="IMechaniumStakingPool-balanceOf-address-"></a>
Used to get the balance for an `account`




### `getDeposit(address account, uint256 depositId) → struct IMechaniumStakingPool.Deposit` (external) <a name="IMechaniumStakingPool-getDeposit-address-uint256-" id="IMechaniumStakingPool-getDeposit-address-uint256-"></a>
Used to get the deposit (`depositId`) for an `account`




### `getDepositsLength(address account) → uint256` (external) <a name="IMechaniumStakingPool-getDepositsLength-address-" id="IMechaniumStakingPool-getDepositsLength-address-"></a>
Used to get the length of deposits for an `account`




### `getUser(address account) → struct IMechaniumStakingPool.User` (external) <a name="IMechaniumStakingPool-getUser-address-" id="IMechaniumStakingPool-getUser-address-"></a>
Used to get the User data for an `account`




### `updatedRewards() → uint256` (external) <a name="IMechaniumStakingPool-updatedRewards--" id="IMechaniumStakingPool-updatedRewards--"></a>
Get the updated rewards




### `updatedTotalRewards() → uint256` (external) <a name="IMechaniumStakingPool-updatedTotalRewards--" id="IMechaniumStakingPool-updatedTotalRewards--"></a>
Get the total updated rewards




### `updatedRewardsPerWeight() → uint256` (external) <a name="IMechaniumStakingPool-updatedRewardsPerWeight--" id="IMechaniumStakingPool-updatedRewardsPerWeight--"></a>
Get the updated rewards per weight




### `calculateUserWeight(uint256 amount, uint64 stakingTime) → uint256` (external) <a name="IMechaniumStakingPool-calculateUserWeight-uint256-uint64-" id="IMechaniumStakingPool-calculateUserWeight-uint256-uint64-"></a>
Calculate the weight based on `amount` and `stakingTime`




### `weightToReward(uint256 _weight, uint256 _rewardsPerWeight) → uint256` (external) <a name="IMechaniumStakingPool-weightToReward-uint256-uint256-" id="IMechaniumStakingPool-weightToReward-uint256-uint256-"></a>
Converts stake weight to reward value, applying the division on weight




## INTERNAL FUNCTIONS



## STRUCTS

### `User`  <a name="IMechaniumStakingPool-User" id="IMechaniumStakingPool-User"></a>
- uint256 totalStaked
- uint256 totalWeight
- uint256 missingRewards
- uint256 releasedRewards
- struct IMechaniumStakingPool.Deposit[] deposits



### `Deposit`  <a name="IMechaniumStakingPool-Deposit" id="IMechaniumStakingPool-Deposit"></a>
- uint256 amount
- uint256 weight
- uint64 lockedFrom
- uint64 lockedUntil
- bool isRewards
- bool isClaimed



