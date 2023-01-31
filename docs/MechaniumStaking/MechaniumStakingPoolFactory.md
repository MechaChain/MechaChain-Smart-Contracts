# `MechaniumStakingPoolFactory`
**Documentation of `MechaniumStaking/MechaniumStakingPoolFactory.sol`.**

MechaniumStakingPoolFactory - Staking pool factory smart contract




## TABLE OF CONTENTS
- [Events](#events)
    - [`CreatePool`](#MechaniumStakingPoolFactory-CreatePool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-uint256-) 
    - [`CreateFlashPool`](#MechaniumStakingPoolFactory-CreateFlashPool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-) 
    - [`AddAllocatedTokens`](#MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-) 
    - [`AddAllocatedTokens`](#MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-uint256-) 
    - [`WithdrawUnallocated`](#MechaniumStakingPoolFactory-WithdrawUnallocated-address-uint256-) 
    - [`ReleaseUintentedTokens`](#MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-) (inherited)
    - [`OwnershipTransferred`](#Ownable-OwnershipTransferred-address-address-) (inherited)

- [Public Functions](#public-functions)
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
    - [`fallback`](#MechaniumCanReleaseUnintendedOwnable-fallback--) (inherited)
    - [`receive`](#MechaniumCanReleaseUnintendedOwnable-receive--) (inherited)
    - [`releaseUnintended`](#MechaniumCanReleaseUnintendedOwnable-releaseUnintended-address-address-uint256-) (inherited)
    - [`owner`](#Ownable-owner--) (inherited)
    - [`renounceOwnership`](#Ownable-renounceOwnership--) (inherited)
    - [`transferOwnership`](#Ownable-transferOwnership-address-) (inherited)

- [Internal Functions](#internal-functions)
    - [`_transferTokens`](#MechaniumStakingPoolFactory-_transferTokens-address-uint256-) 
    - [`_addLockedToken`](#MechaniumCanReleaseUnintendedOwnable-_addLockedToken-address-) (inherited)
    - [`_checkOwner`](#Ownable-_checkOwner--) (inherited)
    - [`_transferOwnership`](#Ownable-_transferOwnership-address-) (inherited)
    - [`_msgSender`](#Context-_msgSender--) (inherited)
    - [`_msgData`](#Context-_msgData--) (inherited)



- [Modifiers](#modifiers)
    - [`onlyOwner`](#Ownable-onlyOwner--) (inherited)

- [Structs](#structs)
    - [`PoolData`](#IMechaniumStakingPoolFactory-PoolData) (inherited)



## EVENTS

### `CreatePool(address poolAddress, uint256 allocatedTokens, uint256 initBlock, uint256 minStakingTime, uint256 maxStakingTime, uint256 minWeightMultiplier, uint256 maxWeightMultiplier, uint256 rewardsLockingPeriod, uint256 rewardsPerBlock)`  <a name="MechaniumStakingPoolFactory-CreatePool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-uint256-" id="MechaniumStakingPoolFactory-CreatePool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-uint256-"></a>
Event emitted when a staking pool is created





### `CreateFlashPool(address poolAddress, uint256 allocatedTokens, uint256 initBlock, uint256 minStakingTime, uint256 maxStakingTime, uint256 minWeightMultiplier, uint256 maxWeightMultiplier, uint256 rewardsPerBlock)`  <a name="MechaniumStakingPoolFactory-CreateFlashPool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-" id="MechaniumStakingPoolFactory-CreateFlashPool-address-uint256-uint256-uint256-uint256-uint256-uint256-uint256-"></a>
Event emitted when a staking flash pool is created





### `AddAllocatedTokens(address poolAddress, uint256 amount)`  <a name="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-" id="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-"></a>
Event emitted when an `amount` of tokens is added to `poolAddress` token allocation





### `AddAllocatedTokens(address poolAddress, uint256 amount, uint256 rewardsPerBlock)`  <a name="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-uint256-" id="MechaniumStakingPoolFactory-AddAllocatedTokens-address-uint256-uint256-"></a>
Event emitted when an `amount` of tokens is added to `poolAddress` token allocation





### `WithdrawUnallocated(address account, uint256 amount)`  <a name="MechaniumStakingPoolFactory-WithdrawUnallocated-address-uint256-" id="MechaniumStakingPoolFactory-WithdrawUnallocated-address-uint256-"></a>
Event emitted when `amount` of unallocated tokens is withdrawn to an `account`





### `ReleaseUintentedTokens(address token, address account, uint256 amount)` (inherited) <a name="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-" id="MechaniumCanReleaseUnintendedOwnable-ReleaseUintentedTokens-address-address-uint256-"></a>
Event emitted when release unintended `amount` of `token` for `account` address



_Inherited from `MechaniumUtils/MechaniumCanReleaseUnintendedOwnable.sol`_.


### `OwnershipTransferred(address previousOwner, address newOwner)` (inherited) <a name="Ownable-OwnershipTransferred-address-address-" id="Ownable-OwnershipTransferred-address-address-"></a>




_Inherited from `../@openzeppelin/contracts/access/Ownable.sol`_.



## PUBLIC FUNCTIONS

### `constructor(contract IERC20 token_)` (public) <a name="MechaniumStakingPoolFactory-constructor-contract-IERC20-" id="MechaniumStakingPoolFactory-constructor-contract-IERC20-"></a>
========================
    Public Functions
========================





### `createPool(uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint64 rewardsLockingPeriod, uint256 rewardsPerBlock) → bool` (public) <a name="MechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-" id="MechaniumStakingPoolFactory-createPool-uint256-uint32-uint64-uint64-uint16-uint16-uint64-uint256-"></a>
Create new staking pool

Deploy an instance of the StakingPool smart contract and transfer the tokens to it


Parameters:
- `allocatedTokens`: The number of tokens allocated for the pool

- `initBlock`: The initial block of the pool to start

- `minStakingTime`: The minimum time allowed for staking

- `maxStakingTime`: The maximum time allowed for staking

- `minWeightMultiplier`: The minimum weight multiplier

- `maxWeightMultiplier`: The maximum weight multiplier

- `rewardsLockingPeriod`: The rewards locking period

- `rewardsPerBlock`: The rewards per block



### `createFlashPool(contract IERC20 stakedToken, uint256 allocatedTokens, uint32 initBlock, uint64 minStakingTime, uint64 maxStakingTime, uint16 minWeightMultiplier, uint16 maxWeightMultiplier, uint256 rewardsPerBlock) → bool` (public) <a name="MechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-" id="MechaniumStakingPoolFactory-createFlashPool-contract-IERC20-uint256-uint32-uint64-uint64-uint16-uint16-uint256-"></a>
Create new staking flash pool

Deploy an instance of the StakingPool smart contract and transfer the tokens to it


Parameters:
- `allocatedTokens`: The number of tokens allocated for the pool

- `initBlock`: The initial block of the pool to start

- `minStakingTime`: The minimum time allowed for staking

- `maxStakingTime`: The maximum time allowed for staking

- `minWeightMultiplier`: The minimum weight multiplier

- `maxWeightMultiplier`: The maximum weight multiplier

- `rewardsPerBlock`: The rewards per block



### `addAllocatedTokens(address poolAddr, uint256 amount) → bool` (public) <a name="MechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-" id="MechaniumStakingPoolFactory-addAllocatedTokens-address-uint256-"></a>
Allocate more tokens to a staking pool

Safe transfer the tokens to the pool


Parameters:
- `poolAddr`: The pool address

- `amount`: The amount of tokens to allocate



### `addAllocatedTokens(address payable poolAddr, uint256 amount, uint256 rewardsPerBlock) → bool` (public) <a name="MechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-" id="MechaniumStakingPoolFactory-addAllocatedTokens-address-payable-uint256-uint256-"></a>
Allocate more tokens to a staking pool and change the rewards per block

Safe transfer the tokens to the pool


Parameters:
- `poolAddr`: The pool address

- `amount`: The amount of tokens to allocate

- `rewardsPerBlock`: The new rewards per block



### `withdrawUnallocated(address account, uint256 amount) → bool` (public) <a name="MechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-" id="MechaniumStakingPoolFactory-withdrawUnallocated-address-uint256-"></a>
Withdraw unallocated tokens



Parameters:
- `account`: The account that will receive the tokens

- `amount`: The amount of tokens to withdraw



### `releaseUnintendedFromPool(address payable pool, address token_, address account, uint256 amount) → bool` (public) <a name="MechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-" id="MechaniumStakingPoolFactory-releaseUnintendedFromPool-address-payable-address-address-uint256-"></a>
Release unintended tokens



Parameters:
- `pool`: The staking pool to release from

- `token_`: The token to release

- `account`: The account to send the tokens to

- `amount`: The amount of tokens to release



### `token() → contract IERC20` (public) <a name="MechaniumStakingPoolFactory-token--" id="MechaniumStakingPoolFactory-token--"></a>
Get the factory ERC20 token





### `balance() → uint256` (public) <a name="MechaniumStakingPoolFactory-balance--" id="MechaniumStakingPoolFactory-balance--"></a>
Get the factory ERC20 token balance





### `getPoolData(address payable poolAddr) → struct IMechaniumStakingPoolFactory.PoolData` (public) <a name="MechaniumStakingPoolFactory-getPoolData-address-payable-" id="MechaniumStakingPoolFactory-getPoolData-address-payable-"></a>
Get staking pool data



Parameters:
- `poolAddr`: The pool address



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

### `_transferTokens(address account, uint256 amount) → bool` (internal)  <a name="MechaniumStakingPoolFactory-_transferTokens-address-uint256-" id="MechaniumStakingPoolFactory-_transferTokens-address-uint256-"></a>
========================
   Private functions
========================





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

### `PoolData` (inherited) <a name="IMechaniumStakingPoolFactory-PoolData" id="IMechaniumStakingPoolFactory-PoolData"></a>
- uint256 allocatedTokens
- uint256 initBlock
- uint256 minStakingTime
- uint256 maxStakingTime
- uint256 minWeightMultiplier
- uint256 maxWeightMultiplier
- uint256 rewardsLockingPeriod
- uint256 rewardsPerBlock

_Inherited from `MechaniumStaking/IMechaniumStakingPoolFactory.sol`_.


