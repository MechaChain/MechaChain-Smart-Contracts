# `IMechaniumStakingPoolFactory`
Staking pool factory smart contract interface




**Table of Contents**

- [PUBLIC FUNCTIONS](#public-functions)
    - [`createPool`](#IMechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-)
    - [`createFlashPool`](#IMechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-)
    - [`addAllocatedTokens`](#IMechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-)
    - [`addAllocatedTokens`](#IMechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-)
    - [`withdrawUnallocated`](#IMechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-)
    - [`releaseUnintendedFromPool`](#IMechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-)
    - [`getPoolData`](#IMechaniumStakingPoolFactory-getPoolData-address-payable-)

- [PRIVATE FUNCTIONS](#private-functions)


- [STRUCTS](#structs)
    - [`PoolData`](#IMechaniumStakingPoolFactory-PoolData)





## PUBLIC FUNCTIONS

### `createPool(uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint64 rewardsLockingPeriod, uint256 rewardsPerBlock) → bool` (external) <span id="IMechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></span>
Function used to create a new staking pool


### `createFlashPool(contract IERC20 stakedToken, uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint256 rewardsPerBlock) → bool` (external) <span id="IMechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-"></span>
Function used to create a new staking flash pool


### `addAllocatedTokens(address pool, uint256 amount) → bool` (external) <span id="IMechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-"></span>
Function used to add more tokens to a staking pool


### `addAllocatedTokens(address payable pool, uint256 amount, uint256 rewardPerBlock) → bool` (external) <span id="IMechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-"></span>
Function used to add more tokens to a staking pool


### `withdrawUnallocated(address account, uint256 amount) → bool` (external) <span id="IMechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-"></span>
Function used to withdraw unallocated tokens


### `releaseUnintendedFromPool(address payable pool, address token_, address account, uint256 amount) → bool` (external) <span id="IMechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-"></span>



### `getPoolData(address payable poolAddr) → struct IMechaniumStakingPoolFactory.PoolData` (external) <span id="IMechaniumStakingPoolFactory-getPoolData-address-payable-"></span>



## PRIVATE FUNCTIONS


## STRUCTS

### `PoolData` <span id="IMechaniumStakingPoolFactory-PoolData"></span>
- uint256 allocatedTokens
- uint256 initBlock
- uint256 minStakingTime
- uint256 maxStakingTime
- uint256 minWeightMultiplier
- uint256 maxWeightMultiplier
- uint256 rewardsLockingPeriod
- uint256 rewardsPerBlock

