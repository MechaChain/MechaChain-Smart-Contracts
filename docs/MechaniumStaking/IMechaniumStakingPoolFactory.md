# `IMechaniumStakingPoolFactory`
**Documentation of `MechaniumStaking/IMechaniumStakingPoolFactory.sol`.**

Staking pool factory smart contract interface




## TABLE OF CONTENTS

- [Public Functions](#public-functions)
    - [`createPool`](#IMechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-) 
    - [`createFlashPool`](#IMechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-) 
    - [`addAllocatedTokens`](#IMechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-) 
    - [`addAllocatedTokens`](#IMechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-) 
    - [`withdrawUnallocated`](#IMechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-) 
    - [`releaseUnintendedFromPool`](#IMechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-) 
    - [`getPoolData`](#IMechaniumStakingPoolFactory-getPoolData-address-payable-) 

- [Internal Functions](#internal-functions)




- [Structs](#structs)
    - [`PoolData`](#IMechaniumStakingPoolFactory-PoolData) 





## PUBLIC FUNCTIONS

### `createPool(uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint64 rewardsLockingPeriod, uint256 rewardsPerBlock) → bool` (external) <a name="IMechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-" id="IMechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></a>
Function used to create a new staking pool




### `createFlashPool(contract IERC20 stakedToken, uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint256 rewardsPerBlock) → bool` (external) <a name="IMechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-" id="IMechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-"></a>
Function used to create a new staking flash pool




### `addAllocatedTokens(address pool, uint256 amount) → bool` (external) <a name="IMechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-" id="IMechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-"></a>
Function used to add more tokens to a staking pool




### `addAllocatedTokens(address payable pool, uint256 amount, uint256 rewardPerBlock) → bool` (external) <a name="IMechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-" id="IMechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-"></a>
Function used to add more tokens to a staking pool




### `withdrawUnallocated(address account, uint256 amount) → bool` (external) <a name="IMechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-" id="IMechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-"></a>
Function used to withdraw unallocated tokens




### `releaseUnintendedFromPool(address payable pool, address token_, address account, uint256 amount) → bool` (external) <a name="IMechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-" id="IMechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-"></a>





### `getPoolData(address payable poolAddr) → struct IMechaniumStakingPoolFactory.PoolData` (external) <a name="IMechaniumStakingPoolFactory-getPoolData-address-payable-" id="IMechaniumStakingPoolFactory-getPoolData-address-payable-"></a>





## INTERNAL FUNCTIONS



## STRUCTS

### `PoolData`  <a name="IMechaniumStakingPoolFactory-PoolData" id="IMechaniumStakingPoolFactory-PoolData"></a>
- uint256 allocatedTokens
- uint256 initBlock
- uint256 minStakingTime
- uint256 maxStakingTime
- uint256 minWeightMultiplier
- uint256 maxWeightMultiplier
- uint256 rewardsLockingPeriod
- uint256 rewardsPerBlock



