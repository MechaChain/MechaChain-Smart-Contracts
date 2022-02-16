# `MechaniumStakingPoolFactory`
MechaniumStakingPoolFactory - Staking pool factory smart contract




**Table of Contents**
- [EVENTS](#events)
    - [`CreatePool`](#MechaniumStakingPoolFactory-CreatePool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-uint256-)
    - [`CreateFlashPool`](#MechaniumStakingPoolFactory-CreateFlashPool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-)
    - [`AddAllocatedTokens`](#MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-)
    - [`AddAllocatedTokens`](#MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-uint256-)
    - [`WithdrawUnallocated`](#MechaniumStakingPoolFactory-WithdrawUnallocated-address-uint256-)

- [PUBLIC FUNCTIONS](#public-functions)
    - [`constructor`](#MechaniumStakingPoolFactory-constructor-contract-IERC20-)
    - [`createPool`](#MechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-)
    - [`createFlashPool`](#MechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-)
    - [`addAllocatedTokens`](#MechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-)
    - [`addAllocatedTokens`](#MechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-)
    - [`withdrawUnallocated`](#MechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-)
    - [`releaseUnintendedFromPool`](#MechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-)
    - [`token`](#MechaniumStakingPoolFactory-token--)
    - [`balance`](#MechaniumStakingPoolFactory-balance--)
    - [`getPoolData`](#MechaniumStakingPoolFactory-getPoolData-address-payable-)

- [PRIVATE FUNCTIONS](#private-functions)
    - [`_transferTokens`](#MechaniumStakingPoolFactory-_transferTokens-address-uint256-)





## EVENTS

### `CreatePool(address poolAddress, uint256 allocatedTokens, uint256 initBlock, uint256 minStakingTime, uint256 maxStakingTime, uint256 minWeightMultiplier, uint256 maxWeightMultiplier, uint256 rewardsLockingPeriod, uint256 rewardsPerBlock)` <span id="MechaniumStakingPoolFactory-CreatePool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-uint256-"></span>
Event emitted when a staking pool is created


### `CreateFlashPool(address poolAddress, uint256 allocatedTokens, uint256 initBlock, uint256 minStakingTime, uint256 maxStakingTime, uint256 minWeightMultiplier, uint256 maxWeightMultiplier, uint256 rewardsPerBlock)` <span id="MechaniumStakingPoolFactory-CreateFlashPool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-"></span>
Event emitted when a staking flash pool is created


### `AddAllocatedTokens(address poolAddress, uint256 amount)` <span id="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-"></span>
Event emitted when an `amount` of tokens is added to `poolAddress` token allocation


### `AddAllocatedTokens(address poolAddress, uint256 amount, uint256 rewardsPerBlock)` <span id="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-uint256-"></span>
Event emitted when an `amount` of tokens is added to `poolAddress` token allocation


### `WithdrawUnallocated(address account, uint256 amount)` <span id="MechaniumStakingPoolFactory-WithdrawUnallocated-address-uint256-"></span>
Event emitted when `amount` of unallocated tokens is withdrawn to an `account`



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_)` (public) <span id="MechaniumStakingPoolFactory-constructor-contract-IERC20-"></span>
========================
    Public Functions
========================


### `createPool(uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint64 rewardsLockingPeriod, uint256 rewardsPerBlock) → bool` (public) <span id="MechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></span>
Create new staking pool

Deploy an instance of the StakingPool smart contract and transfer the tokens to it

- `allocatedTokens`: The number of tokens allocated for the pool

- `initBlock`: The initial block of the pool to start

- `minStakingTime`: The minimum time allowed for staking

- `maxStakingTime`: The maximum time allowed for staking

- `minWeightMultiplier`: The minimum weight multiplier

- `maxWeightMultiplier`: The maximum weight multiplier

- `rewardsLockingPeriod`: The rewards locking period

- `rewardsPerBlock`: The rewards per block

### `createFlashPool(contract IERC20 stakedToken, uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint256 rewardsPerBlock) → bool` (public) <span id="MechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-"></span>
Create new staking flash pool

Deploy an instance of the StakingPool smart contract and transfer the tokens to it

- `allocatedTokens`: The number of tokens allocated for the pool

- `initBlock`: The initial block of the pool to start

- `minStakingTime`: The minimum time allowed for staking

- `maxStakingTime`: The maximum time allowed for staking

- `minWeightMultiplier`: The minimum weight multiplier

- `maxWeightMultiplier`: The maximum weight multiplier

- `rewardsPerBlock`: The rewards per block

### `addAllocatedTokens(address poolAddr, uint256 amount) → bool` (public) <span id="MechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-"></span>
Allocate more tokens to a staking pool

Safe transfer the tokens to the pool

- `poolAddr`: The pool address

- `amount`: The amount of tokens to allocate

### `addAllocatedTokens(address payable poolAddr, uint256 amount, uint256 rewardsPerBlock) → bool` (public) <span id="MechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-"></span>
Allocate more tokens to a staking pool and change the rewards per block

Safe transfer the tokens to the pool

- `poolAddr`: The pool address

- `amount`: The amount of tokens to allocate

- `rewardsPerBlock`: The new rewards per block

### `withdrawUnallocated(address account, uint256 amount) → bool` (public) <span id="MechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-"></span>
Withdraw unallocated tokens


- `account`: The account that will receive the tokens

- `amount`: The amount of tokens to withdraw

### `releaseUnintendedFromPool(address payable pool, address token_, address account, uint256 amount) → bool` (public) <span id="MechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-"></span>
Release unintended tokens


- `pool`: The staking pool to release from

- `token_`: The token to release

- `account`: The account to send the tokens to

- `amount`: The amount of tokens to release

### `token() → contract IERC20` (public) <span id="MechaniumStakingPoolFactory-token--"></span>
Get the factory ERC20 token


### `balance() → uint256` (public) <span id="MechaniumStakingPoolFactory-balance--"></span>
Get the factory ERC20 token balance


### `getPoolData(address payable poolAddr) → struct IMechaniumStakingPoolFactory.PoolData` (public) <span id="MechaniumStakingPoolFactory-getPoolData-address-payable-"></span>
Get staking pool data


- `poolAddr`: The pool address

## PRIVATE FUNCTIONS
### `_transferTokens(address account, uint256 amount) → bool` (internal) <span id="MechaniumStakingPoolFactory-_transferTokens-address-uint256-"></span>
========================
   Private functions
========================




